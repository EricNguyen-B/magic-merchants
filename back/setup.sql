CREATE TABLE auction_room (
    id TEXT PRIMARY KEY
);

CREATE TABLE user_bid (
    id TEXT PRIMARY KEY,
    auction_id TEXT,
    price INTEGER,
    FOREIGN KEY(auction_id) REFERENCES auction_room(id)
);

-- Mock data for auction_room
INSERT INTO auction_room (id) VALUES ('room1');
INSERT INTO auction_room (id) VALUES ('room2');
INSERT INTO auction_room (id) VALUES ('room3');
INSERT INTO auction_room (id) VALUES ('room4');