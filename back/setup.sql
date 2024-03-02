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
INSERT INTO auction_room (id, card_name, card_condition, date_start, date_end, min_bid_price, min_bid_increments, is_active)
VALUES
    ('1', 'Charizard', 'Mint', '2024-03-01', '2024-03-10', 100, 5, 1),
    ('2', 'Blastoise', 'Excellent', '2024-03-05', '2024-03-15', 80, 4, 1),
    ('3', 'Venusaur', 'Good', '2024-03-08', '2024-03-18', 60, 3, 1),
    ('4', 'Pikachu', 'Fair', '2024-03-12', '2024-03-22', 40, 2, 1);