const multer = require('multer');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

// Initialize S3 Client
// In production, ensure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET are in .env
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
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
const compressAndUploadS3 = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}.jpg`;

  try {
    // Compress image
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to S3
    const bucketName = process.env.AWS_S3_BUCKET || 'startup-school-assets';
    const s3Key = `uploads/${filename}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: compressedBuffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read' // Assumes bucket allows public read
    }));

    req.file.filename = filename;
    req.file.url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`; 
    
    next();
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ error: 'Failed to compress and upload image to S3.' });
  }
};

module.exports = { upload, compressImage: compressAndUploadS3 };
