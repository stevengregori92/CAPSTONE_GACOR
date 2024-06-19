const { queryGetScan, queryCheckUserEmail } = require("../mysql");
const authenticateUser = require("../authentication.js");

const getPrediction = async (request, h) => {
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
    
    try {
      const scans = new Promise((resolve, reject) => {
        queryGetScan(
          user.U_ID,
          (querySuccess, queryResults) => {
            if (!querySuccess) {
              return reject(new Error("Failed on query"));
            }
            resolve(queryResults);
          }
        );
      });
  
      if(getSuccess) {
        const response = h.response({
          status: "success",
          data: {
            scans
          },
        });
        response.code(200);
        return response;
      } else {
        const response = h.response({
          status: "fail",
          message: "failed to get query scans",
        });
        response.code(500);
        return response;
      }
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: "failed to get query scans",
      });
      response.code(500);
      return response;
    }
  };
  

  module.exports = getPrediction;