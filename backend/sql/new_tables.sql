
-- Settings Structure
CREATE TABLE settings (
    id INT PRIMARY KEY DEFAULT 1,
    current_round_id varchar(10),
    goal_points INT DEFAULT 0,
    assist_points INT DEFAULT 0,
    clean_sheet_points INT DEFAULT 0,
    FOREIGN KEY (current_round_id) REFERENCES rounds(round_id)
);

-- Fantasy Team Structure
CREATE TABLE fantasy_teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(50) NOT NULL,
    budget DECIMAL(10, 2) DEFAULT 100.00,
    transfers_left INT DEFAULT 2,
    total_points INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Fantasy Selections Structure
CREATE TABLE fantasy_selections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fantasy_team_id INT NOT NULL,
    player_id varchar(50) NOT NULL,
    is_captain TINYINT(1) DEFAULT 0,
    is_vice_captain TINYINT(1) DEFAULT 0,
    is_bench TINYINT(1) DEFAULT 0,
    FOREIGN KEY (fantasy_team_id) REFERENCES fantasy_teams(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);
