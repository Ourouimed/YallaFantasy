const Leagues = require('../models/leagues');
const FantasyTeams = require('../models/fantasyTeams');

const createLeague = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) return res.status(400).json({ message: 'League name is required' });

    try {
        const fantasyTeam = await FantasyTeams.getTeamByUserId(userId);
        if (!fantasyTeam) return res.status(400).json({ message: 'You must create a fantasy team first' });

        const league = await Leagues.createLeague(name, userId);

        // Auto-join creator
        await Leagues.joinLeague(league.id, fantasyTeam.id);

        res.status(201).json(league);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const joinLeague = async (req, res) => {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) return res.status(400).json({ message: 'League code is required' });

    try {
        const fantasyTeam = await FantasyTeams.getTeamByUserId(userId);
        if (!fantasyTeam) return res.status(400).json({ message: 'You must create a fantasy team first' });

        const league = await Leagues.getLeagueByCode(code);
        if (!league) return res.status(404).json({ message: 'League not found' });

        const isMember = await Leagues.isMember(league.id, fantasyTeam.id);
        if (isMember) return res.status(400).json({ message: 'Already a member' });

        await Leagues.joinLeague(league.id, fantasyTeam.id);

        res.json({ message: 'Joined league successfully', league });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const getMyLeagues = async (req, res) => {
    const userId = req.user.id;
    try {
        const fantasyTeam = await FantasyTeams.getTeamByUserId(userId);
        if (!fantasyTeam) return res.json([]); // No team = no leagues

        const leagues = await Leagues.getUserLeagues(fantasyTeam.id);
        res.json(leagues);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const getLeagueDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const league = await Leagues.getLeagueById(id);
        if (!league) return res.status(404).json({ message: 'League not found' });

        const standings = await Leagues.getLeagueStandings(id);

        res.json({ ...league, standings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createLeague, joinLeague, getMyLeagues, getLeagueDetails };
