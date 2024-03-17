CREATE TABLE auction_room (
    id TEXT PRIMARY KEY,
    card_name TEXT,
    card_condition TEXT,
    date_start DATE,
    date_end DATE,
    min_bid_price INTEGER,
    min_bid_increments INTEGER,
    room_status TEXT NOT NULL DEFAULT 'inactive',
    CONSTRAINT check_room_status CHECK (room_status IN ('inactive', 'active', 'complete'))
);

CREATE TABLE user_bid (
    id TEXT PRIMARY KEY,
    auction_id TEXT,
    price INTEGER,
    FOREIGN KEY(auction_id) REFERENCES auction_room(id)
);
CREATE TABLE chat_messages (
    message_id TEXT PRIMARY KEY,
    text_message TEXT,
    auction_id TEXT,
    FOREIGN KEY(auction_id) REFERENCES auction_room(id)
);

CREATE TABLE users (
    email TEXT PRIMARY KEY,
    username TEXT,
    password TEXT
);

-- Mock data for auction_room
INSERT INTO auction_room (id, card_name, card_condition, date_start, date_end, min_bid_price, min_bid_increments)
VALUES
    ('1', 'Charizard', 'Mint', '2024-03-01T00:00:00.000Z', '2024-03-10T00:00:00.000Z', 100, 5), -- start: '2024-03-01' end: '2024-03-10'
    ('2', 'Blastoise', 'Excellent', '2024-03-05T00:00:00.000Z', '2024-03-15T00:00:00.000Z', 80, 4), -- start: '2024-03-05' end: '2024-03-15'
    ('3', 'Venusaur', 'Good', '2024-03-08T00:00:00.000Z', '2024-03-18T00:00:00.000Z', 60, 3), -- start: '2024-03-08' end: '2024-03-18'
    ('4', 'Pikachu', 'Fair', '2024-03-12T00:00:00.000Z', '2024-03-22T00:00:00.000Z', 40, 2), -- start: '2024-03-12' end: '2024-03-22'
    ('5', 'Pikachu', 'Fair', '2024-02-12T00:00:00.000Z', '2024-03-01T00:00:00.000Z', 40, 2); -- start: '2024-02-12' end: '2024-03-01'
-- Mock data for users
INSERT INTO users (email, username, password) VALUES ('test@gmail.com', 'test', '$argon2id$v=19$m=65536,t=3,p=4$bUh1kmZxbTnh+qc9fQHfgQ$fjFXy9u5CVMcuhsgk1JT4jAkUYsmf2HNfsbdf7Ab6sk');