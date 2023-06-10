DROP database IF EXISTS drink_counter;

create database drink_counter;
USE drink_counter;

DROP TABLE IF EXISTS drinks;

CREATE TABLE users
(
	userid      int not null,
    PRIMARY KEY (userid) 
);

CREATE TABLE sessions
(
    sessionid int not null AUTO_INCREMENT,
    userid    int not null,
    starttime datetime,
    endtime datetime,
    PRIMARY KEY (sessionid),
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

CREATE TABLE drinks
(
	drinkid      int not null AUTO_INCREMENT, 
    sessionid    int not null,
    drink_time   datetime,
    PRIMARY KEY (drinkid), 
    FOREIGN KEY (sessionid) REFERENCES sessions(sessionid) ON DELETE CASCADE
);
ALTER TABLE drinks AUTO_INCREMENT = 1000;

-- INSERT INTO users (userid) 
-- VALUES (10005);

-- INSERT INTO sessions (userid, starttime, endtime) 
-- VALUES (10005, "2023-06-09 03:27:35.168", "2023-06-09 03:27:36.168");


-- INSERT INTO drinks (drinkid, sessionid, drink_time) 
-- VALUES (10005, LAST_INSERT_ID(), "2023-06-09 03:27:35.168");

