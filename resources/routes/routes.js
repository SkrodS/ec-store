module.exports = (app, mon, bcrypt) => { 
    app.listen(process.env.PORT, (err) => {
        if (!err) {
            console.log("Connected");
        }
        else {
            console.log(err);
        };
    });

    require("./delete-routes.js");
    require("./get-routes.js")(app);
    require("./post-routes.js");
    require("./put-routes.js");
};