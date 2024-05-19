-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-05-13 07:11:41.371

-- tables
-- Table: chat
USE bangkit_skin_app;

CREATE TABLE chat (
    C_ID int  NOT NULL AUTO_INCREMENT,
    scan_S_ID int  NOT NULL,
    CONSTRAINT chat_pk PRIMARY KEY (C_ID)
);

-- Table: pesan
CREATE TABLE pesan (
    P_ID int  NOT NULL AUTO_INCREMENT,
    P_isi longtext  NOT NULL,
    P_waktu timestamp  NOT NULL,
    chat_C_ID int  NOT NULL,
    user_U_ID int  NOT NULL,
    CONSTRAINT pesan_pk PRIMARY KEY (P_ID)
);

-- Table: scan
CREATE TABLE scan (
    S_ID int  NOT NULL AUTO_INCREMENT,
    S_link varchar(255)  NOT NULL,
    S_diagnosis TEXT  NOT NULL,
    S_waktu timestamp  NOT NULL,
    user_U_ID int  NOT NULL,
    CONSTRAINT scan_pk PRIMARY KEY (S_ID)
);

-- Table: user
CREATE TABLE user (
    U_ID int  NOT NULL AUTO_INCREMENT,
    U_email varchar(255)  NOT NULL,
    U_password varchar(255)  NOT NULL,
    U_nama varchar(255)  NOT NULL,
    U_role varchar(255)  NOT NULL,
    U_subscriber boolean  NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (U_ID)
);

-- Table: user_chat
CREATE TABLE user_chat (
    user_U_ID int  NOT NULL,
    chat_C_ID int  NOT NULL,
    CONSTRAINT user_chat_pk PRIMARY KEY (user_U_ID,chat_C_ID)
);

-- End of file.

