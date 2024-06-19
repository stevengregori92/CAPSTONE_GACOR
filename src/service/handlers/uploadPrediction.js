const nanoid = require("nanoid");
const { queryUploadScan, queryCheckUserEmail } = require("../mysql");
const authenticateUser = require("../authentication.js");
const uploadFile = require("../../cloud bucket/uploadBucket.js");

const uploadNewScan = (id, link, diagnosis, referensi, deskripsi, user) => {
  return new Promise((resolve, reject) => {
    queryUploadScan(
      id,
      link,
      diagnosis,
      referensi,
      deskripsi,
      user,
      (querySuccess) => {
        if (querySuccess) {
          resolve(true);
        } else {
          reject(new Error("Upload scan failed"));
        }
      }
    );
  });
};

const uploadPrediction = async (request, h) => {
  const auth = authenticateUser(request);
  if (!auth.isValid) {
    const response = h.response({
      status: "fail",
      message: auth.errorMessage,
    });
    response.code(400);
    return response;
  }

  const email = auth.decoded.email;
  
  const user = await new Promise((resolve, reject) => {
    queryCheckUserEmail(email, (querySuccess, queryResults) => {
      if (!querySuccess || queryResults.length === 0) {
        return reject(new Error("Invalid credentials"));
      }
      resolve(queryResults[0]);
    });
  });

  if (!user.U_ID){
    const response = h.response({
      status: "fail",
      message: "User not found",
    });
    response.code(400);
    return response;
  }
  
  let data = request.payload.data;
  data = JSON.parse(data)

  const image = request.payload.image;

  if (!data.name || !data.link || !data.step || !image){
    const response = h.response({
      status: "fail",
      message: "Body attribute not complete",
    });
    response.code(400);
    return response;
  }

  try {
    const imgId = nanoid(16);
    const fileExtension = image.hapi.filename.split(".").pop();

    const imageBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      image.on('data', chunk => chunks.push(chunk));
      image.on('end', () => resolve(Buffer.concat(chunks)));
      image.on('error', reject);
    });

    let link = await uploadFile(imageBuffer, imgId, fileExtension, 'user-scan');
    console.log(link);

    const uploadSuccess = await uploadNewScan(
      imgId,
      link,
      data.name,
      data.link,
      data.step,
      user.U_ID
    );

    if(uploadSuccess) {
      const response = h.response({
        status: "success",
        message: "successfully upload new scan",
      });
      response.code(201);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "failed upload new scan",
      });
      response.code(500);
      return response;
    }
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "failed processing image to bucket",
    });
    response.code(500);
    return response;
  }
};

module.exports = uploadPrediction;
