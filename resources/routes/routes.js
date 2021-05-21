module.exports = (app, mon, bcrypt) => { 
    app.listen(process.env.PORT, (err) => {
        if (!err) {
            console.log("Connected");
        }
        else {
            console.log(err);
        };
    });

    require("./mongodb.js")(mon, bcrypt);
    require("./get-routes.js")(app);
    require("./post-routes")(app, bcrypt);
    require("./delete-routes")(app);
    require("./put-routes")(app);
};