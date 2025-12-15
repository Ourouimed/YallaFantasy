const db = require('../config/db')
const MyTeam = {
    getTeam : async (id)=>{
        const [rows] = await db.query('select * from fantasy_team where id_team = ?' , [id])
        return rows
    }
}


module.exports = MyTeam