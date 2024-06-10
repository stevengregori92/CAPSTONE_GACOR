const nanoid = require("nanoid");
const {
  queryCheckUserEmail,
  queryUpdateUser,
} = require("../mysql");
const bcrypt = require("bcryptjs");
const uploadFile = require("../../cloud bucket/uploadBucket.js");
const authenticateUser = require("../authentication.js");
const deleteFileByUrl = require("../../cloud bucket/deleteBucket.js");

const updateUser = async (request, h) => {
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
  
    try {
      const user = await new Promise((resolve, reject) => {
        queryCheckUserEmail(email, (querySuccess, queryResults) => {
          if (!querySuccess || queryResults.length === 0) {
            return reject(new Error("Invalid credentials"));
          }
          resolve(queryResults[0]);
        });
      });
  
      const data = request.payload.data;
      const image = request.payload.image;
  
      let bufPass, bufNama, bufSubs, bufRole, bufPic;
  
      bufRole = user.U_role;
  
      if (data.password !== undefined) {
        bufPass = await bcrypt.hash(data.password, 10);
      } else {
        bufPass = user.U_password;
      }
  
      if (data.nama !== undefined) {
        bufNama = data.nama;
      } else {
        bufNama = user.U_nama;
      }
  
      if (data.subscriber !== undefined) {
        bufSubs = data.subscriber;
      } else {
        bufSubs = user.U_subscriber;
      }
  
      if (data.subscriber !== undefined) {
        bufSubs = data.subscriber;
      } else {
        bufSubs = user.U_subscriber;
      }
  
      if (image !== undefined) {
        const fileExtension = image.hapi.filename.split(".").pop();
        const imgId = nanoid(16);
  
        const imageBuffer = await new Promise((resolve, reject) => {
          const chunks = [];
          image.on('data', chunk => chunks.push(chunk));
          image.on('end', () => resolve(Buffer.concat(chunks)));
          image.on('error', reject);
        });
  
        // Use the updated uploadFile function to upload from buffer
        bufPic = await uploadFile(imageBuffer, imgId, fileExtension, 'user-picture');
  
        if (user.U_foto !== "https://storage.googleapis.com/capstonegacor-bucket/user-picture/default-user.png") {
          deleteFileByUrl(user.U_foto);
        }
      } else {
        bufPic = user.U_foto;
      }
  
      const querySuccess = await new Promise((resolve, reject) => {
        queryUpdateUser(bufPass, bufNama, bufRole, bufPic, bufSubs, email, (querySuccess) => {
          if (querySuccess) {
            resolve(true);
          } else {
            reject(new Error("Failed to query update user"));
          }
        });
      });
  
      if (querySuccess) {
        const response = h.response({
          status: "success",
          message: "Resource updated successfully",
        });
        response.code(200);
        return response;
      }
  
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(400);
      return response;
    }
  };

  module.exports = updateUser;