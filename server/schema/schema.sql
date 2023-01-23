SET serial_normalization = sql_sequence;

CREATE TABLE Users (
    id SERIAL4 NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(60) NOT NULL,
    is_chess_board BOOLEAN NOT NULL
);

CREATE TABLE Requests (
    id SERIAL4 NOT NULL PRIMARY KEY,
    sender_id INT4 NOT NULL,
    reciever_id INT4 NOT NULL,
    sender_is_white BOOLEAN NOT NULL,
    request_status VARCHAR(15) NOT NULL,
    game_id INT4
);

CREATE TABLE Games (
    id SERIAL4 NOT NULL PRIMARY KEY,
    game_state VARCHAR(10) NOT NULL,
    white_wins BOOLEAN NOT NULL,
    white_user_id INT4 NOT NULL,
    black_user_id INT4 NOT NULL,
    is_white_turn BOOLEAN NOT NULL, 
);

CREATE TABLE Pieces (
    id SERIAL4 NOT NULL PRIMARY KEY,
    piece_type VARCHAR(10) NOT NULL,
    is_white BOOLEAN NOT NULL,
    letter_coordinate CHAR(1) NOT NULL,
    number_coordinate INT4 NOT NULL,
    game_id INT4 NOT NULL
);

INSERT INTO Users (username, password_hash, is_chess_board) VALUES ('hello', 'hello', True);