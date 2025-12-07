const { deleteImage } = require("../lib/deleteImage");
const { uploadImage } = require("../lib/upload-image");
const Teams = require("../models/teams");

exports.create = async (req , res)=>{
    try {
      const { teamName, group } = req.body;

      if (!teamName || !group || !req.file){
        return res.status(400).json({ error: "All fields are required" });
      }

      const flagUrl = await uploadImage(req.file , "teams_flag")
      await Teams.createTeam(teamName , group , flagUrl)

      res.json({ message: "Team created successfully!" , team : {
        team_id : teamName , 
        team_name : teamName , 
        group_num : group , 
        flag : flagUrl
      }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating team" });
  }
}

exports.update = async (req , res)=>{
  const { teamName , flag , group} = req.body
  const { id } = req.params
  
  if (!teamName || !group || !flag){
        return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [ team ] = await Teams.getTeamById(id)

    if(!team){
      res.status(404).json({error : 'Team not found'})
    }

    let newFlagUrl = team.flag; 
    if (req.file){
        await deleteImage(team.flag)
        newFlagUrl = await uploadImage(req.file , "teams_flag")
    }

    Teams.updateTeam(teamName  , group , newFlagUrl , id)
    res.json({ message: "Team updated!" , team : {
        team_id : id , 
        team_name : teamName , 
        group_num : group , 
        flag : newFlagUrl
      }});
  }
  catch (err){
      console.log(err)
      return res.status(500).json({error : 'Error updating team!'})
  }
}

exports.getAllTeams = async (req , res)=>{
      try {
        const teams = await Teams.getAllTeams()
        res.json(teams)
      }
      catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
      }
      
}

exports.delete = async (req , res)=>{
  const { id } = req.body
  if (!id){
    return res.status(400).json({ error: "No team Id provided" });
  }

  try {
    const results = await Teams.deleteByid(id)
    if (results.affectedRows === 0){
       return res.status(404).json({ error: "Team not found" });
    }
    res.json({message : 'Team deleted successfully'})
  }
  catch(err) {
    console.log(err)
    return res.status(500).json({error : 'Error deleting team!'})
  }
  
}