const cloudinary = require("../config/cloud");
const uploadImage = async (file , folder_name)=>{
    let flagUrl = null;
      if (file) {
        // Upload buffer to Cloudinary
        const result = await cloudinary.uploader.upload_stream(
          { folder: folder_name },
          (error, result) => {
            if (error) throw error;
            return result;
          }
        )

        // Using a Promise wrapper for async/await
        flagUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: folder_name },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });


        return flagUrl
        
      }
}

module.exports = { uploadImage }