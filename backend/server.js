require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')

// routes
const authRouter = require('./routes/auth')
const teamsRouter = require('./routes/teams')
const playersRouter = require('./routes/players')
const roundsRouter = require('./routes/rounds')
const matchesRouter = require('./routes/matches')
const settingsRouter = require('./routes/settings')
const myTeamRouter = require('./routes/my-team')
const leagueRouter = require('./routes/leagues')



const corsOptions = require('./middelware/corsOptions')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001


app.use(express.json())
app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(cookieParser());


// routes
app.use('/api/auth', authRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/players', playersRouter)
app.use('/api/rounds', roundsRouter)
app.use('/api/matches', matchesRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/my-team', myTeamRouter)
app.use('/api/leagues', leagueRouter)

// Health check route
app.get('/', (req, res) => {
    res.send('Server is running');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
} else {
    // For Vercel, we need to export the app, but some setups might prefer listening if not purely serverless function based.
    // However, Vercel generally handles the listening part for serverless functions if we export app.
    // Explicitly listening in production can sometimes cause port conflicts in serverless environments if not handled by the platform.
    // But for a standard node app deployment (not serverless functions), we DO need to listen.
    // Given the vercel.json rewrites to server.js, it's likely treated as a serverless function entry point or a standalone app.
    // Safe bet: always export app. Vercel usually ignores app.listen if it wraps it, or requires it if it's a "Web Service".
    // Let's keep the listen logic conditional but ensure app is exported.
}


module.exports = app