const db = require('../config/db')
const MyTeam = {
    getTeamSquad : async (round_id , id_team)=>{
        const [rows] = await db.query(`SELECT fl.* , p.* , t.flag as team from fantasy_list fl 
                                    inner join players p on fl.id_player = p.player_id 
                                    inner join teams t on p.team_id = t.team_id
                                    where round_id = ? AND id_team = ?` , [round_id , id_team])
        return rows
    },
    getTeamDetaills : async (id_team)=>{
        const [rows] = await db.query(`SELECT * from fantasy_team where id_team = ?` , [id_team])
        return rows
    },
    createTeam : async (id_team , team_name , start_at , captain , vice_captain) =>{
        await db.query(`INSERT INTO fantasy_team (id_team , team_name , start_at , captain , vice_captain)
                        VALUES (? , ? , ? , ? , ?)` , [id_team , team_name , start_at , captain , vice_captain])
    },
    savePlayer : async (id_team , id_player , national_team , round_id , purchased_price , is_starter)=>{
        await db.query(`INSERT INTO fantasy_list (id_team , id_player , national_team , round_id , purchased_price , starting_linup)
                        VALUES (? , ? , ? , ? , ? , ?)` , [id_team , id_player , national_team , round_id , purchased_price , is_starter])
    } ,
    addNewTransfer : async (id)=>{
        await db.query('UPDATE fantasy_team set available_transfers = available_transfers + 1 where id_team = ?' , [id])
    },
    getChips : async (id)=>{
        const [rows] = await db.query('SELECT wildcard , triple_captain , bench_boost , jocker , park_the_bus from fantasy_team')
        return rows
    },
    updateTotalTransfers : async (transfers , id_team)=>{
        await db.query('UPDATE fantasy_team set available_transfers = ? where id_team = ? ' , [transfers , id_team])
    },
    reducePoints : async (pts_to_reduce , id_team)=>{
        await db.query('UPDATE fantasy_team set total_pts = total_pts - ? where id_team = ?' , [pts_to_reduce , id_team])
    },
    clearSquad : async (round_id , id_team)=>{
        const [res] = await db.query('DELETE FROM fantasy_list where round_id = ? AND id_team = ?' , [round_id , id_team])
        return res
    },
    
}


module.exports = MyTeam