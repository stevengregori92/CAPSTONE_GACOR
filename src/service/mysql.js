const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createConnection({
    // dev pakai localhost phpmyadmin
    connectionLimit: 10,

    // HOST IS FOR WINDOWS ONLY
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    // USE THIS FOR UNIX
    // socketPath: '/cloudsql/capstone-gacor:asia-southeast2:capstone-gacor-mysql'
});

const querySQL = async (sqlQuery, values, callback) =>{
    pool.query(sqlQuery, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(false);
            return;
        }
        console.log('Query results:', results);
        return callback(true);
    });
}

const queryUploadScan = async (id, link, diagnosis, referensi, deskripsi, userId, callback) => {
    const sqlQuery = `INSERT INTO scan (S_ID, S_link, S_diagnosis, S_referensi, S_deskripsi, S_waktu, user_U_ID) VALUES (?, ?, ?, ?, ?, NOW(), ?)`;
    const values = [id, link, diagnosis, referensi, deskripsi, userId];

    querySQL(sqlQuery, values, callback);
};

const queryRegisterUser = async (id, email, password, nama, foto, role, subscriber, callback) => {
    const sqlQuery = `INSERT INTO user (U_ID, U_email, U_password, U_nama, U_foto, U_role, U_subscriber) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const values = [id, email, password, nama, foto,  role, subscriber];

    querySQL(sqlQuery, values, callback);
}

const queryCheckUserEmail = async (email, callback) => {
    const values = email;
    const sqlQuery = `SELECT * FROM user WHERE U_email = ?;`;

    pool.query(sqlQuery, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(false);
            return;
        }
        console.log('Query results:', results);
        return callback(true, results);
    });
}

const queryDeleteUser = async (email, callback) => {
    const values = email;
    const sqlQuery = `DELETE FROM user WHERE U_email = ? LIMIT 1;`;

    pool.query(sqlQuery, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(false);
            return;
        }
        console.log('Query results:', results);
        return callback(true);
    });
}

const queryUpdateUser = async (password, nama, role, foto, subscriber, email, callback) => {
    const values = [password, nama, role, foto, subscriber, email];
    const sqlQuery = `UPDATE user SET U_password=?, U_nama=?, U_role=?, U_foto=?, U_subscriber=? WHERE U_email = ? LIMIT 1;`;

    pool.query(sqlQuery, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(false);
            return;
        }
        console.log('Query results:', results);
        return callback(true);
    });
}

const queryGetDoctors = async (callback) => {
    const sqlQuery = `SELECT U_ID, U_email, U_nama, U_foto, U_role FROM user WHERE U_role = 'doctor';`;

    pool.query(sqlQuery, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(false);
            return;
        }
        console.log('Query results:', results);
        return callback(true, results);
    });
}

const queryGetHospitals = async (kota, callback) => {
    const values = kota;
    const sqlQuery = `SELECT * FROM hospital WHERE H_kota = ?;`;

    pool.query(sqlQuery, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(false);
            return;
        }
        console.log('Query results:', results);
        return callback(true, results);
    });
}


module.exports = {queryUploadScan, queryRegisterUser, queryCheckUserEmail, queryDeleteUser, queryUpdateUser, queryGetDoctors, queryGetHospitals};
