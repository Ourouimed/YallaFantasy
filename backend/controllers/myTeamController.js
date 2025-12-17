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
        console.log(nextRoundSquad.length)
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


exports.saveTeam = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const rounds = await Rounds.getAllrounds();
        const { nextRound } = getDeadlines(rounds);
        const { team_name, players: { GK, DEF, MID, FWD }, point_hit, transfers_made } = req.body;

        const captain = FWD[0]?.player_id;
        const vice_captain = MID[0]?.player_id;

        // 1. Helper to flatten players and assign starter status
        // Standard FPL logic: 11 starters, 4 subs. 
        // We'll mark them based on your incoming arrays.
        const preparePlayers = () => {
            const allPlayers = [];
            
            // Logic: GK[0] is starter, others are subs. 
            // For others, usually the first X are starters.
            // Adjust the slice numbers based on your specific roster rules.
            const processCategory = (list, starterCount) => {
                list.forEach((p, index) => {
                    allPlayers.push({
                        ...p,
                        is_starter: index < starterCount ? 1 : 0
                    });
                });
            };

            processCategory(GK, 1);
            processCategory(DEF, 4); // Example: 4 starters
            processCategory(MID, 4); // Example: 4 starters
            processCategory(FWD, 2); // Example: 2 starters
            return allPlayers;
        };

        const flatPlayers = preparePlayers();
        const teamValue = flatPlayers.reduce((acc, p) => acc + Number(p.price || p.purchased_price), 0);

        const [savedTeam] = await MyTeam.getTeamDetaills(userId);

        if (savedTeam) {
            if (transfers_made <= 0) {
                return res.json({
                    team: { team_name: savedTeam.team_name, balance: 100 - teamValue, team: savedTeam.available_transfers },
                    nextDeadline: nextRound,
                    players: flatPlayers
                });
            } else {
                let newTransfers = savedTeam.available_transfers > transfers_made ? savedTeam.available_transfers - transfers_made : 0;
                await MyTeam.updateTotalTransfers(newTransfers, userId);
                await MyTeam.reducePoints(point_hit, userId);

                await MyTeam.clearSquad(nextRound.round_id, userId);

                // Save all players with the is_starter flag
                await Promise.all(
                    flatPlayers.map(p => 
                        MyTeam.savePlayer(userId, p.player_id, p.national_team, nextRound.round_id, p.price, p.is_starter)
                    )
                );

                const [updatedTeam] = await MyTeam.getTeamDetaills(userId);
                return res.json({
                    team: { team_name: updatedTeam.team_name, balance: 100 - teamValue, team: updatedTeam.available_transfers },
                    nextDeadline: nextRound,
                    players: flatPlayers
                });
            }
        }

        // Logic for New Team Creation
        await MyTeam.createTeam(userId, team_name, nextRound.round_id, captain, vice_captain);
        await Promise.all(
            flatPlayers.map(p => 
                MyTeam.savePlayer(userId, p.player_id, p.national_team, nextRound.round_id, p.price, p.is_starter)
            )
        );

        const [newTeam] = await MyTeam.getTeamDetaills(userId);
        return res.json({
            team: { team_name: newTeam.team_name, balance: 100 - teamValue, team: newTeam.available_transfers },
            nextDeadline: nextRound,
            players: flatPlayers
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save team squad' });
    }
};


