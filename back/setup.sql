-- make must be foo, bar, baaz, or quux
-- color must be red, blue, or green
-- manufacture_date must be date in format YYYY-MM-DD
CREATE TABLE widgets (
    id INTEGER PRIMARY KEY,
    make TEXT,
    color TEXT,
    manufacture_date DATE,
    notes TEXT
);

-- dummy data
INSERT INTO widgets(make, color, manufacture_date) VALUES('foo', 'red', date('2000-01-01'));
INSERT INTO widgets(make, color, manufacture_date, notes) VALUES('foo', 'blue', date('now'), 'This one is great');
INSERT INTO widgets(make, color, manufacture_date) VALUES('quux', 'blue', date('2000-01-09'));
INSERT INTO widgets(make, color, manufacture_date, notes) VALUES('baaz', 'red', date('2001-02-24'), 'I don''t like this one');
INSERT INTO widgets(make, color, manufacture_date) VALUES('foo', 'blue', date('2010-02-03'));
INSERT INTO widgets(make, color, manufacture_date) VALUES('bar', 'green', date('2000-12-31'));
