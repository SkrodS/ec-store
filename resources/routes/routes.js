module.exports = (app, mon, bcrypt) => { 
    app.listen(process.env.PORT, (err) => {
        if (!err) {
            console.log("Connected");
        }
        else {
            console.log(err);
        };
    });

    //The routes are called via "./mongodb.js" because they get database models from that file.
    require("./mongodb.js")(mon, bcrypt);
    require("./get-routes.js")(app);
    require("./post-routes")(app, bcrypt);
    require("./delete-routes")(app);
    require("./put-routes")(app);
};