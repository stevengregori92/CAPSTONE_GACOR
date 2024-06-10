const {
  queryGetDoctors,
} = require("../mysql");
const authenticateUser = require("../authentication.js");

const getDoctors = async (request, h) => {
    const auth = authenticateUser(request);
    if (!auth.isValid) {
      const response = h.response({
        status: "fail",
        message: auth.errorMessage,
      });
      response.code(400);
      return response;
    }
  
    try {
      const doctors = await new Promise((resolve, reject) => {
        queryGetDoctors((querySuccess, queryResults) => {
          if (!querySuccess) {
            return reject(new Error("Failed on query"));
          }
          resolve(queryResults);
        });
      });
  
      return h.response({ status: "success", data: { doctors } }).code(200);
    } catch (error) {
      return h.response({ status: "fail", message: error.message }).code(400);
    }
  };

  module.exports = getDoctors;