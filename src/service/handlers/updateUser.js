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

      let bufPass = user.U_password;
      let bufNama = user.U_nama;
      let bufSubs = user.U_subscriber;
      let bufRole = user.U_role;
      let bufPic = user.U_foto;
  
      let data = request.payload.data;
      if(data !== undefined){
        data = JSON.parse(data);

        if (data.password !== undefined) {
          bufPass = await bcrypt.hash(data.password, 10);
        }
    
        if (data.nama !== undefined) {
          bufNama = data.nama;
        }
    
        if (data.subscriber !== undefined) {
          bufSubs = data.subscriber;
        }
    
        if (data.role !== undefined) {
          bufRole = data.role;
        }
      }

      const image = request.payload.image;
  
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
          data: {
            id: user.U_ID,
            email: user.U_email,
            nama: bufNama,
            foto: bufPic,
            role: bufRole,
            subscriber: bufSubs
          }
          // message: "Resource updated successfully",
        });
        response.code(201);
        return response;
      }
      else{
        const response = h.response({
          status: "fail",
          message: "Resource update failed",
        });
        response.code(400);
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