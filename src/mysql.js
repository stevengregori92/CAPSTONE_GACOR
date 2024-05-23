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

const querySQL = (sqlQuery, values, callback) =>{
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

const queryUploadScan = (link, diagnosis, waktu, userId, callback) => {
    const sqlQuery = `INSERT INTO scan (S_link, S_diagnosis, S_waktu, user_U_ID) VALUES (?, ?, ?, ?)`;
    const values = [link, diagnosis, waktu, userId];

    querySQL(sqlQuery, values, callback);
};

const queryRegisterUser = (email, password, nama, role, subscriber, callback) => {
    const sqlQuery = `INSERT INTO user (U_email, U_password, U_nama, U_role, U_subscriber) VALUES (?, ?, ?, ?, ?);`;
    const values = [email, password, nama, role, subscriber];

    querySQL(sqlQuery, values, callback);
}

const queryCheckUserEmail = (email, callback) => {
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

const queryDeleteUser = (email, callback) => {
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



module.exports = {queryUploadScan, queryRegisterUser, queryCheckUserEmail, queryDeleteUser};
