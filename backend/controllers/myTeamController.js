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

        if (!nextRound) {
            return res.json(null)
        }

        const [team] = await MyTeam.getTeamDetaills(userId)
        if (!team){
            return res.json({team : {team_name : "" , balance : 100 , unlimited_transfers : true , free_transfers : 0}  , nextDeadline : nextRound , players : {
                GK : [] , DEF : [] , MID : [] , FWD : []
            }})
        }
       

        const nextRoundSquad = await MyTeam.getTeamSquad(nextRound.round_id , userId)
        if (nextRoundSquad.length === 0){
            const prevRoundSquad = await MyTeam.getTeamSquad(prevRound?.round_id , userId)
            if (prevRoundSquad.length ===  0){
                 return res.json({team : {team_name : "" , balance : 100 , unlimited_transfers : true , free_transfers : 0}  , nextDeadline : nextRound , players : {
                    GK : [] , DEF : [] , MID : [] , FWD : []
                }})
            }

            await Promise.all(
                prevRoundSquad.map(({player_id , national_team , id_team , purchased_price}) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , purchased_price )) 
            )
            await MyTeam.addNewTransfer(userId)
            const nextRoundSquad = await MyTeam.getTeamSquad(nextRound.round_id , userId)
            const playersPrices = nextRoundSquad.map(e => Number(e.purchased_price))
            const teamValue = playersPrices.reduce((a , b)=> a + b , 0)
            const players = {
                GK : nextRoundSquad.filter(p => p.position === 'GK') ,
                DEF : nextRoundSquad.filter(p => p.position === 'DEF') ,
                MID : nextRoundSquad.filter(p => p.position === 'MID'),
                FWD : nextRoundSquad.filter(p => p.position === 'FWD')
            }
            const [chips] = await MyTeam.getChips(userId)
            const chipsArray = Object.entries(chips).map(([key, val]) => ({
                chip_name: key,
                used_at: val
            }));

            let unlimited_transfers
            if (nextRound.round_id === team.start_at) unlimited_transfers = true
            else unlimited_transfers = false
            const [team] = await MyTeam.getTeamDetaills(userId)
            return res.json({team : {team_name : team.team_name, balance : 100 - teamValue , chips : chipsArray , free_transfers : team.available_transfers , unlimited_transfers } , nextDeadline : nextRound , players : players})
        }


        const playersPrices = nextRoundSquad.map(e => Number(e.purchased_price))
        const teamValue = playersPrices.reduce((a , b)=> a + b , 0)
        const players = {
            GK : nextRoundSquad.filter(p => p.position === 'GK') ,
            DEF : nextRoundSquad.filter(p => p.position === 'DEF') ,
            MID : nextRoundSquad.filter(p => p.position === 'MID'),
            FWD : nextRoundSquad.filter(p => p.position === 'FWD')
        }
        const [chips] = await MyTeam.getChips(userId)
        const chipsArray = Object.entries(chips).map(([key, val]) => ({
            chip_name: key,
            used_at: val
        }));

        let unlimited_transfers
        if (nextRound.round_id === team.start_at) unlimited_transfers = true
        else unlimited_transfers = false


        const [newTeam] = await MyTeam.getTeamDetaills(userId)
        console.log(newTeam.available_transfers)
        return res.json({team : {team_name : newTeam.team_name, balance : 100 - teamValue , chips : chipsArray , free_transfers : newTeam.available_transfers , unlimited_transfers} , nextDeadline : nextRound , players : players})

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Failed to get team squad'
        })
    }
}


exports.saveTeam = async (req , res)=>{
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
        const { team_name , players , players : { GK , DEF , MID , FWD} , point_hit , transfers_made} = req.body
        const captain = FWD[0].player_id
        const vice_captain = MID[0].player_id


        console.log(GK.length)

        const [ savedTeam ] = await MyTeam.getTeamDetaills(userId)
        if (savedTeam) {
                if (transfers_made <= 0){
                    
                    const playersPrices = [...GK , ...MID , ...DEF , ...FWD].map(e => Number(e.purchased_price))
                    const teamValue = playersPrices.reduce((a , b)=> a + b , 0)
                    let players = [...GK , ...MID , ...DEF , ...FWD]


                    return res.json({team : {team_name : savedTeam.team_name, balance : 100 - teamValue  , team : savedTeam.available_transfers} , nextDeadline : nextRound , players : players})
                }
                else {
                    let newTransers = savedTeam.available_transfers > transfers_made ? savedTeam.available_transfers - transfers_made : 0
                    await MyTeam.updateTotalTransfers(newTransers , userId)
                    await MyTeam.reducePoints(point_hit , userId)


                    const [ newSavedTeam ] = await MyTeam.getTeamDetaills(userId) 

                    let resultss = await MyTeam.clearSquad(nextRound.round_id , userId)
                    console.log(resultss.affectedRows)

                    const playersPrices = [...GK , ...MID , ...DEF , ...FWD].map(e => Number(e.purchased_price))
                    const teamValue = playersPrices.reduce((a , b)=> a + b , 0)
                    let players = [...GK , ...MID , ...DEF , ...FWD]


                    await Promise.all(
                        FWD.map(({player_id , national_team , id_team , price}) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )


                    await Promise.all(
                        MID.map(({player_id , national_team , id_team , price}) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )


                    await Promise.all(
                        DEF.map(({player_id , national_team , id_team , price}) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )

                    await Promise.all(
                        GK.map(({player_id , national_team , id_team , price }) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )
                    
                    

                     return res.json({team : {team_name : newSavedTeam.team_name, balance : 100 - teamValue  , team : newSavedTeam.available_transfers} , nextDeadline : nextRound , players : players})
                }
            
        }


        await MyTeam.createTeam(userId , team_name , nextRound.round_id , captain , vice_captain) 
        const [ team ] = await MyTeam.getTeamDetaills(userId)
                    await Promise.all(
                        FWD.map(({player_id , national_team , id_team , price}) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )


                    await Promise.all(
                        MID.map(({player_id , national_team , id_team , price}) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )


                    await Promise.all(
                        DEF.map(({player_id , national_team , id_team , price}) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )

                    await Promise.all(
                        GK.map(({player_id , national_team , id_team , price }) => MyTeam.savePlayer(id_team , player_id , national_team , nextRound.round_id , price ))
                    )
        

        const playersPrices = [...GK , ...MID , ...DEF , ...FWD].map(e => Number(e.purchased_price))
        const teamValue = playersPrices.reduce((a , b)=> a + b , 0)

        return res.json({team : {team_name : team.team_name, balance : 100 - teamValue  , team : team.available_transfers} , nextDeadline : nextRound , players : players})



    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Failed to save team squad'
        })
    }
}


