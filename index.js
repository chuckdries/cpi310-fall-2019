// github.com/chuckdries/cpi310-fall-2019
const express = require("express");
const exphbs = require("express-handlebars");
const sqlite = require("sqlite");
const app = express();

const dbPromise = sqlite.open("./data.sqlite");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded());

app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all("SELECT * FROM messages");
  console.log(messages);
  res.render("index", { messages: messages });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  await db.run("INSERT INTO messages (message) VALUES (?)", req.body.message);
  res.redirect("/");
});

const setup = async () => {
  const db = await dbPromise;
  await db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY,
      message STRING
    );`);
  app.listen(3000, () => console.log("listening on http://localhost:3000"));
};

setup();
