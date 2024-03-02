CREATE TABLE auction_room (
    id TEXT PRIMARY KEY,
    card_name TEXT,
    card_condition TEXT,
    date_start DATE,
    date_end DATE,
    min_bid_price INTEGER,
    min_bid_increments INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT 0
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
INSERT INTO auction_room (id) VALUES ('room5');
INSERT INTO auction_room (id) VALUES ('room6');
INSERT INTO auction_room (id) VALUES ('room7');
INSERT INTO auction_room (id) VALUES ('room8');
INSERT INTO auction_room (id) VALUES ('room9');
INSERT INTO auction_room (id) VALUES ('room10');
INSERT INTO auction_room (id) VALUES ('room11');
INSERT INTO auction_room (id) VALUES ('room12');