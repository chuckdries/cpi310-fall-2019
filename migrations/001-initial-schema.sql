-- Up
CREATE TABLE users
(
  id INTEGER PRIMARY KEY,
  email STRING,
  name STRING,
  password STRING
);
CREATE TABLE messages
(
  id INTEGER PRIMARY KEY,
  message STRING
);

-- Down
DROP TABLE users;
DROP TABLE messages;
