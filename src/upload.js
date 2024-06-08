const { Storage } = require('@google-cloud/storage');
const bucketName = process.env.BUCKET_NAME;

const uploadFile = async (fileName, fileExt, foldDest) => {
  const storage = new Storage({ keyFilename: process.env.KEY_DIR });
  const bucket = storage.bucket(bucketName);
  const filePath = `./uploads/${fileName}.${fileExt}`;
  const destination = `${foldDest}/${fileName}.${fileExt}`;

  try {
    await bucket.upload(filePath, {
      destination: destination,
      gzip: true,
    });

    console.log(`${fileName}.${fileExt} uploaded to ${bucketName}/${destination}.`);

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    console.log("Public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};

module.exports = uploadFile;
