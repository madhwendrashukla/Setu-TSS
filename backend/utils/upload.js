const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload dir exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer memory storage for initial upload before processing with sharp
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Middleware to compress image and save to disk
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  const safeOriginalName = req.file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
  const filename = `${Date.now()}-${safeOriginalName}.jpg`;
  const filepath = path.join(uploadDir, filename);

  try {
    await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toFile(filepath);

    req.file.filename = filename;
    req.file.path = filepath;
    req.file.url = `http://localhost:5000/uploads/${filename}`; // Local URL
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to compress and save image.' });
  }
};

module.exports = { upload, compressImage };
