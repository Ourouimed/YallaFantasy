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
      const {fullname , team_id , price , position} = req.body;
  

      if (!fullname || !team_id || !price|| !position || !req.file){
        return res.status(400).json({ error: "All fields are required" });
      }

      const playerImage = await uploadImage(req.file , "players")

      // full name parts
      const parts = fullname.trim().split(/\s+/);
      const [firstname, lastname = 'x', thirdname = 'x'] = parts;
      const playerId = `${firstname}_${lastname}_${thirdname}-${team_id}`;

      await Players.createPlayer(playerId , fullname , team_id , playerImage , price , position)
      return res.json({message: "Player created successfully!" , player : { 
            player_id : playerId , 
            fullname , team_id , 
            player_image : playerImage , 
            price , 
            position , 
      }})
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating team" });
  }
}

exports.update = async (req , res)=>{
  const {fullname , team_id , price , position} = req.body
  const { id } = req.params
  
  if (!fullname || !team_id || !price || !position){
      return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [ player ] = await Players.getPlayerById(id)

    if(!player){
      return res.status(404).json({error : 'player not found'})
    }

    const parts = fullname.trim().split(/\s+/);
    const [firstname, lastname = 'x', thirdname = 'x'] = parts;
    const newPlayerId = `${firstname}_${lastname}_${thirdname}-${team_id}`;
    let newPlayerImage = player.player_image; 
    if (req.file){
        await deleteImage(player.player_image)
        newPlayerImage = await uploadImage(req.file , "players")
    }

    await Players.updatePlayer(newPlayerId , fullname , team_id , price , newPlayerImage, id)
    return res.json({ message: "Player updated!" , player : { 
            player_id : newPlayerId , 
            fullname , team_id , 
            player_image : newPlayerImage , 
            price , 
            position , 
      }});
  }
  catch (err){
      console.log(err)
      return res.status(500).json({error : 'Error updating player!'})
  }
}

exports.delete = async (req , res)=>{
  const { id } = req.body
  if (!id){
    return res.status(400).json({ error: "No player Id provided" });
  }

  try {
    const results = await Players.deleteByid(id)
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