const db = require('../config/db')
const MyTeam = {
    getTeamSquad : async (round_id , id_team)=>{
        const [rows] = await db.query(`SELECT fl.* , p.* , t.flag as team from fantasy_list fl 
                                    inner join players p on fl.id_player = p.player_id 
                                    inner join teams t on p.team_id = t.team_id
                                    where round_id = ? AND id_team = ?` , [round_id , id_team])
        return rows
    },


    getLastInsertedSquad: async (round_deadline, id_team) => {
    const [rows] = await db.query(`
        SELECT fl.*, p.*, t.flag AS team, r.round_deadline
        FROM fantasy_list fl
        INNER JOIN rounds r ON fl.round_id = r.round_id
        INNER JOIN players p ON fl.id_player = p.player_id
        INNER JOIN teams t ON p.team_id = t.team_id
        WHERE fl.id_team = ?
          AND r.round_deadline < ?
        ORDER BY r.round_deadline DESC
    `, [id_team, round_deadline]);
        
     

    return rows;
}
,

    getPickedTeam : async (round_id , id_team)=>{
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
    createTeam : async (id_team , team_name , start_at) =>{
        await db.query(`INSERT INTO fantasy_team (id_team , team_name , start_at)
                        VALUES (? , ? , ? )` , [id_team , team_name , start_at])
    },
    savePlayer : async (id_team , id_player , round_id , is_starter , role)=>{
        console.log(id_team , id_player , round_id , is_starter , role)
        await db.query(`INSERT INTO fantasy_list (id_team , id_player , round_id , starting_linup , role)
                        VALUES (? , ? , ? , ?  , ?)` , [id_team , id_player , round_id , is_starter , role])
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

    isStarter : async (round_id , id_player , id_team , isStarter)=>{
        const [res] = await db.query('UPDATE fantasy_list set starting_linup = ? where round_id = ? AND id_player = ? AND id_team = ?' , [isStarter , round_id , id_player , id_team])
        return res
    } , 
    setRole : async (role , id_player , id_team)=>{
        const [res] = await db.query('UPDATE fantasy_list set role = ? where id_player = ? AND id_team = ?' , [role , id_player , id_team])
        return res
    },

    setRoleAll : async (role  , id_team)=>{
        const [res] = await db.query('UPDATE fantasy_list set role = ? where id_team = ?' , [role , id_team])
        return res
    },

    getPrevDeadlineForm : async (userId , roundId)=>{
        const [rows] = await db.query(`select l.round_pts , p.position , fl.starting_linup , fl.id_player , r.round_id , fl.id_team from fantasy_list fl
left join linup l on l.player_id = fl.id_player
left join rounds r on r.round_id = fl.round_id 
left join players p on p.player_id = fl.id_player
where fl.id_team = ? AND r.round_id =?` , [userId , roundId])
return rows
    }
    
}


module.exports = MyTeam