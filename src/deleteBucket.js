const { Storage } = require('@google-cloud/storage');
const url = require('url');

const storage = new Storage({ keyFilename: process.env.KEY_DIR });

async function deleteFileByUrl(publicUrl) {
  try {
    const parsedUrl = url.parse(publicUrl);
    const pathSegments = parsedUrl.pathname.split('/');

    const bucketName = pathSegments[1];
    const filePath = pathSegments.slice(2).join('/');

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);
    
    await file.delete();
    console.log(`gs://${bucketName}/${filePath} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('File deletion failed');
  }
}

module.exports = deleteFileByUrl;
