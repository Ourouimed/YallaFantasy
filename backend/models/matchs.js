const db = require('../config/db')
const Matches ={
    createMatch : async (generatedId , home , away , time , round)=>{
        await db.query('INSERT INTO MATCHES (match_id , home_team , away_team , match_time , match_round) VALUES ( ? , ? , ? , ? , ? )' , 
            [generatedId , home , away , time , round])
    },
    getAllMatches : async ()=>{
        const [rows] = await db.query(`select m.* , r.round_title as round , t1.flag as home_team_flag , t1.team_name as home_name , t2.team_name as away_name , t2.flag as away_team_flag from matches m 
                                        inner join teams t1 on m.home_team = t1.team_id
                                        inner join teams t2 on m.away_team = t2.team_id
                                        inner join rounds r on m.match_round = r.round_id`)
        return rows
    },
    getMatchById : async (id)=>{
        const [rows] = await db.query(`select m.*  , r.round_title as round , t1.flag as home_team_flag , t1.team_name as home_name , t2.team_name as away_name , t2.flag as away_team_flag from matches m 
                                        inner join teams t1 on m.home_team = t1.team_id
                                        inner join teams t2 on m.away_team = t2.team_id
                                        inner join rounds r on m.match_round = r.round_id
                                        where match_id = ?` , [id])
        return rows
    },
    startMatch : async (id)=>{
        await db.query(
            `UPDATE matches 
            SET match_status = 'live',
                match_started_at = NOW(),
                home_score = 0,
                away_score = 0
            WHERE match_id = ?`,
            [id]
            );

    },
    addPlayerToLinup : async (
      player_id , 
      team_id , 
      match_id , 
      red_card ,
      yellow_cards ,
      assists ,
      goals ,
      pen_saves ,
      pen_missed ,
      min_played ,
      own_goals ,
      clean_sheets ,
      round_pts = 0 ,
      player_position ,
      gk_save , conceded_goal
  ) =>{
        await db.query(`INSERT INTO linup 
            (player_id , team_id , match_id , red_card ,yellow_cards ,assists ,goals ,pen_saves ,pen_missed ,min_played ,own_goals ,clean_sheets , round_pts , player_position , gk_save , conceded_goal)
            VALUES (? , ? , ?  , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)` , [player_id , 
      team_id , 
      match_id , 
      red_card ,
      yellow_cards ,
      assists ,
      goals ,
      pen_saves ,
      pen_missed ,
      min_played ,
      own_goals ,
      clean_sheets ,
      round_pts ,  
      player_position,
      gk_save , 
      conceded_goal])
    } ,

    getLinup : async (team_id ,  match_id)=>{
        const [rows] = await db.query(`SELECT l.*  , p.fullname , p.position , p.player_image  from linup l 
                                       inner join players p on p.player_id = l.player_id where l.team_id = ? AND l.match_id = ?` , [match_id , team_id])
        return rows
    } , 
    getPlayerFromLinup :async (team_id , match_id , player_id)=>{
        const [rows] = await db.query(`SELECT l.*  , p.fullname , p.position ,  p.player_image from linup l 
                                       inner join players p on p.player_id = l.player_id where l.team_id = ? AND l.match_id = ? AND p.player_id = ?`, [match_id , team_id , player_id])
        return rows
    } , 
    deleteFromLinup : async (match_id , player_id)=>{
        const [rows] = await db.query('DELETE FROM LINUP where match_id = ? AND player_id = ?' , [match_id , player_id])
        return rows
    },
    updatePlayerLinup: async (
  player_id,
  team_id,
  match_id,
  red_card,
  yellow_cards,
  assists,
  goals,
  pen_saves,
  pen_missed,
  min_played,
  own_goals,
  clean_sheets,
  round_pts = 0,
  player_position ,
  gk_save , conceded_goal
) => {
  await db.query(
    `UPDATE linup SET
      red_card = ?,
      yellow_cards = ?,
      assists = ?,
      goals = ?,
      pen_saves = ?,
      pen_missed = ?,
      min_played = ?,
      own_goals = ?,
      clean_sheets = ?,
      round_pts = ?,
      player_position = ? ,
      gk_save = ?,
      conceded_goal = ?
     WHERE player_id = ? AND team_id = ? AND match_id = ?`,
    [
      red_card,
      yellow_cards,
      assists,
      goals,
      pen_saves,
      pen_missed,
      min_played,
      own_goals,
      clean_sheets,
      round_pts,
      player_position,
      gk_save ,
      conceded_goal,
      player_id,
      team_id,
      match_id ,
    ]
  );
}

}

module.exports = Matches