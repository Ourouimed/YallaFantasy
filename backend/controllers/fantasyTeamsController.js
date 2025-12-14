const FantasyTeams = require('../models/fantasyTeams');
const db = require('../config/db');

const createTeam = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // Assumes auth middleware populates req.user
    if (!name) return res.status(400).json({ message: 'Team name is required' });

    try {
        const existing = await FantasyTeams.getTeamByUserId(userId);
        if (existing) return res.status(400).json({ message: 'User already has a team' });

        const newTeam = await FantasyTeams.createTeam(userId, name);
        res.status(201).json(newTeam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const PointsCalculator = require('../services/pointsCalculator');

const getMyTeam = async (req, res) => {
    const userId = req.user.id;
    try {
        const team = await FantasyTeams.getTeamByUserId(userId);
        if (!team) return res.status(404).json({ message: 'No team found' });

        // Fetch static squad data
        const squad = await FantasyTeams.getSquad(team.id);

        // Calculate live points
        const liveData = await PointsCalculator.calculateTeamPoints(team.id);

        // Merge live points into squad array
        const squadWithPoints = squad.map(player => {
            const livePlayer = liveData.players.find(p => p.player_id === player.player_id);
            return {
                ...player,
                live_stats: livePlayer ? livePlayer.stats : null,
                live_points: livePlayer ? livePlayer.points : 0
            };
        });

        res.json({
            ...team,
            squad: squadWithPoints,
            gw_points: liveData.total_points
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const Settings = require('../models/settings');
const Rounds = require('../models/rounds');

const saveSquad = async (req, res) => {
    const userId = req.user.id;
    const { playerIds, captainId, viceCaptainId } = req.body;

    if (!playerIds || !Array.isArray(playerIds)) {
        return res.status(400).json({ message: 'Invalid player list' });
    }

    try {
        const team = await FantasyTeams.getTeamByUserId(userId);
        if (!team) return res.status(404).json({ message: 'No team found' });

        // 1. Check Deadline
        const settings = await Settings.getSettings();
        if (settings && settings.current_round_id) {
            const [rounds] = await Rounds.getRoundById(settings.current_round_id); // Returns array
            if (rounds) {
                const deadline = new Date(rounds.round_deadline);
                const now = new Date();

                // Allow a small buffer or strict? Strict.
                if (now > deadline) {
                    return res.status(400).json({ message: 'Gameweek deadline has passed. Transfers are locked.' });
                }

                // 2. Calculate Transfers (Only if season started / round active)
                // If pre-season (no current_round or round 1 not started), free.
                // Assuming if current_round_id is set, we are in season.

                const oldSquad = await FantasyTeams.getSquad(team.id);
                const oldIds = new Set(oldSquad.map(p => p.player_id));
                const newIds = new Set(playerIds);

                // Count how many new IDs are NOT in old IDs
                let transfersResult = 0;
                newIds.forEach(id => {
                    if (!oldIds.has(id)) transfersResult++;
                });

                if (transfersResult > 0) {
                    // Check logic: 
                    // Free transfers available?
                    let cost = 0;
                    let remainingFree = team.transfers_left || 0;

                    if (transfersResult <= remainingFree) {
                        // All free
                        remainingFree -= transfersResult;
                    } else {
                        // Some paid
                        const paidTransfers = transfersResult - remainingFree;
                        cost = paidTransfers * 4;
                        remainingFree = 0;
                    }

                    // Apply deductions
                    if (cost > 0) {
                        // Check if can afford points deduction? Usually yes, keeps going negative.
                        await db.query('UPDATE fantasy_teams SET total_points = total_points - ?, transfers_left = ? WHERE id = ?', [cost, remainingFree, team.id]);
                    } else {
                        await db.query('UPDATE fantasy_teams SET transfers_left = ? WHERE id = ?', [remainingFree, team.id]);
                    }
                }
            }
        }

        await FantasyTeams.saveSquad(team.id, playerIds, captainId, viceCaptainId);
        res.json({ message: 'Squad saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createTeam, getMyTeam, saveSquad };

