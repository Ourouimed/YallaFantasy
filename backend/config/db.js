const mysql = require('mysql2/promise')
require('dotenv').config()
const pool = mysql.createPool({
    database : process.env.DB_NAME,
    user : process.env.USER,
    password : process.env.PASSWORD,
    host : process.env.HOST,
    connectionLimit : 10,
    waitForConnections: true,
})

module.exports = pool