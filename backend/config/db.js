const mysql = require('mysql2/promise')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const pool = mysql.createPool({
    database : process.env.DB_NAME,
    user : process.env.DB_USER,
    password : process.env.PASSWORD,
    host : process.env.HOST,
    connectionLimit : 10,
    waitForConnections: true,
    timezone: 'Z'
})

module.exports = pool