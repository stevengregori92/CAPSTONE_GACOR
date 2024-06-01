-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-06-01 00:25:47.921

-- tables
-- Table: scan
CREATE TABLE scan (
    S_ID varchar(50)  NOT NULL,
    S_link varchar(255)  NOT NULL,
    S_diagnosis varchar(255)  NOT NULL,
    S_referensi varchar(255)  NOT NULL,
    S_deskripsi longtext  NOT NULL,
    S_waktu timestamp  NOT NULL,
    user_U_ID varchar(50)  NOT NULL,
    CONSTRAINT scan_pk PRIMARY KEY (S_ID)
);

-- Table: user
CREATE TABLE user (
    U_ID varchar(50)  NOT NULL,
    U_email varchar(255)  NOT NULL,
    U_password varchar(255)  NOT NULL,
    U_nama varchar(255)  NOT NULL,
    U_role varchar(255)  NOT NULL,
    U_subscriber boolean  NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (U_ID)
);

-- foreign keys
-- Reference: scan_user (table: scan)
ALTER TABLE scan ADD CONSTRAINT scan_user FOREIGN KEY scan_user (user_U_ID)
    REFERENCES user (U_ID);

-- End of file.

