DROP TABLE IF EXISTS customer;
CREATE TABLE customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(300),
    password VARCHAR(200),
    name VARCHAR(200),
    sex VARCHAR(100),
    email VARCHAR(200),
    address VARCHAR(500)
);

DROP TABLE IF EXISTS administrator;
CREATE TABLE administrator (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(300),
    password VARCHAR(200),
    name VARCHAR(200),
    sex VARCHAR(30),
    email VARCHAR(200),
    address VARCHAR(500)
);

DROP TABLE IF EXISTS pet_category;
CREATE TABLE pet_category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(300),
    description VARCHAR(500),
    create_at NUMERIC DEFAULT (DATETIME('now','localtime'))
);

DROP TABLE IF EXISTS pet;
CREATE TABLE pet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER,
    pet_category_id INTEGER,
    name VARCHAR(300),
    sex VARCHAR(30),
    weight REAL,
    date_of_birth DATE,
    husbandry_info VARCHAR(500),
    create_at NUMERIC DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY(owner_id) REFERENCES customer(id),
    FOREIGN KEY(pet_category_id) REFERENCES pet_category(id)
);

DROP TABLE IF EXISTS pet_album;
CREATE TABLE pet_album (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    name VARCHAR(300),
    description VARCHAR(500),
    cover_url VARCHAR(500) DEFAULT '/images/default_pet_album_cover.png',
    create_at NUMERIC DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY(pet_id) REFERENCES pet(id)
);

DROP TABLE IF EXISTS pet_image;
CREATE TABLE pet_image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_album_id INTEGER,
    name VARCHAR(300),
    description VARCHAR(500),
    url VARCHAR(500),
    create_at NUMERIC DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY(pet_album_id) REFERENCES pet_album(id)
);

DROP TABLE IF EXISTS pet_parasite_prevention_product;
CREATE TABLE pet_parasite_prevention_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(300),
    description text,
    create_at NUMERIC DEFAULT (DATETIME('now','localtime'))
); 

DROP TABLE IF EXISTS medication_type;
CREATE TABLE medication_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(300),
    description text,
    create_at NUMERIC DEFAULT (DATETIME('now','localtime'))
); 

DROP TABLE IF EXISTS veterinary;
CREATE TABLE veterinary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(300),
    password VARCHAR(200),
    introduction VARCHAR(500),
    photo VARCHAR(500) DEFAULT '/images/default_veterinary.png',
    create_at NUMERIC DEFAULT (DATETIME('now','localtime'))
);

DROP TABLE IF EXISTS pet_medical_history;
CREATE TABLE pet_medical_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER,
    pet_id INTEGER,
    recorder_id INTEGER,
    parasite_prevention_product_id INTEGER,
    check_up VARCHAR(500),
    medication_date DATE,
    create_at NUMERIC DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY(appointment_id) REFERENCES t_appointment(id),
    FOREIGN KEY(recorder_id) REFERENCES veterinary(id),
    FOREIGN KEY(pet_id) REFERENCES pet(id),
    FOREIGN KEY(parasite_prevention_product_id) REFERENCES pet_parasite_prevention_product(id)
);

DROP TABLE IF EXISTS pet_medication;
CREATE TABLE pet_medication (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER,
    pet_id INTEGER,
    recorder_id INTEGER,
    medication_type_id INTEGER,
    medication_duration VARCHAR(500),
    medication_date DATE,
    create_at NUMERIC DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY(appointment_id) REFERENCES t_appointment(id),
    FOREIGN KEY(recorder_id) REFERENCES veterinary(id),
    FOREIGN KEY(medication_type_id) REFERENCES medication_type(id),
    FOREIGN KEY(pet_id) REFERENCES pet(id)
);

DROP TABLE IF EXISTS symptom;
CREATE TABLE symptom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recorder_id INTEGER,
    name VARCHAR(300),
    duration VARCHAR(300),
    frequency VARCHAR(300),
    release_date NUMERIC DEFAULT (DATETIME('now','localtime')),
    create_at NUMERIC DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY(recorder_id) REFERENCES veterinary(id)
);

DROP TABLE IF EXISTS diagnosing;
CREATE TABLE diagnosing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recorder_id INTEGER,
    symptom_id INTEGER,
    name VARCHAR(500),
    result TEXT,
    solution TEXT,
    suggestion TEXT,
    create_at NUMERIC DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY(recorder_id) REFERENCES veterinary(id),
    FOREIGN KEY(symptom_id) REFERENCES symptom(id)
);

DROP TABLE IF EXISTS reminder;
CREATE TABLE reminder (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    reminder_id INTEGER,
    title VARCHAR(300),
    message VARCHAR(1000),
    status SMALLINT DEFAULT 0,
    reminder_datetime DATETIME,
    create_at NUMERIC DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(pet_id) REFERENCES pet(id),
    FOREIGN KEY(reminder_id) REFERENCES veterinary(id)
);

DROP TABLE IF EXISTS notification;
CREATE TABLE notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    reminder_id INTEGER,
    title VARCHAR(300),
    message VARCHAR(1000),
    status SMALLINT DEFAULT 0,
    reminder_datetime DATETIME,
    create_at NUMERIC DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(pet_id) REFERENCES pet(id),
    FOREIGN KEY(reminder_id) REFERENCES veterinary(id)
);

DROP TABLE IF EXISTS t_appointment;
CREATE TABLE t_appointment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    veterinary_id INTEGER,
    description VARCHAR(500),
    appointment_date VARCHAR(200),
    appointment_time_period VARCHAR(200),
    create_at NUMERIC DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (pet_id) REFERENCES pet (id),
    FOREIGN KEY (veterinary_id) REFERENCES veterinary (id)
);



