const { generateId } = require("../lib/generateId");
const League = require("../models/league");
const jwt = require('jsonwebtoken');
const MyTeam = require("../models/my-team");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


exports.createLeague = async (req , res)=>{
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
    
        const { league_name } = req.body
        if (!league_name){
            return res.status(400).json({ error: "League name is required" });
        }

        const leagueId = generateId()
        await League.createLeague(leagueId , league_name , userId)

        await League.joinLeague(leagueId , userId)

        const [leagueInfo] = await League.getLeagueInfo(userId , leagueId)

        return res.json({
            message : 'League created successfully' , 
            league : leagueInfo
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Failed to create league' });
    }
    


}

exports.joinLeague = async (req , res)=>{
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
    
        const { id} = req.body
        if (!id){
            return res.status(400).json({ error: "League id is required" });
        }


        const [checkLeagueAlready ] = await League.getLeagueInfo(userId , id)
        if (checkLeagueAlready){
            return res.status(500).json({error : 'Already joined this league'})
        }


        const [team] = await MyTeam.getTeamDetaills(userId) 
        if (!team){
            return res.status(400).json({error : 'You must create a team first'})
        }

        const checkIfExist = await League.CheckExistance(id)
        if (checkIfExist.length === 0){
            return res.status(500).json({error : 'League not found'})
        }
        
        await League.joinLeague(id , userId)

        const [leagueInfo] = await League.getLeagueInfo(userId , id)

        return res.json({
            message : 'League created successfully' , 
            league : leagueInfo
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Failed to join league' });
    }
    


}


exports.getAllLeagues = async (req , res)=>{
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;


    

        const leagues = await League.getLeaguesByUser(userId)

        return res.json({ 
            leagues 
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Failed to fetch league' });
    }
}


exports.getLeaguePage = async (req , res)=>{
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const { id } = req.params


        const [league] = await League.getLeagueInfo(userId , id)
        if (!league){
            return res.status(404).json({error : 'League not found'})
        } 


        const members = await League.getLeagueMembers(id)
        

        return res.json({league , members , message : 'Data fetched successfully'})
        


    }

    catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Failed to fetch league' });
    }
}