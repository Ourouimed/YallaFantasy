const db = require('../config/db')

const Settings = {
    getSettings: async () => {
        const [rows] = await db.query('SELECT * FROM settings WHERE id = 1');
        return rows[0];
    },
    updateSettings: async (current_round_id, goal_points, assist_points, clean_sheet_points) => {
        // Upsert logic: simple way is to check if exists or just always update if we assume seed data
        // For robustness, let's try update, if 0 rows affected (and we want to support empty table start), insert. 
        // But usually settings has 1 row. Let's assume it exists or we insert if empty.

        const [rows] = await db.query('SELECT * FROM settings WHERE id = 1');
        if (rows.length === 0) {
            await db.query('INSERT INTO settings (id, current_round_id, goal_points, assist_points, clean_sheet_points) VALUES (1, ?, ?, ?, ?)',
                [current_round_id, goal_points, assist_points, clean_sheet_points]);
        } else {
            await db.query('UPDATE settings SET current_round_id = ?, goal_points = ?, assist_points = ?, clean_sheet_points = ? WHERE id = 1',
                [current_round_id, goal_points, assist_points, clean_sheet_points]);
        }
        return { id: 1, current_round_id, goal_points, assist_points, clean_sheet_points };
    },
    // Initialize defaults if needed
    initSettings: async () => {
        const [rows] = await db.query('SELECT * FROM settings WHERE id = 1');
        if (rows.length === 0) {
            await db.query('INSERT INTO settings (id, current_round_id, goal_points, assist_points, clean_sheet_points) VALUES (1, NULL, 5, 3, 4)');
        }
    }
}

module.exports = Settings;
