const db = require('../config/db')
const Players = {
    getAllPlayers : async ()=>{
        const [rows] = await db.query(`SELECT p.* , t.flag as team from players p
                                        inner join teams t on p.team_id = t.team_id`)
        return rows
    },
    createPlayer : async (fullname , team_id , player_image , price)=>{
        await db.query('INSERT INTO players (player_id , fullname , team_id , player_image , price) values (? , ? , ? , ? , ?)' , [fullname , fullname , team_id , player_image , price])
    },
    getPlayerById : async (id)=>{
        const [rows] = await db.query('SELECT * FROM players where player_id = ?' , [id])
        return  rows
    },
    updatePlayer : async (fullname , team_id , price , newPlayerImage , id)=>{
        await db.query('UPDATE players set fullname = ? , team_id = ? , price = ? , player_image = ? , where player_id = ?' , [fullname , team_id , price , newPlayerImage , id])
    },
}


module.exports = Players