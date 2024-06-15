const {
  queryCheckUserEmail,
} = require("../mysql");
const bcrypt = require("bcryptjs");
const jwt = require("@hapi/jwt");
require("dotenv").config();

const loginUser = async (request, h) => {
    const { email, password } = request.payload;
  
    try {
      const user = await new Promise((resolve, reject) => {
        queryCheckUserEmail(email, (querySuccess, queryResults) => {
          if (!querySuccess || queryResults.length === 0) {
            return reject(new Error("Invalid credentials"));
          }
          resolve(queryResults[0]);
        });
      });
  
      const isPasswordValid = await bcrypt.compare(password, user.U_password);
      if (!isPasswordValid) {
        return h
          .response({ status: "fail", message: "Invalid credentials" })
          .code(400);
      }
  
      const token = jwt.token.generate(
        {
            id: user.U_ID,
            email: user.U_email,
            nama: user.U_nama,
            foto: user.U_foto,
            role: user.U_role,
            subscriber: user.U_subscriber,
        },
        {
            key: process.env.JWT_SECRET,
            algorithm: 'HS256'
        },
        {
            ttlSec: 3600
        }
    );
  
      return h.response({ status: "success", data: { token } }).code(200);
    } catch (error) {
      return h.response({ status: "fail", message: error.message }).code(400);
    }
  };

  module.exports = loginUser;