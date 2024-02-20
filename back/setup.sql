CREATE TABLE auction_room (
    id TEXT PRIMARY KEY
);
CREATE TABLE user_bid (
    id TEXT PRIMARY KEY,
    auction_id TEXT,
    price INTEGER,
    FOREIGN KEY(auction_id) REFERENCES auction_room(id)
);