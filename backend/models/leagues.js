const db = require('../config/db')
const { v4: uuidv4 } = require('uuid');

const Leagues = {
    createLeague: async (name, userId) => {
        // Generate a simple 6-char random code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const [result] = await db.query('INSERT INTO leagues (name, code, created_by) VALUES (?, ?, ?)', [name, code, userId]);
        const leagueId = result.insertId;

        return { id: leagueId, name, code, created_by: userId };
    },

    joinLeague: async (leagueId, fantasyTeamId) => {
        await db.query('INSERT INTO league_members (league_id, fantasy_team_id) VALUES (?, ?)', [leagueId, fantasyTeamId]);
    },

    getLeagueByCode: async (code) => {
        const [rows] = await db.query('SELECT * FROM leagues WHERE code = ?', [code]);
        return rows[0];
    },

    getLeagueById: async (id) => {
        const [rows] = await db.query('SELECT * FROM leagues WHERE id = ?', [id]);
        return rows[0];
    },

    getUserLeagues: async (fantasyTeamId) => {
        // Get leagues where this team is a member
        const [rows] = await db.query(`
            SELECT l.*, 
            (SELECT count(*) FROM league_members WHERE league_id = l.id) as member_count
            FROM leagues l
            JOIN league_members lm ON l.id = lm.league_id
            WHERE lm.fantasy_team_id = ?
        `, [fantasyTeamId]);
        return rows;
    },

    getLeagueStandings: async (leagueId) => {
        const [rows] = await db.query(`
            SELECT ft.id, ft.name as team_name, ft.total_points, u.fullname as manager_name
            FROM league_members lm
            JOIN fantasy_teams ft ON lm.fantasy_team_id = ft.id
            JOIN users u ON ft.user_id = u.id
            WHERE lm.league_id = ?
            ORDER BY ft.total_points DESC
        `, [leagueId]);
        return rows;
    },

    isMember: async (leagueId, fantasyTeamId) => {
        const [rows] = await db.query('SELECT * FROM league_members WHERE league_id = ? AND fantasy_team_id = ?', [leagueId, fantasyTeamId]);
        return rows.length > 0;
    }
}

module.exports = Leagues;
