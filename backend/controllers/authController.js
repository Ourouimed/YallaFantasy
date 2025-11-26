const Auth = require("../models/auth")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require("../lib/send-email");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.register = async (req , res)=>{
    const { email , password , fullname } = req.body
    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check User existance before create new One
        const userExist = await Auth.getUserByEmail(email)
        if(userExist.length > 0){
            return res.status(409).json({error :'Email already registred'})
        }

        // Create a secure Hashed Password using bcrypt
        const hashedPass = await bcrypt.hash(password , 10)

        // Create a new user
        await Auth.createUser(email , hashedPass , fullname)

        // get the new registred user id
        const [user] = await Auth.getUserByEmail(email)
        

        // Create a jwt token
        jwt.sign({id : user.id , password , email} 
            , JWT_SECRET , { expiresIn : '3d'}
        )

        // send a verification email 
        await sendVerificationEmail(email)


        res.status(200).json({message : 'User Created succesfully'})

        



    }
    catch (err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'})
    }
    
}