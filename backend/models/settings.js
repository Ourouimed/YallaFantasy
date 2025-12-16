const db = require('../config/db')
const Settings = {
    getSettings : async ()=>{
        const [rows] = await db.query('SELECT * from settings')
        return rows
    },
    saveSettings : async (yellow_card , red_card, pen_missed ,own_goal , goal_for_FWD ,goal_for_MID ,goal_for_DEF , goal_for_GK , clean_sheets_def , clean_sheets_gk , clean_sheets_mid ,pen_saves ,conceded_goal , gk_save)=>{
        await db.query('UPDATE settings set yellow_card = ? , red_card = ?, pen_missed = ? ,own_goal = ? , goal_for_FWD = ?  ,goal_for_MID = ?  ,goal_for_DEF  = ?, goal_for_GK = ?, clean_sheets_def = ? , clean_sheets_gk = ?, clean_sheets_mid = ? ,pen_saves = ? ,conceded_goal = ? , gk_save = ? ' , [yellow_card , red_card, pen_missed ,own_goal , goal_for_FWD ,goal_for_MID ,goal_for_DEF , goal_for_GK , clean_sheets_def , clean_sheets_gk , clean_sheets_mid ,pen_saves ,conceded_goal , gk_save])
    }
}

module.exports = Settings