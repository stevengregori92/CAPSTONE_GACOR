-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-06-01 00:25:47.921

-- tables
-- Table: scan

USE skinwise;


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
    U_foto varchar(255) NOT NULL,
    U_role varchar(255)  NOT NULL,
    U_subscriber boolean  NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (U_ID)
);

CREATE TABLE hospital(
    H_ID int  NOT NULL,
    H_nama varchar(255)  NOT NULL,
    H_provinsi varchar(255)  NOT NULL,
    H_kota varchar(255)  NOT NULL,
    H_alamat varchar(255)  NOT NULL,
    H_dermatologist_avail boolean  NOT NULL,
    H_dermatologist varchar(255),
    H_informasi varchar(255),
    H_url_lokasi varchar(255)  NOT NULL,
    H_url_gambar varchar(255)  NOT NULL,
    H_kontak varchar(255)  NOT NULL,
    H_rating Float(2,1)  NOT NULL,
    CONSTRAINT hospital_pk PRIMARY KEY (H_ID)
);

-- foreign keys
-- Reference: scan_user (table: scan)
ALTER TABLE scan ADD CONSTRAINT scan_user FOREIGN KEY scan_user (user_U_ID)
    REFERENCES user (U_ID);

-- End of file.

