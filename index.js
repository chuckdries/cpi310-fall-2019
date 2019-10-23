// github.com/chuckdries/cpi310-fall-2019
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/message", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.listen(3000, () => console.log("listening on http://localhost:3000"));
