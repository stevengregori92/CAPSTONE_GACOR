const { Storage } = require('@google-cloud/storage');
const bucketName = "example-bucket-test-cc-trw";

const uploadFile = async (fileName, fileExt) => {
const storage = new Storage({ keyFilename: './src/key.json' });
  await storage.bucket(bucketName).upload(`./uploads/${fileName}.${fileExt}`, {
    gzip: true,
  });

  console.log(`${fileName}.${fileExt} uploaded to ${bucketName}.`);

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}.${fileExt}`;
  console.log("Public URL:", publicUrl);

  return publicUrl;
}

module.exports = uploadFile;
