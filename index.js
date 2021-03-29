const exp = require("express");
const mon = require("mongoose");
require("dotenv").config();
const app = exp();

app.set("view engine", "ejs");
app.use(exp.urlencoded({extended: true}));
app.use(exp.static("resources"));

require("./resources/routes/routes.js")(app, mon);
require("./resources/routes/mongodb.js")(mon);