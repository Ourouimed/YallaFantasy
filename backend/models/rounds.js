const db = require('../config/db')
const Rounds = {
    createRound : async (round_id , round_title , round_deadline)=>{
        await db.query('INSERT INTO ROUNDS (round_id , round_title , round_deadline) VALUES (? , ? , ? )' , [round_id , round_title , round_deadline])
    },
    getAllrounds : async ()=>{
        const [rows] = await db.query('SELECT * FROM rounds')
        return rows
    },
    deleteByid : async (id)=>{
        const [res] = await db.query('DELETE FROM rounds where round_id = ?' , [id])
        return res
    },
    getRoundById : async (id)=>{
        const [rows] = await db.query('SELECT * FROM rounds where round_id = ?' , [id])
        return rows
    },
    updateRound : async (id , round_deadline , round_title) =>{
        await db.query('UPDATE rounds set round_deadline = ? , round_title = ? where round_id = ?' , [round_deadline , round_title , id])
    }
}

module.exports = Rounds