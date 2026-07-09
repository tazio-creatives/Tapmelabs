const path = require("path");
const fs   = require("fs");

const MAX_FILE_SIZE  = 2 * 1024 * 1024; // 2 MB — matches uploadController.js's limit
const UPLOADS_ROOT    = path.join(__dirname, "..", "..", "uploads");
const EXT_BY_MIMETYPE = {
  "image/jpeg": ".jpg",
  "image/jpg":  ".jpg",
  "image/png":  ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

// Decodes a "data:<mimetype>;base64,<data>" string and writes it to
// uploads/<folder>/<baseName>-<random><ext>. Returns the public URL, or null
// if the input isn't a recognized data URI or exceeds MAX_FILE_SIZE.
function base64ToFile(dataUri, folder, baseName, req) {
  if (typeof dataUri !== "string") return null;

  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUri);
  if (!match) return null;

  const [, mimetype, data] = match;
  const ext = EXT_BY_MIMETYPE[mimetype];
  if (!ext) return null;

  const buffer = Buffer.from(data, "base64");
  if (buffer.length > MAX_FILE_SIZE) return null;

  const dest = path.join(UPLOADS_ROOT, folder);
  fs.mkdirSync(dest, { recursive: true });

  const filename = `${baseName}-${Math.round(Math.random() * 1e9)}${ext}`;
  fs.writeFileSync(path.join(dest, filename), buffer);

  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${filename}`;
}

module.exports = base64ToFile;
