require('dotenv').config();
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function main() {
  try {
    const result = await s3.send(new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      MaxKeys: 5,
    }));
    console.log('✅ S3 Storage is WORKING!');
    console.log(`Bucket: ${process.env.AWS_S3_BUCKET_NAME}`);
    console.log(`Objects found: ${result.KeyCount}`);
    if (result.Contents && result.Contents.length > 0) {
      console.log('Sample files:');
      result.Contents.forEach(f => console.log(' -', f.Key));
    }
  } catch (error) {
    console.error('❌ S3 Storage FAILED:', error.message);
  }
}

main();
