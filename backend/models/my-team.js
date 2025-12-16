const db = require('../config/db')
const MyTeam = {
    getTeamSquad : async (round_id , id_team)=>{
        const [rows] = await db.query(`SELECT * from fantasy_list where round_id = ? AND id_team = ?` , [round_id , id_team])
        return rows
    },
    getTeamSquad : async (id_team)=>{
        const [rows] = await db.query(`SELECT * from fantasy_team where id_team = ?` , [id_team])
        return rows
    }

}


module.exports = MyTeam