CREATE TABLE auction_room (
    id TEXT PRIMARY KEY
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