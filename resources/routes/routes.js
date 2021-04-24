module.exports = (app, mon, bcrypt, cookies) => { 
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
    require("./cookies.js")(bcrypt, cookies);
    require("./get-routes.js")(app);
    require("./post-routes")
    require("./delete-routes")
    require("./put-routes")
};