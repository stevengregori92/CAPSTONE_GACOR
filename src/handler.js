const fs = require("fs");
const nanoid = require("nanoid");
const {
  queryUploadScan,
  queryRegisterUser,
  queryCheckUserEmail,
  queryDeleteUser,
  queryUpdateUser,
  queryGetDoctors,
  queryGetHospitals,
} = require("./mysql");
const bcrypt = require("bcryptjs");
const uploadFile = require("./upload");
const jwt = require("@hapi/jwt");
const authenticateUser = require("./authentication.js");
const predictFromModel = require("./predict.js");

require("dotenv").config();

const bucketName = process.env.BUCKET_NAME;

// TODO: model process + actual U_ID to insert to scan table
const uploadPic = async (request, h) => {
  return new Promise((resolve, reject) => {
    const auth = authenticateUser(request);
    if (!auth.isValid) {
      const response = h.response({
        status: "fail",
        message: auth.errorMessage,
      });
      response.code(400);
      return resolve(response);
    }

    const data = request.payload;

    if (data.image === undefined) {
      const response = h.response({
        status: "fail",
        message: "image body not found",
      });
      response.code(400);
      return resolve(response);
    }

    const fileExtension = data.image.hapi.filename.split(".").pop();
    const imgId = nanoid(16);
    const path = `./uploads/${imgId}.${fileExtension}`;
    const fileStream = fs.createWriteStream(path);

    data.image.pipe(fileStream);

    let pubUrl = "";

    fileStream.on("finish", async () => {
      // Predict from the model
      const results = await predictFromModel(path);
      console.log("Prediction results:", results);

      // pubUrl = uploadFile(imgId, fileExtension); // untuk deployment
      pubUrl = `https://storage.googleapis.com/${bucketName}/scans/${imgId}.${fileExtension}`; // untuk dev

      if (!results) {
        fs.unlink(path, (err) => {
          if (err) {
            console.error("Error removing file:", err);
            return reject(err);
          }
          console.log("File removed successfully");
        });

        const response = h.response({
          status: "fail",
          message: "failed to give prediction",
        });
        response.code(400);
        return resolve(response);
      }

      fs.unlink(path, (err) => {
        if (err) {
          console.error("Error removing file:", err);
          return reject(err);
        }
        console.log("File removed successfully");
      });

      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      queryUploadScan(
        imgId,
        pubUrl,
        "sekali putaran, setengah putaran",
        formattedDate,
        1,
        (queryResult) => {
          if (queryResult) {
            const response = h.response({
              status: "success",
              message: "successfully upload a scan image",
              data: {
                imageUrl: pubUrl,
              },
            });
            response.code(201);
            resolve(response);
          } else {
            const response = h.response({
              status: "fail",
              message: "failed on query image",
            });
            response.code(500);
            resolve(response);
          }
        }
      );
    });
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

    const registerSuccess = await registerNewUser(
      userId,
      data.email,
      hashedPassword,
      data.nama,
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

const deleteUser = async (request, h) => {
  const auth = authenticateUser(request);
  if (!auth.isValid) {
    const response = h.response({
      status: "fail",
      message: auth.errorMessage,
    });
    response.code(400);
    return resolve(response);
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

const registerNewUser = (id, email, password, nama, role, subscriber) => {
  return new Promise((resolve, reject) => {
    queryRegisterUser(
      id,
      email,
      password,
      nama,
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
        email: user.U_email,
        password: user.U_password,
        nama: user.U_nama,
        role: user.U_role,
        subscriber: user.U_subscriber,
      },
      { key: process.env.JWT_SECRET, algorithm: "HS256" },
      { ttlSec: 3600 }
    );

    return h.response({ status: "success", data: { token } }).code(200);
  } catch (error) {
    return h.response({ status: "fail", message: error.message }).code(400);
  }
};

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

    const data = request.payload;

    let bufPass, bufNama, bufSubs, bufRole;

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

    const querySuccess = await new Promise((resolve, reject) => {
      queryUpdateUser(bufPass, bufNama, bufRole, bufSubs, email, (querySuccess) => {
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
    const response = h.response({
      status: "fail",
      message: "Parameter 'kota' is not found.",
    });
    response.code(400);
    return response;
  }

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
};


module.exports = { uploadPic, registerUser, loginUser, deleteUser, updateUser, getDoctors, getHospitals };
