const jwt = require('jsonwebtoken');
const MyTeam = require('../models/my-team');
const Rounds = require('../models/rounds');
const { getDeadlines } = require('../lib/getDeadlines');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";




exports.getTeamSquad = async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            error: 'Session expired or invalid. Please login again.'
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const userId = decoded.id

        const rounds = await Rounds.getAllrounds()
        const { nextRound, prevRound } = getDeadlines(rounds)
        console.log({ nextRound, prevRound })

        if (!nextRound) {
            return res.json(null)
        }

        
        const nextSquad = await MyTeam.getTeamSquad(userId,nextRound.round_id)
        if (!nextSquad) {
            const prevSquad = await MyTeam.getTeamSquad(userId,nextRound.round_id)
            if (!prevSquad) {

            }
            return res.json({players : null , nextDeadline : nextRound , team_data : team})
        }

        

        
        return res.json({players : null , nextDeadline : nextRound})

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Failed to get team squad'
        })
    }
}


