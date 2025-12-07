const { uploadImage } = require("../lib/upload-image");
const Players = require("../models/players");

exports.getAllPlayers = async (req , res)=>{
      try {
        const players = await Players.getAllPlayers()
        res.json(players)
      }
      catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
      }
}


exports.create = async (req , res)=>{
    try {
      const {fullname , team_id , price } = req.body;

      if (!fullname || !team_id || !price|| !req.file){
        return res.status(400).json({ error: "All fields are required" });
      }

      const playerImage = await uploadImage(req.file , "players_images")
      await Players.createPlayer(fullname , team_id , playerImage , price)

      res.json({ message: "Player created successfully!" , player : {
        player_id : fullname , 
        fullname : fullname , 
        team_id : team_id , 
        player_Image : playerImage ,
        price : price
      }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating team" });
  }
}