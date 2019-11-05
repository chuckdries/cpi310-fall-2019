// github.com/chuckdries/cpi310-fall-2019
const express = require("express");
const exphbs = require("express-handlebars");
const sqlite = require("sqlite");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const app = express();

const dbPromise = sqlite.open("./data.sqlite");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded());

app.get("/", async (req, res) => {
  const db = await dbPromise;
  const users = await db.all("SELECT * FROM users");
  console.log(users);
  const messages = await db.all("SELECT * FROM messages");
  res.render("index", { messages: messages });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  await db.run("INSERT INTO messages (message) VALUES (?)", req.body.message);
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { name, email, password } = req.body;
  let error = null;
  if (!name) {
    error = "name field is required";
  }
  if (!email) {
    error = "email field is required";
  }
  if (!password) {
    error = "password field is required";
  }
  if (error) {
    return res.render("register", { error: error });
  }
  const existingUser = await db.get(
    "SELECT email FROM users WHERE email=?",
    email
  );
  if (existingUser) {
    return res.render("register", { error: "user already exists" });
  }
  const pwHash = await bcrypt.hash(password, saltRounds);
  await db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?);",
    name,
    email,
    pwHash
  );
  res.redirect("/");
});

const setup = async () => {
  const db = await dbPromise;
  db.migrate({ force: "last" });
  app.listen(3000, () => console.log("listening on http://localhost:3000"));
};

setup();
