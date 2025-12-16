-- User Strcture 
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    fullname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role varchar(10),
    email VARCHAR(100) UNIQUE NOT NULL,
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    email_verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- National Team Structure 
CREATE TABLE teams (
    team_id varchar(50) PRIMARY KEY,
    team_name varchar(50),
    group_num varchar(10), 
    flag varchar(100)
);


-- National Team Structure 
CREATE TABLE players (
    player_id varchar(50) PRIMARY KEY,
    fullname VARCHAR(50),
    team_id varchar(50), 
    position varchar(10),
    player_image varchar(500) ,
    price double(4,2) DEFAULT 0.0,
    total_pts int DEFAULT 0 ,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);


-- Rounds Structure
CREATE TABLE rounds (
    round_id varchar(10) PRIMARY KEY ,
    round_title varchar(50),
    round_deadline DATETIME null
)


-- match structure 
CREATE TABLE matches (
    match_id int PRIMARY KEY AUTO_INCREMENT ,
    home_team varchar(10) NOT NULL,
    away_team varchar(10) NOT NULL ,
    match_round varchar(10) NOT NULL ,
    match_time timestamp ,
    home_score int DEFAULT null ,
    away_score int DEFAULT null , 
    match_started TINYINT(1) NOT NULL DEFAULT 0,
    match_started_at DATETIME,
    match_status varchar(10) default NULL,
    FOREIGN KEY (home_team) REFERENCES teams(team_id) ,
    FOREIGN KEY (away_team) REFERENCES teams(team_id)
);



-- Linup structure
CREATE TABLE linup (
    match_id varchar(40) ,
    player_id varchar(50) ,   
    starting_linup TINYINT NOT NULL,
    round_pts int DEFAULT 0 ,
    red_card TINYINT NOT NULL DEFAULT 0 , 
    yallow_cards int default 0 , 
    goals int default 0 , 
    assists int default 0 , 
    pen_saves int default 0 , 
    pen_missed int default 0 ,
    min_played int default 0, 
    own_goals int default 0 ,
    clean_sheets TINYINT DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

create table settings (
    current_round varchar(10) ,
    yellow_card int default -1 , 
    red_card int default -3 ,
    pen_missed int default -2, 
    own_goal int default -2 , 
    goal_for_ATT int default 4 ,
    goal_for_MID int default 5 ,
    goal_for_DEF int default 6 , 
    goal_for_GK int default 8 , 
    clean_sheets_def_gk int default 4 ,
    clean_sheets_mid int default 1 ,
    pen_saves int default 5 , 
    conced_goal int default -1 ,
    FOREIGN key (current_round) REFERENCES rounds (round_id)
);



create table fantasy_team  (
	id_team CHAR(36) PRIMARY KEY,
    team_name varchar(20) NOT NULL UNIQUE,
    total_pts int default 0 ,
    triple_captain timestamp default null ,
    wildcard timestamp default null ,
    jocker timestamp default null , 
    availble_transfers int default 0,
    FOREIGN KEY (id_team) REFERENCES users(id)
);

CREATE TABLE fantasy_list (
    id_team CHAR(36),
    id_player VARCHAR(50),
    national_team VARCHAR(50),
    round_id VARCHAR(10),
    purchased_price DECIMAL(6,2) NOT NULL,
    scored_pts INT DEFAULT 0,
    FOREIGN KEY (id_team) REFERENCES fantasy_team(id_team),
    FOREIGN KEY (id_player) REFERENCES players(player_id),
    FOREIGN KEY (national_team) REFERENCES teams(team_id),
    FOREIGN KEY (round_id) REFERENCES rounds(round_id)
);
