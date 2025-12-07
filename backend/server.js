require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const authRouter = require('./routes/auth')
const teamsRouter = require('./routes/teams')
const playersRouter = require('./routes/players')
const corsOptions = require('./middelware/corsOptions')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = 3001


app.use(express.json())
app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(cookieParser());


// routes
app.use('/api/auth' , authRouter)
app.use('/api/teams' , teamsRouter)
app.use('/api/players' , playersRouter)

app.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}`)
})