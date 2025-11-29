require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const authRouter = require('./routes/auth')
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


app.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}`)
})