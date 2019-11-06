// github.com/chuckdries/cpi310-fall-2019
const express = require("express");
const exphbs = require("express-handlebars");
const sqlite = require("sqlite");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const uuidv4 = require("uuid/v4");

const saltRounds = 10;
const app = express();

const dbPromise = sqlite.open("./data.sqlite");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/", async (req, res) => {
  const db = await dbPromise;
  console.log(req.cookies);
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

app.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { email, password } = req.body;
  // const email = req.body.email;
  // const password = req.body.password;
  const user = await db.get("SELECT * FROM users WHERE email=?", email);
  if (!user) {
    return res.render("login", { error: "user not found" });
  }
  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    return res.render("login", { error: "password is incorrect" });
  }
  const token = uuidv4();
  await db.run(
    "INSERT INTO authTokens (token, userId) VALUES (?, ?)",
    token,
    user.id
  );
  res.cookie("authToken", token);
  res.redirect("/");
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
