const db = require('../config/db')
const Players = {
    getAllPlayers : async ()=>{
        const [rows] = await db.query(`SELECT 
                                            p.* ,   t.flag as team , t.team_name as team_name from players p
                                            inner join teams t on p.team_id = t.team_id`)
        return rows
    },
    createPlayer : async (player_id , fullname , team_id , player_image , price , position , player_number)=>{
        await db.query('INSERT INTO players (player_id , fullname , team_id , player_image , price , position , player_number) values (? , ? , ? , ? , ? , ? , ?)' , [player_id , fullname , team_id , player_image , price , position , player_number])
    },
    getPlayerById : async (id)=>{
        const [rows] = await db.query('SELECT * FROM players where player_id = ?' , [id])
        return  rows
    },
    updatePlayer : async (newPlayerId , fullname , team_id , price , newPlayerImage , player_number , id)=>{
        await db.query('UPDATE players set player_id = ? , fullname = ? , team_id = ? , price = ? , player_image = ? , player_number = ? where player_id = ?' , [newPlayerId ,fullname , team_id , price , newPlayerImage , player_number , id])
    },
    deleteByid : async (id)=>{
        const [res] = await db.query('DELETE FROM players where player_id = ?' , [id])
        return res
    },
}


module.exports = Players