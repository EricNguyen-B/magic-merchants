CREATE TABLE auction_room (
    id TEXT PRIMARY KEY,
    seller_email TEXT,
    card_name TEXT,
    card_condition TEXT,
    date_start DATE,
    date_end DATE,
    min_bid_price INTEGER,
    min_bid_increments INTEGER,
    image_url TEXT,
    room_status TEXT NOT NULL DEFAULT 'inactive',
    FOREIGN KEY(seller_email) REFERENCES users(email),
    CONSTRAINT check_room_status CHECK (room_status IN ('inactive', 'active', 'complete'))
);
CREATE TABLE user_bid (
    id TEXT PRIMARY KEY,
    buyer_email TEXT,
    auction_id TEXT,
    price INTEGER,
    highest_price INTEGER,
    FOREIGN KEY(auction_id) REFERENCES auction_room(id)
    FOREIGN KEY(buyer_email) REFERENCES user(email)

);
CREATE TABLE chat_messages (
    message_id TEXT PRIMARY KEY,
    viewer_email TEXT,
    text_message TEXT,
    auction_id TEXT,
    FOREIGN KEY(auction_id) REFERENCES auction_room(id),
    FOREIGN KEY(viewer_email) REFERENCES users(email)
);
CREATE TABLE users (
    email TEXT PRIMARY KEY,
    username TEXT,
    password TEXT
);


-- Mock data for auction_room
INSERT INTO auction_room (id, seller_email, card_name, card_condition, date_start, date_end, min_bid_price, min_bid_increments, image_url)
VALUES
    ('1', 'test@gmail.com', 'Consulate Crackdown', 'Mint', '2024-03-01T00:00:00.000Z', '2024-03-10T00:00:00.000Z', 100, 5, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423678&type=card'), -- start: '2024-03-01' end: '2024-03-10'
    ('2', 'test@gmail.com', 'ArchAngel Avacyn', 'Excellent', '2024-03-05T00:00:00.000Z', '2024-03-15T00:00:00.000Z', 80, 4, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=409741&type=card'), -- start: '2024-03-05' end: '2024-03-15'
    ('3', 'test@gmail.com', 'Hikari Twilight', 'Good', '2024-03-08T00:00:00.000Z', '2024-03-18T00:00:00.000Z', 60, 3, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423678&type=card'), -- start: '2024-03-08' end: '2024-03-18'
    ('4', 'test@gmail.com', 'ArchAngel Avacyn', 'Fair', '2024-03-12T00:00:00.000Z', '2024-03-22T00:00:00.000Z', 40, 2, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=409741&type=card'), -- start: '2024-03-12' end: '2024-03-22'
    ('5', 'test@gmail.com', 'Consulate Crackdown', 'Fair', '2024-02-12T00:00:00.000Z', '2024-03-01T00:00:00.000Z', 40, 2, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423678&type=card'), -- start: '2024-02-12' end: '2024-03-01'
    ('6', 'test@gmail.com', 'Consulate Crackdown', 'Fair', '2024-02-12T00:00:00.000Z', '2024-03-01T00:00:00.000Z', 40, 2, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423678&type=card'),
    ('7', 'test@gmail.com', 'Hikari Twilight', 'Good', '2024-03-08T00:00:00.000Z', '2024-03-18T00:00:00.000Z', 60, 3, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=423678&type=card'), -- start: '2024-03-08' end: '2024-03-18'
    ('8', 'test@gmail.com', 'ArchAngel Avacyn', 'Excellent', '2024-03-05T00:00:00.000Z', '2024-03-15T00:00:00.000Z', 80, 4, 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=409741&type=card'); -- start: '2024-03-05' end: '2024-03-15
-- Mock data for users
INSERT INTO users (email, username, password) VALUES ('test@gmail.com', 'test', '$argon2id$v=19$m=65536,t=3,p=4$bUh1kmZxbTnh+qc9fQHfgQ$fjFXy9u5CVMcuhsgk1JT4jAkUYsmf2HNfsbdf7Ab6sk');
