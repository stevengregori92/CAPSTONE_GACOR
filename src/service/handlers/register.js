const nanoid = require("nanoid");
const { queryRegisterUser } = require("../mysql");
const bcrypt = require("bcryptjs");
const checkUserEmail = require("./checkUser");

const registerNewUser = (id, email, password, nama, foto, role, subscriber) => {
  return new Promise((resolve, reject) => {
    queryRegisterUser(
      id,
      email,
      password,
      nama,
      foto,
      role,
      subscriber,
      (querySuccess) => {
        if (querySuccess) {
          resolve(true);
        } else {
          reject(new Error("Registration failed"));
        }
      }
    );
  });
};

const registerUser = async (request, h) => {
  const data = request.payload;

  if (!data.email || !data.password || !data.nama || !data.role) {
    const response = h.response({
      status: "fail",
      message: "body attribute not complete",
    });
    response.code(400);
    return response;
  }

  try {
    const userExists = await checkUserEmail(data.email);

    if (userExists) {
      const response = h.response({
        status: "fail",
        message: "user with current email exists",
      });
      response.code(400);
      return response;
    }

    const userId = nanoid(21);
    const subscriber = false;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const foto =
      "https://storage.googleapis.com/capstonegacor-bucket/user-picture/default-user.png";

    const registerSuccess = await registerNewUser(
      userId,
      data.email,
      hashedPassword,
      data.nama,
      foto,
      data.role,
      subscriber
    );

    if (registerSuccess) {
      const response = h.response({
        status: "success",
        message: "successfully registered new user",
      });
      response.code(201);
      return response;
    } else {
      const response = h.response({
        status: "fail",
        message: "failed registering new user",
      });
      response.code(500);
      return response;
    }
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "failed processing request",
    });
    response.code(500);
    return response;
  }
};

module.exports = registerUser;
