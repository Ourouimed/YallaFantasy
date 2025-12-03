const { getPublicIdFromUrl } = require("./getPublicIdFromUrl");
const cloudinary = require("../config/cloud");
const deleteImage = async (image)=>{
    if (image) {
        const flagPublicId = getPublicIdFromUrl(image); 
        await cloudinary.uploader.destroy(flagPublicId); 
    }
}


module.exports = { deleteImage }