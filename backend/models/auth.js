const db = require('../config/db')
const Auth = {
    getUserByEmail : async (email , callback)=>{
        const [rows] = await db.query('SELECT * from users where email = ?', [email]);
        return rows
    },
    createUser : async (email , id , password ,fullname) =>{
        await db.query(`INSERT INTO users (id , fullname , password , email) VALUES (? ,? , ? , ?)` , [id , fullname , password , email])
    },
}

module.exports = Auth