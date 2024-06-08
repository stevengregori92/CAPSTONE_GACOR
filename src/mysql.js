const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    // dev pakai localhost phpmyadmin
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // socketPath: '/cloudsql/your_project_id:your_region:your_instance_name'
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

const queryUploadScan = async (id, link, diagnosis, waktu, userId, callback) => {
    const sqlQuery = `INSERT INTO scan (S_ID, S_link, S_diagnosis, S_waktu, user_U_ID) VALUES (?, ?, ?, ?, ?)`;
    const values = [id, link, diagnosis, waktu, userId];

    querySQL(sqlQuery, values, callback);
};

const queryRegisterUser = async (id, email, password, nama, role, subscriber, callback) => {
    const sqlQuery = `INSERT INTO user (U_ID, U_email, U_password, U_nama, U_role, U_subscriber) VALUES (?, ?, ?, ?, ?, ?);`;
    const values = [id, email, password, nama, role, subscriber];

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

const queryUpdateUser = async (password, nama, role, subscriber, email, callback) => {
    const values = [password, nama, role, subscriber, email];
    const sqlQuery = `UPDATE user SET U_password=?, U_nama=?, U_role=?, U_subscriber=? WHERE U_email = ? LIMIT 1;`;

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
    const sqlQuery = `SELECT U_ID, U_email, U_nama, U_role FROM user WHERE U_role = 'doctor';`;

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
