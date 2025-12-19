const Auth = require("../models/auth")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require("../lib/send-email");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


const uuid = require('uuid');
const uuidv4 = uuid.v4;

exports.register = async (req, res) => {
    const { email, password, fullname } = req.body
    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check User existance before create new One
        const [user] = await Auth.getUserByEmail(email)
        if (user) {
            return res.status(409).json({ error: 'Email already registred' })
        }

        // Create a secure Hashed Password using bcrypt
        const hashedPass = await bcrypt.hash(password, 10)

        // Generate a random uuid id
        const generatedId = uuidv4()

        // Create a new user
        await Auth.createUser(email, generatedId, hashedPass, fullname)



        // send a verification email 
        await sendVerificationEmail(generatedId, email)

        res.status(200).json({ message: 'User Created succesfully' })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' })
    }

}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check user Existance
        const [user] = await Auth.getUserByEmail(email)
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // compare stored hashed password with password provided by user
        const isMatch = await bcrypt.compare(password, user?.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // check if email is verfified or not 
        const emailVerified = user?.email_verified
        if (!emailVerified) {
            return res.status(403).json({ error: 'Please verify your email before login in !' })
        }

        // Create a jwt token
        const payload = { id: user.id, email: user.email, fullname: user.fullname, role: user.role }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Set the token in an HttpOnly cookie
        return res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
            maxAge: 3600000,
        }).json({
            message: 'Login successfull', data: {
                email: user.email,
                fullname: user.fullname,
                role: user.role
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.verfifyEmail = async (req, res) => {
    const { id } = req.query
    try {
        if (!id) {
            return res.status(400).json({ error: 'No id provided' })
        }

        // Check user Existance
        const [user] = await Auth.getUserById(id)
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        await Auth.verifyEmail(id)
        return res.status(201).json({ message: 'Email verified successfully' })
    }



    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' })
    }


}

exports.verfifySession = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ error: 'Session expired or invalid. Please login again.' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [user] = await Auth.getUserById(decoded.id)
        if (!user) return res.status(401).json({ error: 'Session expired or invalid. Please login again.' })
        res.json({
            message: 'Valide session', data: {
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(401).json({ error: 'Session expired or invalid. Please login again.', });
    }
}

exports.logout = async (req, res) => {
    return res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
    }).json({ message: 'Logout successfull', })
}