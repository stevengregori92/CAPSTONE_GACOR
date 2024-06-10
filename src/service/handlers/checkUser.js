const { queryCheckUserEmail } = require("../mysql");

const checkUserEmail = (email) => {
  return new Promise((resolve, reject) => {
    queryCheckUserEmail(email, (querySuccess, queryResults) => {
      if (querySuccess) {
        resolve(queryResults.length > 0);
      } else {
        reject(new Error("Query failed"));
      }
    });
  });
};

module.exports = checkUserEmail;
