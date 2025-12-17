const jwt = require('jsonwebtoken');
const MyTeam = require('../models/my-team');
const Rounds = require('../models/rounds');
const { getDeadlines } = require('../lib/getDeadlines');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";




exports.getTeamSquad = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const rounds = await Rounds.getAllrounds();
        const { nextRound, prevRound } = getDeadlines(rounds);

        if (!nextRound) return res.json(null);

        const [team] = await MyTeam.getTeamDetaills(userId);
        if (!team) {
            return res.json({
                team: { team_name: "", balance: 100, unlimited_transfers: true, free_transfers: 0 },
                nextDeadline: nextRound,
                PrevDeadline: prevRound,
                players: { GK: [], DEF: [], MID: [], FWD: [] }
            });
        }

        let nextRoundSquad = await MyTeam.getTeamSquad(nextRound.round_id, userId);

        // LOGIC: If next round is empty, copy from previous round
        if (nextRoundSquad.length === 0) {
            const prevRoundSquad = await MyTeam.getTeamSquad(prevRound?.round_id, userId);

            if (prevRoundSquad.length === 0) {
                return res.json({
                    team: { team_name: team.team_name, balance: 100, unlimited_transfers: true, free_transfers: 0 },
                    nextDeadline: nextRound,
                    PrevDeadline: prevRound,
                    players: { GK: [], DEF: [], MID: [], FWD: [] }
                });
            }

            // Map and save previous squad to next round (Preserving is_starter)
            await Promise.all(
                prevRoundSquad.map(p => 
                    MyTeam.savePlayer(
                        userId, 
                        p.player_id, 
                        p.national_team, 
                        nextRound.round_id, 
                        p.purchased_price, 
                        p.starting_linup 
                    )
                )
            );

            await MyTeam.addNewTransfer(userId);
            // Refresh the squad variable after copying
            nextRoundSquad = await MyTeam.getTeamSquad(nextRound.round_id, userId);
        }

        // Helper to format response data
        const playersPrices = nextRoundSquad.map(e => Number(e.purchased_price));
        const teamValue = playersPrices.reduce((a, b) => a + b, 0);
        
        const players = {
            GK: nextRoundSquad.filter(p => p.position === 'GK'),
            DEF: nextRoundSquad.filter(p => p.position === 'DEF'),
            MID: nextRoundSquad.filter(p => p.position === 'MID'),
            FWD: nextRoundSquad.filter(p => p.position === 'FWD')
        };

        const [chips] = await MyTeam.getChips(userId);
        const chipsArray = chips ? Object.entries(chips).map(([key, val]) => ({ chip_name: key, used_at: val })) : [];

        const [updatedTeam] = await MyTeam.getTeamDetaills(userId);
        const unlimited_transfers = (nextRound.round_id === updatedTeam.start_at);

        return res.json({
            team: { 
                team_name: updatedTeam.team_name, 
                balance: 100 - teamValue, 
                chips: chipsArray, 
                free_transfers: updatedTeam.available_transfers, 
                unlimited_transfers 
            },
            nextDeadline: nextRound,
            PrevDeadline: prevRound,
            players: players
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to get team squad' });
    }
};


exports.saveTeam = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Invalid Session' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const rounds = await Rounds.getAllrounds();
        const { nextRound } = getDeadlines(rounds);
        const { team_name, players: { GK, DEF, MID, FWD }, point_hit, transfers_made, formation } = req.body;

        // Dynamic Starter Logic based on Formation (e.g., "4-4-2")
        // If formation is provided, use it. Otherwise, use your defaults.
        const defCount = formation ? parseInt(formation.split('-')[0]) : 4;
        const midCount = formation ? parseInt(formation.split('-')[1]) : 4;
        const fwdCount = formation ? parseInt(formation.split('-')[2]) : 2;

        const preparePlayers = () => {
            const all = [];
            const add = (list, count) => {
                list.forEach((p, i) => {
                    all.push({ ...p, is_starter: i < count ? 1 : 0 });
                });
            };
            add(GK, 1);
            add(DEF, defCount);
            add(MID, midCount);
            add(FWD, fwdCount);
            return all;
        };

        const flatPlayers = preparePlayers();
        const teamValue = flatPlayers.reduce((acc, p) => acc + Number(p.price || p.purchased_price), 0);
        const [savedTeam] = await MyTeam.getTeamDetaills(userId);

        // 1. If Team Exists - Update Transfers and Squad
        if (savedTeam) {
            if (transfers_made > 0) {
                let newTransfers = Math.max(0, savedTeam.available_transfers - transfers_made);
                await MyTeam.updateTotalTransfers(newTransfers, userId);
                await MyTeam.reducePoints(point_hit, userId);
            }

            await MyTeam.clearSquad(nextRound.round_id, userId);
            await Promise.all(
                flatPlayers.map(p => 
                    MyTeam.savePlayer(userId, p.player_id, p.national_team, nextRound.round_id, (p.price || p.purchased_price), p.is_starter)
                )
            );
        } 
        // 2. New Team Creation
        else {
            const captain = FWD[0]?.player_id || MID[0]?.player_id;
            const vice_captain = MID[0]?.player_id || DEF[0]?.player_id;
            
            await MyTeam.createTeam(userId, team_name, nextRound.round_id, captain, vice_captain);
            await Promise.all(
                flatPlayers.map(p => 
                    MyTeam.savePlayer(userId, p.player_id, p.national_team, nextRound.round_id, p.price, p.is_starter)
                )
            );
        }

        const [finalTeam] = await MyTeam.getTeamDetaills(userId);
        return res.json({
            team: { team_name: finalTeam.team_name, balance: 100 - teamValue, free_transfers: finalTeam.available_transfers },
            nextDeadline: nextRound,
            players: flatPlayers
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save team' });
    }
};



exports.getPickedTeam = async (req , res)=>{
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

        if (!nextRound){
            return res.json({})
        }
        const [team] = await MyTeam.getTeamDetaills(userId)
        if (!team){
            return res.json({})
        }





        const PickedTeam = await MyTeam.getPickedTeam(nextRound?.round_id , userId)
        if (PickedTeam.length === 0){
            return res.json({})
        }

        const startingLinup = PickedTeam.filter(e => e.starting_linup)
        const bench = PickedTeam.filter(e => !e.starting_linup)




        const players = {startingLinup , bench}

        const [chips] = await MyTeam.getChips(userId)
        const chipsArray = Object.entries(chips).map(([key, val]) => ({
            chip_name: key,
            used_at: val
        }));


        const unlimited_transfers = (nextRound.round_id === team.start_at);
        return res.json({team : { team_name : team.team_name  , chips : chipsArray , captain : team.captain , vice_captain : team.vice_captain , unlimited_transfers} , players, nextDeadline : nextRound})

        

        
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save team squad' });
    }
}




