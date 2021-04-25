const exp = require("express");
const mon = require("mongoose");
const bcrypt = require("bcrypt");
const app = exp();
const cookie = require("cookie-parser");
const mo = require("method-override");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(exp.urlencoded({extended: true}));
app.use(exp.static("resources"));
app.use(cookie());

require("./resources/routes/routes.js")(app, mon, bcrypt, cookie);