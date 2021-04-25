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
    require("./cookies.js")(cookie);
    require("./get-routes.js")(app);
    require("./post-routes")(app, cookie, bcrypt);
    require("./delete-routes")
    require("./put-routes")
};