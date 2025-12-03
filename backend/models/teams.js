const db = require('../config/db')
const Teams = {
    createTeam : async (teamName , group , flagUrl)=>{
        await db.query('INSERT INTO teams values (? , ? , ? , ?)' , [teamName , teamName , group , flagUrl])
    },
    updateTeam : async (teamName , group , flagUrl , id)=>{
        await db.query('UPDATE teams set team_name = ? , group_num = ? , flag = ? where team_id = ?' , [teamName , group , flagUrl , id])
    },
    getAllTeams : async ()=>{
        const [rows] = await db.query('SELECT * from teams')
        return rows
    },
    deleteByid : async (id)=>{
        const [res] = await db.query('DELETE FROM teams where team_id = ?' , [id])
        return res
    },
    getTeamById : async (id)=>{
        const [rows] = await db.query('SELECT * FROM teams where team_id = ?' , [id])
        return  rows
    }
}

module.exports = Teams