const {
  queryGetHospitals, queryGetHospitalsAll
} = require("../mysql.js");

const authenticateUser = require("../authentication.js");

const getHospitals = async (request, h) => {
    const auth = authenticateUser(request);
    if (!auth.isValid) {
      const response = h.response({
        status: "fail",
        message: auth.errorMessage,
      });
      response.code(400);
      return response;
    }
  
    const { kota } = request.query;
    if (!kota) {
      try {
        const hospitals = await new Promise((resolve, reject) => {
          queryGetHospitalsAll((querySuccess, queryResults) => {
            if (!querySuccess) {
              return reject(new Error("Failed on query"));
            }
            resolve(queryResults);
          });
        });
    
        return h.response({ status: "success", data: { hospitals } }).code(200);
      } catch (error) {
        return h.response({ status: "fail", message: error.message }).code(400);
      }
    }else{
      try {
        const hospitals = await new Promise((resolve, reject) => {
          queryGetHospitals(kota, (querySuccess, queryResults) => {
            if (!querySuccess) {
              return reject(new Error("Failed on query"));
            }
            resolve(queryResults);
          });
        });
    
        return h.response({ status: "success", data: { hospitals } }).code(200);
      } catch (error) {
        return h.response({ status: "fail", message: error.message }).code(400);
      }
    }    
  };

  module.exports = getHospitals;