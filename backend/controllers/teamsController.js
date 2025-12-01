const multer = require("multer");
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
      );

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


    res.json({ message: "Team created!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading team flag" });
  }
}