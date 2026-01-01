const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8001';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// Process the uploaded image, call AI engine, save result and return URL
exports.startProcess = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Prepare form for AI engine
    const form = new FormData();
    form.append('files', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
    });

    // Provide a concise reconstruction prompt the AI engine can use
    try {
      form.append('prompt', 'Reconstruct an intact, photorealistic version of the object shown in the uploaded fragment. Output a single 1024x1024 PNG. Neutral background, realistic studio lighting, realistic ceramic texture.');
    } catch (e) {}

    const jobId = Date.now().toString();
    const restoredFilename = `restored-${jobId}${path.extname(req.file.originalname) || '.png'}`;
    const restoredPath = path.join(UPLOAD_DIR, restoredFilename);

    try {
      // Prefer AI_ENGINE_URL if it points to port 8001, otherwise force localhost:8001
      const preferred = (process.env.AI_ENGINE_URL && process.env.AI_ENGINE_URL.includes('8001'))
        ? process.env.AI_ENGINE_URL
        : 'http://127.0.0.1:8001';
      const endpoint = `${preferred.replace(/\/$/, '')}/reconstruct`;
      console.log(`Calling AI engine at ${endpoint}`);

      const aiResp = await axios.post(endpoint, form, {
        headers: form.getHeaders(),
        responseType: 'stream',
        timeout: 10 * 60 * 1000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log('AI engine responded with status', aiResp.status, 'from', endpoint);
      const contentType = aiResp.headers && aiResp.headers['content-type'] ? aiResp.headers['content-type'] : '';
      const contentLength = aiResp.headers && aiResp.headers['content-length'] ? parseInt(aiResp.headers['content-length'], 10) : NaN;
      console.log('AI response headers', contentType, aiResp.headers && aiResp.headers['content-length']);

      // If the AI engine returned non-image content or a very small payload,
      // collect the response body and return an error instead of writing a tiny file.
      if (!contentType.startsWith('image/') || (contentLength && contentLength < 2000)) {
        try {
          const chunks = [];
          await new Promise((resolve, reject) => {
            aiResp.data.on('data', c => chunks.push(c));
            aiResp.data.on('end', resolve);
            aiResp.data.on('error', reject);
          });
          const buf = Buffer.concat(chunks);
          const text = buf.toString('utf8');
          console.error('AI engine returned non-image or tiny response:', contentType, contentLength, text.slice(0, 1000));
          return res.status(502).json({ error: 'AI engine returned invalid image', details: text.slice(0, 1000) });
        } catch (e) {
          console.error('Error reading AI engine non-image response:', e);
          return res.status(502).json({ error: 'AI engine returned invalid response' });
        }
      }

      // Pipe response to file when it looks like a valid image stream
      const writer = fs.createWriteStream(restoredPath);
      aiResp.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Ensure file exists and is non-empty
      let stats;
      try {
        stats = fs.statSync(restoredPath);
      } catch (fsErr) {
        console.error('Failed to stat restored file', fsErr);
      }

      if (!stats || stats.size === 0) {
        console.error('Restored file missing or empty', restoredPath, stats && stats.size);
        return res.status(502).json({ error: 'AI engine returned empty image' });
      }

      // Build full URL and return it so frontend can directly fetch the image
      const host = req.get && req.get('host') ? req.get('host') : 'localhost:3001';
      const protocol = req.protocol || 'http';
      // Append cache-busting timestamp so browsers always fetch the fresh image
      const fullUrl = `${protocol}://${host}/uploads/${restoredFilename}?t=${Date.now()}`;
      return res.status(200).json({ url: fullUrl });
    } catch (aiError) {
      console.error('AI engine error:', aiError && aiError.message ? aiError.message : aiError);
      if (aiError && aiError.response) {
        try {
          console.error('AI error response status:', aiError.response.status);
          // Try to read small text body for debugging
          if (aiError.response.data) {
            try {
              const chunks = [];
              aiError.response.data.on && aiError.response.data.on('data', c => chunks.push(c));
              aiError.response.data.on && aiError.response.data.on('end', () => {
                try {
                  const buf = Buffer.concat(chunks);
                  console.error('AI error response body (buffer):', buf.toString('utf8').slice(0, 1000));
                } catch (e) {}
              });
            } catch (e) {}
          }
        } catch (e) {}
      }
      return res.status(502).json({ error: 'AI engine processing failed' });
    }
  } catch (error) {
    console.error('Start process error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = exports;
