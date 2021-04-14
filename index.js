const exp = require("express");
const mon = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = exp();

app.set("view engine", "ejs");
app.use(exp.urlencoded({extended: true}));
app.use(exp.static("resources"));

require("./resources/routes/routes.js")(app, mon, bcrypt);
require("./resources/routes/mongodb.js")(mon, bcrypt);