const db = require('../config/db')
const Auth = {
    getUserByEmail : async (email , callback)=>{
        const [rows] = await db.query('SELECT * from users where email = ?', [email]);
        return rows
    },
    createUser : async (email , password ,fullname) =>{
        await db.query(`INSERT INTO users (id , fullname , password , email) VALUES (CONCAT('YA-', SUBSTRING(MD5(RAND()), 1, 6)) ,? , ? , ?)` , [fullname , password , email])
    },
}

module.exports = Auth