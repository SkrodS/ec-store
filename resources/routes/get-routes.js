const cookieParser = require("cookie-parser");

module.exports = (app, bcrypt) => {

    //START PAGE
    app.get("/", (req, res) => {
        Product.find({ popular: true }, [], (err, popular) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("start", { popular: popular });
            };
        });
    });

    //ALL PRODUCTS PAGE
    app.get("/all-products", (req, res) => {
        Product.find({}, [], (err, product) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("all-products", { product: product });
            };
        });
    });

    //HOODIES PAGE
    app.get("/all-products/hoodies", (req, res) => {
        Product.find({ "name": { $regex: ".*Hoodie.*" } }, [], (err, product) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("hoodies", { product: product })
            }
        });
    });

    //T-SHIRTS PAGE
    app.get("/all-products/t-shirts", (req, res) => {
        Product.find({ "name": { $regex: ".*T-shirt.*" } }, [], (err, product) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("t-shirts", { product: product })
            }
        });
    });

    //PRODUCT PAGE
    app.get("/product/:id", (req, res) => {
        console.log(req.cookies.bagItems);
        console.log("done");
        Product.findById(req.params.id, (err, product) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("product", { product: product });
            };
        });
    });

    //BAG PAGE
    app.get("/shopping-bag", (req, res) => {
        res.render("shopping-bag", { bagItems: req.cookies.bagItems });
    });

    //ORDER COMPLETE PAGE
    app.get("/order-complete", (req, res) => {
        if (req.cookies.orderComplete) {
            res.render("order-complete");
        }
        else {
            res.redirect("/");
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
                    res.status(403).redirect("sign-in");
                };
            });
        }
        else {
            res.status(403).redirect("sign-in");
        };
    }
    
    //ADMIN PAGE
    app.get("/sign-in", (req, res) => {
        if (req.cookies.admin) {
            Admin.findOne({ sessionId: req.cookies.admin }, (err, admin) => {
                if (admin) {
                    if (req.cookies.admin == admin.sessionId) {
                        console.log("done");
                        res.redirect("/admin")
                    }
                    else {
                        res.render("sign-in", { error: req.query.error });
                    };
                }
                else {
                    res.render("sign-in", { error: req.query.error });
                };
            });
        }
        else {
            res.render("sign-in", { error: req.query.error });
        };
    });

    app.get("/admin", validateCookie, (req, res) => {
        res.render("admin");
    });
};
