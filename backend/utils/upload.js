const multer = require('multer');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

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

// Middleware to compress image and upload to S3
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  const safeOriginalName = req.file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
  const filename = `${Date.now()}-${safeOriginalName}.jpg`;

  try {
    // Process image in memory
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to S3
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: compressedBuffer,
      ContentType: 'image/jpeg',
      // If the bucket doesn't have public access block, you can use acl: 'public-read'
      // If you are relying on Bucket Policies for public access, you can omit the ACL.
    });

    await s3Client.send(command);

    // Build the public S3 URL
    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    
    req.file.filename = filename;
    req.file.url = s3Url;
    next();
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: 'Failed to compress and upload image to AWS S3.' });
  }
};

module.exports = { upload, compressImage };
