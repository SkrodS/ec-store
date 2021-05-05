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
                res.send(err);
            }
            else {
                res.render("t-shirts", { product: product })
            }
        });
    });

    //PRODUCT PAGE
    app.get("/product/:id", (req, res) => {
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
    
    //SIGN IN PAGE
    app.get("/sign-in", (req, res) => {
        if (req.cookies.admin) {
            Admin.findOne({ sessionId: req.cookies.admin }, (err, admin) => {
                if (admin) {
                    if (req.cookies.admin == admin.sessionId) {
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

    //ADMIN-PANEL PAGE
    app.get("/admin", validateCookie, (req, res) => {
        Product.find((err, products) => {
            if (err) {
                res.send(err);
            }
            else {
                Order.find((err, orders) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.render("admin", { products: products, orders: orders });
                    };
                });
            };
        });
    });

    //ADMIN PRODUCTS PAGE
    app.get("/admin-products", validateCookie, (req, res) => {
        Product.find((err, products) => {
            if (err) {
                res.send(err);
            }
            else {
                res.render("admin-products", { products: products });
            };
        });
    });

    //ADMIN ORDERS PAGE
    app.get("/admin-orders", validateCookie, (req, res) => {
        Order.find((err, orders) => {
            if (err) {
                res.send(err);
            }
            else {
                Archive.find((err, archive) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.render("admin-orders", { orders: orders, archive: archive });
                    }
                });
            };
        });
    });

    //UPDATE PRODUCT PAGE
    app.get("/update-product/:id", validateCookie, (req, res) => {
        Product.findOne({ _id: req.params.id }, async (err, product) => {
            if (err) {
                res.send(err);
            }
            else {
                await res.render("update-product", { product: product });
            }
        });
    });

    //CREATE NEW PRODUCT PAGE
    app.get("/create-product/", validateCookie, (req, res) => {
        res.render("create-product");
    });
};
