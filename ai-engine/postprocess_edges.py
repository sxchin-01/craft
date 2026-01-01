from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import sys

def enhance_edges(in_path, out_path):
    im = Image.open(in_path).convert('RGBA')

    # Sharpen overall image
    im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))

    # Create an edge mask
    gray = im.convert('L')
    edges = gray.filter(ImageFilter.FIND_EDGES)
    # Boost contrast of edges
    edges = ImageOps.autocontrast(edges)
    edges = edges.point(lambda p: 255 if p > 30 else 0)

    # Make a subtle dark edge overlay
    edge_overlay = Image.new('RGBA', im.size, (0,0,0,0))
    edge_layer = Image.new('L', im.size)
    edge_layer.paste(edges)
    edge_overlay.putalpha(edge_layer)

    # Composite a semi-transparent darkening along edges
    darken = Image.new('RGBA', im.size, (0,0,0,120))
    darken.putalpha(edge_layer)

    # Blend original with darken overlay (edges appear crisper)
    out = Image.alpha_composite(im, darken)

    # Final contrast/brightness tweaks
    out = out.convert('RGB')
    out = ImageEnhance.Contrast(out).enhance(1.1)
    out = ImageEnhance.Sharpness(out).enhance(1.2)

    out.save(out_path)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: postprocess_edges.py <input> <output>')
        sys.exit(2)
    enhance_edges(sys.argv[1], sys.argv[2])
