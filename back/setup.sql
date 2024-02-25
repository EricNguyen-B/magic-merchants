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