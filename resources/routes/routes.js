module.exports = (app, mon, bcrypt, cookie) => { 
    app.listen(process.env.PORT, (err) => {
        if (!err) {
            console.log("Connected");
        }
        else {
            console.log(err);
        };
    });

    function validateCookie(req, res, next) {

        if (req.cookies.admin) {
            Admin.findOne({ sessionId: req.cookies.admin }, (err, admin) => {
                if (admin) {
                    if (req.cookies.admin == admin.sessionId) {
                        next()
                    }
                    else {
                        res.status(403).redirect("/sign-in");
                    };
                }
                else {
                    res.status(403).redirect("/sign-in");
                };
            });
        }
        else {
            res.status(403).redirect("/sign-in");
        };
    };

    //The routes are called via "./mongodb.js" because they get database models from that file.
    require("./mongodb.js")(mon);
    require("./get-routes.js")(app);
    require("./post-routes")(app, bcrypt);
    require("./delete-routes")(app);
    require("./put-routes")(app);
};