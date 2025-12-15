const db = require('../config/db')
const Settings = {
    getSettings : async ()=>{
        const [rows] = await db.query('SELECT * from settings')
        return rows
    },
    saveSettings : async (current_round , yellow_card , red_card, pen_missed ,own_goal , goal_for_ATT ,goal_for_MID ,goal_for_DEF , goal_for_GK , clean_sheets_def , clean_sheets_gk , clean_sheets_mid ,pen_saves ,conceded_goal)=>{
        await db.query('UPDATE settings set current_round = ? , yellow_card = ? , red_card = ?, pen_missed = ? ,own_goal = ? , goal_for_ATT = ?  ,goal_for_MID = ?  ,goal_for_DEF  = ?, goal_for_GK = ?, clean_sheets_def = ? , clean_sheets_gk = ?, clean_sheets_mid = ? ,pen_saves = ? ,conceded_goal = ? ' , [current_round , yellow_card , red_card, pen_missed ,own_goal , goal_for_ATT ,goal_for_MID ,goal_for_DEF , goal_for_GK , clean_sheets_def , clean_sheets_gk , clean_sheets_mid ,pen_saves ,conceded_goal])
    }
}

module.exports = Settings