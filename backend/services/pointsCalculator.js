const db = require('../config/db');
const Settings = require('../models/settings');

const PointsCalculator = {
    calculateTeamPoints: async (fantasyTeamId) => {
        // 1. Get Settings for points multipliers & current round
        const settings = await Settings.getSettings();
        if (!settings || !settings.current_round_id) return { total_points: 0, players: [] };

        const { current_round_id, goal_points, assist_points, clean_sheet_points } = settings;

        // 2. Get Squad Selection
        const [selections] = await db.query('SELECT player_id, is_captain, is_bench FROM fantasy_selections WHERE fantasy_team_id = ?', [fantasyTeamId]);
        if (selections.length === 0) return { total_points: 0, players: [] };

        const playerIds = selections.map(s => s.player_id);

        // 3. Get Stats from linup table for current round
        // We join with matches to filter by round
        // Assuming player_id is string in both
        const [stats] = await db.query(`
            SELECT l.player_id, l.goals, l.assists, l.clean_sheets, l.red_card, l.yallow_cards, l.own_goals
            FROM linup l
            JOIN matches m ON l.match_id = m.match_id
            WHERE l.player_id IN (?) AND m.match_round = ?
        `, [playerIds, current_round_id]);

        // Map stats to easy lookup
        const statsMap = {};
        stats.forEach(s => statsMap[s.player_id] = s);

        let teamTotal = 0;
        const playerPoints = selections.map(sel => {
            const stat = statsMap[sel.player_id] || { goals: 0, assists: 0, clean_sheets: 0, red_card: 0, yallow_cards: 0, own_goals: 0 };

            // Calculate raw points
            let points =
                (stat.goals * goal_points) +
                (stat.assists * assist_points) +
                (stat.clean_sheets * clean_sheet_points);

            // Deductions (could be in settings too, but hardcoding standard rules for now if missing)
            // Red card: -3, Yellow: -1, Own Goal: -2 (as example defaults)
            points -= (stat.red_card * 3);
            points -= (stat.yallow_cards * 1);
            points -= (stat.own_goals * 2);

            // Participation points (if min_played > 60 => 2, else 1) - skipped for simple MVP

            // Apply Captain multiplier
            if (sel.is_captain) points *= 2;

            // Bench doesn't count towards total (unless we do auto-subs, skipping for MVP)
            if (!sel.is_bench) {
                teamTotal += points;
            }

            return {
                player_id: sel.player_id,
                points: points,
                stats: stat,
                is_captain: sel.is_captain,
                is_bench: sel.is_bench
            };
        });

        return { total_points: teamTotal, players: playerPoints };
    }
}

module.exports = PointsCalculator;
