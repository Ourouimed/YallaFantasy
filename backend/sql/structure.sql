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
    player_image varchar(500) ,
    price double(4,2) DEFAULT 0.0,
    total_pts int DEFAULT 0 ,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

