const db = require('../config/db')
const Auth = {
    getUserByEmail : async (email)=>{
        const [rows] = await db.query('SELECT * from users where email = ?', [email]);
        return rows
    },

    getUserById : async (id)=>{
        const [rows] = await db.query('SELECT * from users where id = ?', [id]);
        return rows
    },
    createUser : async (email , id , password ,fullname) =>{
        await db.query(`INSERT INTO users (id , fullname , password , email) VALUES (? ,? , ? , ?)` , [id , fullname , password , email])
    },
    verifyEmail : async (id)=>{
        await db.query('UPDATE users set email_verified = 1 , email_verified_at = NOW() where id=?' , [id])
    }
}

module.exports = Auth