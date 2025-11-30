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
