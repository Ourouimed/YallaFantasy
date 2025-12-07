const { deleteImage } = require("../lib/deleteImage");
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
        player_image : playerImage ,
        price : price
      }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating team" });
  }
}

exports.update = async (req , res)=>{
  const {fullname , team_id , price } = req.body
  const { id } = req.params
  
  if (!fullname || !team_id || !price ){
      return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [ player ] = await Players.getPlayerById(id)

    if(!player){
      res.status(404).json({error : 'player not found'})
    }

    let newPlayerImage = player.player_image; 
    if (req.file){
        await deleteImage(player.player_image)
        newPlayerImage = await uploadImage(req.file , "teams_flag")
    }

    Players.updatePlayer(fullname , team_id , price , newPlayerImage , id)
    res.json({ message: "Player updated!" , player : {
        player_id : id , 
        fullname : fullname , 
        team_id : team_id , 
        price : price,
        player_image : newPlayerImage
      }});
  }
  catch (err){
      console.log(err)
      return res.status(500).json({error : 'Error updating player!'})
  }
}