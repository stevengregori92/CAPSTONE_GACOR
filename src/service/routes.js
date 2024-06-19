const registerUser = require("./handlers/register");
const loginUser = require("./handlers/login");
const deleteUser = require("./handlers/deleteUser");
const updateUser = require("./handlers/updateUser");
const getDoctors = require("./handlers/listDoctors");
const getHospitals = require("./handlers/listHospitals");
const uploadPrediction = require("./handlers/uploadPrediction");
const getPrediction = require("./handlers/getPrediction");

const routes = [
  {
    method: "POST",
    path: "/register",
    handler: registerUser,
  },
  {
    method: "POST",
    path: "/login",
    handler: loginUser,
  },
  {
    method: "DELETE",
    path: "/delete",
    handler: deleteUser,
  },
  {
    method: "PATCH",
    path: "/update",
    options: {
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
    handler: updateUser,
  },
  {
    method: "GET",
    path: "/doctors",
    handler: getDoctors,
  },
  {
    method: "GET",
    path: "/hospitals",
    handler: getHospitals,
  },
  {
    method: "GET",
    path: "/scans",
    handler: getPrediction,
  },
  {
    method: "POST",
    path: "/prediction",
    options: {
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
    handler: uploadPrediction,
  }
];

module.exports = routes;
