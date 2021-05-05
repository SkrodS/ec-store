module.exports = (app, mon, bcrypt, cookie) => { 
    app.listen(process.env.PORT, (err) => {
        if (!err) {
            console.log("Connected");
        }
        else {
            console.log(err);
        };
    });

    //The routes are called via "./mongodb.js" because they get database models from that file.
    require("./mongodb.js")(app, mon, bcrypt);
    require("./get-routes.js")(app, bcrypt);
    require("./post-routes")(app, cookie, bcrypt);
    require("./delete-routes")(app, cookie);
    require("./put-routes")(app, cookie);
};