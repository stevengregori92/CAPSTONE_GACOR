const { Storage } = require('@google-cloud/storage');
const bucketName = process.env.BUCKET_NAME;

const uploadFile = async (fileBuffer, fileName, fileExt, foldDest) => {
  const storage = new Storage({ keyFilename: process.env.KEY_DIR });
  const bucket = storage.bucket(bucketName);
  const destination = `${foldDest}/${fileName}.${fileExt}`;

  try {
    const file = bucket.file(destination);
    const stream = file.createWriteStream({
      metadata: {
        contentType: `image/${fileExt}`,
      },
      gzip: true,
    });

    stream.end(fileBuffer);

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
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
