const cloudinary = require("../config/cloud");
const Teams = require("../models/teams");

exports.create = async (req , res)=>{
    try {
    const { teamName, group } = req.body;

    let flagUrl = null;
    if (req.file) {
      // Upload buffer to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { folder: "teams_flags" },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      )

      // Using a Promise wrapper for async/await
      flagUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "teams_flags" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });

      Teams.createTeam(teamName , group , flagUrl)
    }


    res.json({ message: "Team created!" , team : {
      team_id : teamName , 
      team_name : teamName , 
      group_num : group , 
      flag : flagUrl
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading team flag" });
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
    const res = await Teams.deleteByid(id)
    if (res.affectedRows === 0){
       return res.status(404).json({ message: "Team not found" });
    }
    res.json({message : 'Team deleted successfully'})
  }
  catch {
    return res.status(500).json({error : 'Error deleting team!'})
  }
  
}