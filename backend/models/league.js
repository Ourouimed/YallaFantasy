const db = require('../config/db')
const League ={
    createLeague : async (id_league , league_name , created_by)=>{
        await db.query('INSERT INTO leagues (id_league , league_name , created_by) values (? , ? , ?)' , [id_league , league_name , created_by])
    },
    joinLeague : async (id_league , id_team)=>{
        await db.query('INSERT INTO league_members (id_league , id_team) values (? , ?)' , [id_league , id_team])
    },
    getLeaguesByUser : async (id_team)=>{
        const [rows] = await db.query(`SELECT l.*, COUNT(lm.id_team) AS members_count
                                        FROM leagues l
                                        INNER JOIN league_members lm 
                                            ON l.id_league = lm.id_league
                                        WHERE lm.id_league IN (
                                            SELECT id_league 
                                            FROM league_members 
                                            WHERE id_team = ?
                                        )
                                        GROUP BY l.id_league;` , [id_team])
        return rows
    },

    getLeagueInfo : async (id_team , id_league)=>{
        const [rows] = await db.query(`SELECT l.*, COUNT(lm.id_team) AS members_count
                                        FROM leagues l
                                        INNER JOIN league_members lm 
                                            ON l.id_league = lm.id_league
                                        WHERE lm.id_league IN (
                                            SELECT id_league 
                                            FROM league_members 
                                            WHERE id_team = ? AND id_league = ?
                                        )
                                        GROUP BY l.id_league;` , [id_team , id_league])
        return rows
    },
    CheckExistance : async (id)=>{
        const [rows] = await db.query('SELECT id_league from leagues where id_league = ? ' , [id])
        return rows
    },
    getLeagueMembers : async (id)=>{
        const [rows] = await db.query(`SELECT ft.team_name , ft.total_pts , u.fullname from fantasy_team ft 
                                        inner join users u on ft.id_team = u.id
                                        inner join league_members lm on ft.id_team = lm.id_team where id_league = ? ` , [id])
        return rows
    }
}

module.exports = League