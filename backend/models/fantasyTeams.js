const db = require('../config/db')

const FantasyTeams = {
    createTeam: async (userId, name) => {
        const [result] = await db.query('INSERT INTO fantasy_teams (user_id, name) VALUES (?, ?)', [userId, name]);
        return { id: result.insertId, user_id: userId, name };
    },
    getTeamByUserId: async (userId) => {
        const [rows] = await db.query('SELECT * FROM fantasy_teams WHERE user_id = ?', [userId]);
        return rows[0];
    },
    updateTeam: async (id, name) => {
        await db.query('UPDATE fantasy_teams SET name = ? WHERE id = ?', [name, id]);
    },
    saveSquad: async (fantasyTeamId, playerIds, captainId, viceCaptainId) => {
        // Use a transaction for safety
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Clear existing selections for this team
            await connection.query('DELETE FROM fantasy_selections WHERE fantasy_team_id = ?', [fantasyTeamId]);

            // 2. Insert new selections
            // Assuming playerIds is an array of strings (player_id)
            if (playerIds.length > 0) {
                const values = playerIds.map(pid => [
                    fantasyTeamId,
                    pid,
                    pid === captainId ? 1 : 0,
                    pid === viceCaptainId ? 1 : 0,
                    0 // is_bench default
                ]);
                await connection.query('INSERT INTO fantasy_selections (fantasy_team_id, player_id, is_captain, is_vice_captain, is_bench) VALUES ?', [values]);
            }

            // 3. Update transfer count (logic to be refined later, assuming unlimited for initial squad or handled by controller)

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    getSquad: async (fantasyTeamId) => {
        const [rows] = await db.query(`
            SELECT s.*, p.fullname, p.position, p.price, p.player_image, t.flag as team_flag, t.team_name
            FROM fantasy_selections s
            JOIN players p ON s.player_id = p.player_id
            JOIN teams t ON p.team_id = t.team_id
            WHERE s.fantasy_team_id = ?
        `, [fantasyTeamId]);
        return rows;
    }
}

module.exports = FantasyTeams;
