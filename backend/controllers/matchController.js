const Matches = require("../models/matchs");
const Players = require("../models/players");
const Settings = require("../models/settings");

exports.create = async (req , res)=> {
    try {
      const {home_team , away_team , match_time , match_round} = req.body;
  

      if (!home_team || !away_team || !match_time || !match_round){
        return res.status(400).json({ error: "All fields are required" });
      }

      const utc_match_time = new Date(match_time).toISOString().replace('T', ' ').substring(0, 19); 
      const generatedId = `M-${match_round}-${home_team}-${away_team}`
      await Matches.createMatch(generatedId , home_team , away_team , utc_match_time , match_round);
      const [ match ] = await Matches.getMatchById(generatedId)

      res.json({
        message: "Match created successfully!",
        match: match
        });


    }
    catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
    }
}

exports.start = async ( req , res)=>{
  try {
      const { id } = req.params
      if (!id){
          return res.status(404).json({error : "No id provided"})
      }

      const [match] = await Matches.getMatchById(id) 
      if (!match){
          return res.status(404).json({error : "Match unfound"})
      }

      const matchTime = new Date(match?.match_time);
      const now = new Date();
      const canStartMatch = now > matchTime;

      if (!canStartMatch) {
        return res.status(500).json({error : 'Cannot start match'})
      }

      await Matches.startMatch(id)

      const [updatedMatch] = await Matches.getMatchById(id) 
      return res.json(updatedMatch)
    }
    catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
    }
}

exports.getAllMatches = async (req , res)=>{
      try {
        const matches = await Matches.getAllMatches()
        res.json(matches)
      }
      catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
      }
}

exports.getMatchDetails = async (req , res)=>{
    try {
      const { id } = req.params
      if (!id){
          return res.status(404).json({error : "No id provided"})
      }

      const [match] = await Matches.getMatchById(id) 
      if (!match){
          return res.status(404).json({error : "Match unfound"})
      }

      console.log(match)

      const homeLinup = await Matches.getLinup(match.match_id , match.home_team)
      const awayLinup = await Matches.getLinup(match.match_id , match.away_team)
      return res.json({match , linups : {
        home : homeLinup ,
        away : awayLinup
      }})
    }
    catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
    }
}


exports.addToLinup = async (req, res) => {
  const {
    player_id,
    team_id,
    match_id,
    red_card = 0,
    yellow_cards = 0,
    assists = 0,
    goals = 0,
    pen_saves = 0,
    pen_missed = 0,
    gk_save = 0 ,
    min_played = 0,
    own_goals = 0,
    clean_sheets = 0 ,
    conceded_goal = 0
  } = req.body;

  if (!player_id || !team_id || !match_id) {
    return res.status(400).json({ error: "All fields are required" });
  }


  const [player] = await Players.getPlayerById(player_id)
  if (!player){
    return res.status(404).json({error : 'Player not found'})
  }

  const { position } = player

  const playedMoreThan60 = min_played >= 60;

  const [settings] = await Settings.getSettings()
  console.log(settings)

  //  Points calculation 
  let totalPoints = 0;

  // General points
  totalPoints += playedMoreThan60 ? 2 : min_played > 0 ? 1 : 0;  
  totalPoints -= yellow_cards * settings.yellow_card;
  totalPoints -= red_card * settings.red_card;
  totalPoints -= pen_missed * settings.pen_missed;
  totalPoints -= own_goals * settings.own_goal;
  totalPoints += assists * settings.assist;


  if (position === 'FWD'){
      totalPoints += goals * settings.goal_for_FWD
  }
  else if (position === 'MID'){
      totalPoints += goals * settings.goal_for_MID
      if(clean_sheets && playedMoreThan60){
        totalPoints += settings.clean_sheets_mid
      }
  }

  else if (position === 'DEF'){
      totalPoints += goals * settings.goal_for_DEF
      totalPoints -= settings.conceded_goal * Math.floor(conceded_goal / 2)
      if(clean_sheets && playedMoreThan60){
        totalPoints += settings.clean_sheets_def
      }
  }

  else if (position === 'GK'){
      totalPoints += goals * settings.goal_for_GK
      totalPoints += pen_saves * settings.pen_saves;
      totalPoints -= settings.conceded_goal * Math.floor(conceded_goal / 2)
      totalPoints += settings.gk_save * Math.floor(gk_save / 3)
      if(clean_sheets && playedMoreThan60){
        totalPoints += settings.clean_sheets_gk
      }
  }

  try {
    await Matches.addPlayerToLinup(
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
      totalPoints ,
      position ,
      gk_save , 
      conceded_goal
    );

    const [playerAddedToLinup ] = await Matches.getPlayerFromLinup(match_id , team_id , player_id)
    return res.status(201).json({
      message: "Player added to lineup successfully" , player : playerAddedToLinup
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.updateLinupPlayer = async (req, res) => {
  const {
    player_id,
    team_id,
    match_id,
    red_card = 0,
    yellow_cards = 0,
    assists = 0,
    goals = 0,
    gk_save = 0 ,
    pen_saves = 0,
    pen_missed = 0,
    min_played = 0,
    own_goals = 0,
    clean_sheets = 0,
    conceded_goal = 0
  } = req.body;


  console.log(req.body)

  if (!player_id || !team_id || !match_id) {
    return res.status(400).json({ error: "All fields are required" });
  }


  const [player] = await Players.getPlayerById(player_id)
  if (!player){
    return res.status(404).json({error : 'Player not found'})
  }

  const { position } = player

  const playedMoreThan60 = min_played >= 60;

  const [settings] = await Settings.getSettings()
  

  //  Points calculation 
  let totalPoints = 0;

  // General points
  totalPoints += playedMoreThan60 ? 2 : min_played > 0 ? 1 : 0;  
  totalPoints -= yellow_cards * settings.yellow_card;
  totalPoints -= red_card * settings.red_card;
  totalPoints -= pen_missed * settings.pen_missed;
  totalPoints -= own_goals * settings.own_goal;
  totalPoints += assists * settings.assist;


  if (position === 'FWD'){
      totalPoints += goals * settings.goal_for_FWD
  }
  else if (position === 'MID'){
      totalPoints += goals * settings.goal_for_MID
      if(clean_sheets && playedMoreThan60){
        totalPoints += settings.clean_sheets_mid
      }
  }

  else if (position === 'DEF'){
      totalPoints += goals * settings.goal_for_DEF
      totalPoints -= settings.conceded_goal * Math.floor(conceded_goal / 2)
      if(clean_sheets && playedMoreThan60){
        totalPoints += settings.clean_sheets_def
      }
      
  }

  else if (position === 'GK'){
      totalPoints += goals * settings.goal_for_GK
      totalPoints += pen_saves * settings.pen_saves;
      totalPoints -= settings.conceded_goal * Math.floor(conceded_goal / 2)
      totalPoints += settings.gk_save * Math.floor(gk_save / 3)
      if(clean_sheets && playedMoreThan60){
        totalPoints += settings.clean_sheets_gk
      }
  }

  try {
    await Matches.updatePlayerLinup(
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
      totalPoints ,
      position , 
      gk_save ,
      conceded_goal
    );

    const [playerAddedToLinup ] = await Matches.getPlayerFromLinup(match_id , team_id , player_id)
    return res.json({
      message: "Player added to lineup successfully" , player : playerAddedToLinup
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};


exports.deleteFromLinup = async (req , res)=>{
  const { player_id , match_id} = req.body
  if (!player_id || !match_id){
    return res.status(400).json({ error: "No player Id provided" });
  }

  try {
    const results = await Matches.deleteFromLinup(match_id , player_id)
    if (results.affectedRows === 0){
       return res.status(404).json({ error: "Player not found" });
    }
    res.json({message : 'Player deleted successfully'})
  }
  catch(err) {
    console.log(err)
    return res.status(500).json({error : 'Error deleting Player!'})
  }
}