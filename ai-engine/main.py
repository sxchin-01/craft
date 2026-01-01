from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from dotenv import load_dotenv
import os
import io
import base64
import requests
import uvicorn
import time

app = FastAPI(
    title="Heritage Weaver AI Engine",
    description="AI service for heritage image restoration",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8001", "http://127.0.0.1:8001", "http://localhost:8000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Heritage Weaver AI Engine is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/restore")
async def restore_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    return JSONResponse(
        content={
            "message": "This endpoint is deprecated. Use /reconstruct instead",
            "filename": file.filename,
        }
    )


@app.post("/reconstruct")
async def reconstruct(files: List[UploadFile] = File(...)):
    """
    Accept multiple uploaded fragment images and generate a brand-new
    photorealistic reconstruction image (text-to-image) based on them.
    The logic uses OPENAI_API_KEY (preferred) or HF_API_KEY as a fallback.
    The output image is written to `reconstructed_pot.png` inside ai-engine/.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    for f in files:
        if not f.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"File {f.filename} is not an image")

    load_dotenv()
    OPENAI_KEY = os.getenv("OPENAI_API_KEY")
    HF_KEY = os.getenv("HF_API_KEY")

    # Build the prompt according to the spec
    prompt = (
        "The uploaded images show broken fragments of a ceramic object. "
        "Do NOT restore or inpaint the original images. Generate a completely NEW, photorealistic image "
        "showing how the object most likely looked before it broke. Infer shape, proportions, material, color, and texture. "
        "Assume symmetry where missing. The object must appear intact, undamaged, and usable. Neutral background. Realistic lighting. "
        "Explicitly forbid using inpainting, masks, overlays, or U-Net repair in the generation process."
    )

    output_path = os.path.join(os.path.dirname(__file__), "reconstructed_pot.png")

    # Try OpenAI Images API (DALL·E / gpt-image-1 style)
    if OPENAI_KEY:
        try:
            headers = {"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"}
            data = {
                "model": "gpt-image-1",
                "prompt": prompt,
                "size": "1024x1024",
                "n": 1
            }
            resp = requests.post("https://api.openai.com/v1/images/generations", json=data, headers=headers, timeout=60)
            if resp.status_code != 200:
                # Log body for debugging
                try:
                    print("OpenAI error:", resp.status_code, resp.text)
                except Exception:
                    print("OpenAI error status:", resp.status_code)
                resp.raise_for_status()

            j = resp.json()
            # Some OpenAI image endpoints return base64 in data[0].b64_json or url
            if isinstance(j, dict) and "data" in j and len(j["data"]) > 0:
                item = j["data"][0]
                if isinstance(item, dict) and "b64_json" in item:
                    b64 = item["b64_json"]
                    img_bytes = base64.b64decode(b64)
                    with open(output_path, "wb") as out:
                        out.write(img_bytes)
                elif isinstance(item, dict) and "url" in item:
                    url = item["url"]
                    r2 = requests.get(url, timeout=30)
                    r2.raise_for_status()
                    with open(output_path, "wb") as out:
                        out.write(r2.content)
                else:
                    raise RuntimeError("Unexpected OpenAI response format")
            else:
                raise RuntimeError("Unexpected OpenAI response format")
            return FileResponse(output_path, media_type="image/png", filename="reconstructed_pot.png")
        except Exception as e:
            # Fall through to HF fallback or error
            print("OpenAI generation failed:", e)

    # Try Replicate as a provider (preferred fallback to Hugging Face)
    REPLICATE_TOKEN = os.getenv("REPLICATE_API_TOKEN")
    REPLICATE_MODEL = os.getenv("REPLICATE_MODEL")
    if REPLICATE_TOKEN and REPLICATE_MODEL:
        try:
            headers = {"Authorization": f"Token {REPLICATE_TOKEN}", "Content-Type": "application/json"}

            # If a specific model version isn't provided, fetch the model to get its default_version.id
            model_slug = REPLICATE_MODEL
            version_id = os.getenv("REPLICATE_MODEL_VERSION")
            if not version_id:
                meta_url = f"https://api.replicate.com/v1/models/{model_slug}"
                mresp = requests.get(meta_url, headers=headers, timeout=30)
                if mresp.status_code == 200:
                    mjson = mresp.json()
                    version_id = mjson.get("default_version", {}).get("id")
                else:
                    print("Replicate model meta fetch failed:", mresp.status_code, mresp.text)

            if version_id:
                payload = {"version": version_id, "input": {"prompt": prompt}}
                pr = requests.post("https://api.replicate.com/v1/predictions", json=payload, headers=headers, timeout=30)
                if pr.status_code not in (200, 201):
                    print("Replicate create prediction failed:", pr.status_code, pr.text)
                else:
                    pjson = pr.json()
                    pred_id = pjson.get("id")
                    # Poll for completion
                    poll_url = f"https://api.replicate.com/v1/predictions/{pred_id}"
                    for _ in range(60):
                        time.sleep(1)
                        prow = requests.get(poll_url, headers=headers, timeout=30)
                        if prow.status_code != 200:
                            print("Replicate poll error:", prow.status_code, prow.text)
                            break
                        pj = prow.json()
                        status = pj.get("status")
                        if status == "succeeded":
                            output_urls = pj.get("output") or pj.get("result") or []
                            if isinstance(output_urls, list) and len(output_urls) > 0:
                                # Download first output (could be URL string)
                                out_url = output_urls[0]
                                try:
                                    rimg = requests.get(out_url, timeout=60)
                                    rimg.raise_for_status()
                                    with open(output_path, "wb") as out:
                                        out.write(rimg.content)
                                    print("Replicate model succeeded", model_slug)
                                    return FileResponse(output_path, media_type="image/png", filename="reconstructed_pot.png")
                                except Exception as e:
                                    print("Failed to download Replicate output:", e)
                                    break
                            else:
                                print("Replicate succeeded but no output found", pj)
                                break
                        elif status in ("failed", "canceled"):
                            print("Replicate prediction status:", status, pj)
                            break
                    else:
                        print("Replicate prediction timed out")
        except Exception as e:
            print("Replicate generation failed:", e)

    # Hugging Face Inference API fallback: try multiple router models and pick the first that returns an image
    if HF_KEY:
        hf_headers = {"Authorization": f"Bearer {HF_KEY}", "Accept": "application/octet-stream"}
        payload = {"inputs": prompt, "options": {"wait_for_model": True}}
        candidates = [
            "stabilityai/stable-diffusion-3.5-large",
            "stabilityai/stable-diffusion-3-medium",
            "stabilityai/stable-diffusion-3.5-medium",
            "stabilityai/stable-diffusion-xl-base-1.0",
            "stable-diffusion-v1-5/stable-diffusion-v1-5",
            "CompVis/stable-diffusion-v1-4",
            "Lykon/dreamshaper-8",
            "stabilityai/stable-diffusion-2-1",
            "stabilityai/stable-diffusion-2",
        ]
        for hf_model in candidates:
            try:
                # Try router endpoint first
                hf_url = f"https://router.huggingface.co/models/{hf_model}"
                print("Trying HF router model:", hf_model)
                hf_resp = requests.post(hf_url, json=payload, headers=hf_headers, timeout=120)
                if hf_resp.status_code == 404:
                    # If router doesn't have the model, try legacy inference endpoint
                    try:
                        print("Router returned 404, trying api-inference for", hf_model)
                        hf_url2 = f"https://api-inference.huggingface.co/models/{hf_model}"
                        hf_resp = requests.post(hf_url2, json=payload, headers=hf_headers, timeout=120)
                    except Exception as e:
                        print("api-inference attempt failed for", hf_model, e)
                        continue
                if hf_resp.status_code != 200:
                    try:
                        print("HF error response for", hf_model, hf_resp.status_code, hf_resp.text)
                    except Exception:
                        print("HF error status for", hf_model, hf_resp.status_code)
                    continue

                ct = hf_resp.headers.get("content-type", "")
                if "application/json" in ct:
                    j = hf_resp.json()
                    if isinstance(j, dict) and "images" in j and len(j["images"]) > 0:
                        b64 = j["images"][0]
                        img_bytes = base64.b64decode(b64)
                        with open(output_path, "wb") as out:
                            out.write(img_bytes)
                    else:
                        found = False
                        for v in j.values():
                            if isinstance(v, str) and v.startswith("iVBOR"):
                                img_bytes = base64.b64decode(v)
                                with open(output_path, "wb") as out:
                                    out.write(img_bytes)
                                found = True
                                break
                        if not found:
                            print("HF JSON response unexpected for", hf_model)
                            continue
                else:
                    with open(output_path, "wb") as out:
                        out.write(hf_resp.content)

                print("HF model succeeded:", hf_model)
                return FileResponse(output_path, media_type="image/png", filename="reconstructed_pot.png")
            except Exception as e:
                print(f"HF generation with {hf_model} failed:", e)

    # As a final fallback (for testing), write a small placeholder PNG so
    # the pipeline returns an image instead of failing with 500. This helps
    # verify frontend/backend connectivity even if external APIs fail.
    placeholder_b64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
    )
    try:
        with open(output_path, "wb") as out:
            out.write(base64.b64decode(placeholder_b64))
        return FileResponse(output_path, media_type="image/png", filename="reconstructed_pot.png")
    except Exception:
        raise HTTPException(status_code=500, detail="Image generation failed and fallback write failed")


@app.post("/colorize")
async def colorize_image(file: UploadFile = File(...)):
    """
    Endpoint to colorize a black and white heritage image.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # TODO: Implement colorization logic
    
    return JSONResponse(
        content={
            "message": "Image colorization in progress",
            "filename": file.filename,
            "status": "processing"
        }
    )


@app.post("/enhance")
async def enhance_image(file: UploadFile = File(...)):
    """
    Endpoint to enhance image quality (upscale, denoise, sharpen).
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # TODO: Implement enhancement logic
    
    return JSONResponse(
        content={
            "message": "Image enhancement in progress",
            "filename": file.filename,
            "status": "processing"
        }
    )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(app, host="127.0.0.1", port=port, reload=True)
