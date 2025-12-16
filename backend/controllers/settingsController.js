const Settings = require("../models/settings");

exports.getSettings = async (req , res)=>{
      try {
        const [settings] = await Settings.getSettings()
        res.json(settings)
      }
      catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
      }
}


exports.saveSettings = async (req , res)=>{
  const {
  yellow_card= -1,
  red_card= -3,
  pen_missed= -2,
  own_goal= -2,
  goal_for_FWD= 4,
  goal_for_MID= 5,
  goal_for_DEF= 6,
  goal_for_GK= 8,
  clean_sheets_def= 4,
  clean_sheets_gk= 4,
  clean_sheets_mid= 1,
  pen_saves= 5,
  conceded_goal= -1,
  gk_save = 1
} = req.body

  try {
      await Settings.saveSettings(yellow_card , red_card, pen_missed ,own_goal , goal_for_FWD ,goal_for_MID ,goal_for_DEF , goal_for_GK , clean_sheets_def , clean_sheets_gk , clean_sheets_mid ,pen_saves ,conceded_goal , gk_save)
      const [settings] = await Settings.getSettings()
      res.json(settings)
    }
  catch (err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'})
  }
}