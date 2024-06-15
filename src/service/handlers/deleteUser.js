const { queryDeleteUser } = require("../mysql.js");
const authenticateUser = require("../authentication.js");

const deleteUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    queryDeleteUser(email, (querySuccess, queryResults) => {
      if (querySuccess) {
        resolve(true);
      } else {
        reject(new Error("Query failed"));
      }
    });
  });
};

const deleteUser = async (request, h) => {
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
  const deleteSuccess = await deleteUserByEmail(email);

  if (deleteSuccess) {
    const response = h.response({
      status: "success",
      message: "successfully delete user",
    });
    response.code(202);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "failed delete user",
  });
  response.code(500);
  return response;
};

module.exports = deleteUser;
