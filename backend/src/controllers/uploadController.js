const path = require("path");
const fs   = require("fs");
const multer = require("multer");

// ── Config ────────────────────────────────────────────────────────────────────

const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// Resolve the uploads root to <project_root>/uploads regardless of where the
// process is started from.
const UPLOADS_ROOT = path.join(__dirname, "..", "..", "uploads");

// ── Folder factory ────────────────────────────────────────────────────────────
// Returns [multerErrorWrapper, responseHandler] — an array Express accepts as a
// handler chain.  Each upload type gets its own isolated multer instance so
// destination folders and error messages stay specific.

function createUploadHandler(folder) {
  const dest = path.join(UPLOADS_ROOT, folder);
  fs.mkdirSync(dest, { recursive: true }); // ensure folder exists at boot

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
        return cb(null, true);
      }
      const err = new Error(
        "Invalid file type. Allowed: jpg, jpeg, png, webp, svg."
      );
      err.status = 400;
      cb(err, false);
    },
  }).single("image");

  // Wrap multer so its errors flow through the standard response format instead
  // of reaching the global error handler with a raw MulterError object.
  function multerWrapper(req, res, next) {
    upload(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? "File size must not exceed 2 MB."
            : err.message;
        return res.status(400).json({ success: false, message, data: null });
      }

      return res
        .status(err.status || 400)
        .json({ success: false, message: err.message, data: null });
    });
  }

  function respond(req, res) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Send the file as form-data with key 'image'.",
        data: null,
      });
    }

    // TODO: Replace local URL with S3 / DigitalOcean Spaces URL when cloud
    // storage is integrated.
    // Example:
    //   const url = await uploadToSpaces(req.file.path, `${folder}/${req.file.filename}`);
    //   fs.unlinkSync(req.file.path); // remove temp file after upload
    const url = `${req.protocol}://${req.get("host")}/uploads/${folder}/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      data: {
        url,
        filename: req.file.filename,
        original_name: req.file.originalname,
        size_bytes: req.file.size,
        folder,
      },
    });
  }

  return [multerWrapper, respond];
}

// ── Upload handlers per type ──────────────────────────────────────────────────

const uploadProductImage    = createUploadHandler("products");
const uploadProfileImage    = createUploadHandler("profiles");
const uploadCompanyLogo     = createUploadHandler("logos");
const uploadThemePreview    = createUploadHandler("themes");
const uploadSvgBackground   = createUploadHandler("svg-backgrounds");

module.exports = {
  uploadProductImage,
  uploadProfileImage,
  uploadCompanyLogo,
  uploadThemePreview,
  uploadSvgBackground,
};
