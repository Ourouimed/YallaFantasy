const db = require('../config/db')
const Teams = {
    createTeam : async (teamName , group , flagUrl)=>{
        await db.query('INSERT INTO teams values (? , ? , ? , ?)' , [teamName , teamName , group , flagUrl])
    },
    getAllTeams : async ()=>{
        const [rows] = await db.query('SELECT * from teams')
        return rows
    },
    deleteByid : async (id)=>{
        const [res] = await db.query('DELETE FROM teams where team_id = ?' , [id])
        return res
    }
}

module.exports = Teams