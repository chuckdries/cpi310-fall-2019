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
CREATE TABLE authTokens
(
  token STRING PRIMARY KEY,
  userId INTEGER,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Down
DROP TABLE users;
DROP TABLE messages;
DROP TABLE authTokens;
