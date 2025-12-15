const jwt = require('jsonwebtoken');
const MyTeam = require('../models/my-team');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
exports.getTeam = async (req , res)=>{
    const token = req.cookies.token
    if (!token){
        return res.status(401).json({error : 'Session expired or invalid. Please login again.'})
    }


    try {
            const decoded = jwt.verify(token  , JWT_SECRET)
            const [team] = await MyTeam.getTeam(decoded.id)
            res.json(team)
    }

    catch(err) {
        console.log(err)
        return res.status(500).json({error : 'Error deleting Round!'})
    }

    

}