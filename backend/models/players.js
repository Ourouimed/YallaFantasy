const db = require('../config/db')
const Players = {
    getAllPlayers : async ()=>{
        const [rows] = await db.query(`SELECT 
                                            p.player_id, p.team_id , p.fullname , p.player_image , p.total_pts , p.price 
                                            , p.position ,  t.flag as team from players p
                                            inner join teams t on p.team_id = t.team_id`)
        return rows
    },
    createPlayer : async (fullname , team_id , player_image , price , position)=>{
        await db.query('INSERT INTO players (player_id , fullname , team_id , player_image , price , position) values (? , ? , ? , ? , ? , ?)' , [fullname , fullname , team_id , player_image , price , position])
    },
    getPlayerById : async (id)=>{
        const [rows] = await db.query('SELECT * FROM players where player_id = ?' , [id])
        return  rows
    },
    updatePlayer : async (fullname , team_id , price , newPlayerImage , id)=>{
        await db.query('UPDATE players set fullname = ? , team_id = ? , price = ? , player_image = ? where player_id = ?' , [fullname , team_id , price , newPlayerImage , id])
    },
    deleteByid : async (id)=>{
        const [res] = await db.query('DELETE FROM players where player_id = ?' , [id])
        return res
    },
}


module.exports = Players