const cookieParser = require("cookie-parser");

module.exports = (app) => {
    
    //Kollar om giltig cookie finns lagrad i webbläsaren. Om inte så skickas man till inloggningssidan.
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

    //START PAGE
    //Om man lyckas leta efter produkter i databasen utan errors så renderas "start.ejs" med populära produkter.
    app.get("/", (req, res) => {
        Product.find({ popular: true }, [], (err, popular) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                res.render("start", { popular: popular });
            };
        });
    });

    //ALL PRODUCTS PAGE
    //Om man lyckas leta efter produkter i databasen utan errors så renderas "all-products.ejs" med alla produkter som finns i kollektion "Products".
    app.get("/all-products", (req, res) => {
        Product.find({}, [], (err, product) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                res.render("all-products", { product: product });
            };
        });
    });

    //HOODIES PAGE
    //Om man lyckas leta efter produkter i databasen utan errors så renderas "hoodies.ejs" med alla produkter som heter något med "Hoodie".
    app.get("/all-products/hoodies", (req, res) => {
        Product.find({ "name": { $regex: ".*Hoodie.*" } }, [], (err, product) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                res.render("hoodies", { product: product })
            }
        });
    });

    //T-SHIRTS PAGE
    //Om man lyckas leta efter produkter i databasen utan errors så renderas "t-shirts.ejs" med alla produkter som heter något med "T-shirt".
    app.get("/all-products/t-shirts", (req, res) => {
        Product.find({ "name": { $regex: ".*T-shirt.*" } }, [], (err, product) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                res.render("t-shirts", { product: product })
            }
        });
    });

    //PRODUCT PAGE
    //Om man lyckas leta efter produkter i databasen utan errors så renderas "product.ejs" med den specifika produkten vars ID finns i URL:en.
    app.get("/product/:id", (req, res) => {
        Product.findById(req.params.id, (err, product) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                res.render("product", { product: product });
            };
        });
    });

    //BAG PAGE
    //Laddar "shopping-bag.ejs" med cookien som innehåller kundvagnens föremål.
    app.get("/shopping-bag", (req, res) => {
        res.render("shopping-bag", { bagItems: req.cookies.bagItems });
    });

    //ORDER COMPLETE PAGE
    //Om cookien "orderComplete" finns så renderas "order-complete.ejs" annars skickas man till startsidan.
    app.get("/order-complete", (req, res) => {
        if (req.cookies.orderComplete) {
            res.render("order-complete");
        }
        else {
            res.redirect("/");
        };
    });

    
    //SIGN IN PAGE
    //Om inte admin-cookie:n finns och är giltig så renderas "sign-in.ejs" med en potentiella errors som lagras i URL:en.
    //Om admin-cookie:n finns och är giltig så skickas man direkt till adminsidan.
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
    //Om man lyckas leta efter produkter och orders i databasen utan errors så renderas "admin.ejs" med alla produkter och orders som finns i
    //kollektionerna "Products" och "Orders".
    //Innan denna route körs så valideras cookies.
    app.get("/admin", validateCookie, (req, res) => {
        Product.find((err, products) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                Order.find((err, orders) => {
                    if (err) {
                        res.send("Something went wrong...");;
                    }
                    else {
                        res.render("admin", { products: products, orders: orders });
                    };
                });
            };
        });
    });

    //ADMIN PRODUCTS PAGE
    //Om man lyckas leta efter produkter i databasen utan errors så renderas "admin-products.ejs" med alla produkter som finns i
    //kollektionen "Products".
    //Innan denna route körs så valideras cookies.
    app.get("/admin-products", validateCookie, (req, res) => {
        Product.find((err, products) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                res.render("admin-products", { products: products });
            };
        });
    });

    //ADMIN ORDERS PAGE
    //Om man lyckas leta efter orders i databasen utan erros så renderas "admin-orders.ejs" med alla orders som finns i
    //kollektionerna "Orders" och "Archives".
    //Innan denna route körs så valideras cookies.
    app.get("/admin-orders", validateCookie, (req, res) => {
        Order.find((err, orders) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                Archive.find((err, archive) => {
                    if (err) {
                        res.send("Something went wrong...");;
                    }
                    else {
                        res.render("admin-orders", { orders: orders, archive: archive });
                    }
                });
            };
        });
    });

    //UPDATE PRODUCT PAGE
    //Om man lyckas leta efter produkter i databasen så renderas "update-product.ejs" med produkten vars ID finns lagrad i URL:n.
    //Innan denna route körs så valideras cookies.
    app.get("/update-product/:id", validateCookie, (req, res) => {
        Product.findOne({ _id: req.params.id }, async (err, product) => {
            if (err) {
                res.send("Something went wrong...");;
            }
            else {
                await res.render("update-product", { product: product });
            }
        });
    });

    //CREATE NEW PRODUCT PAGE
    //Renderar "create-product.ejs".
    //Innan denna route körs så valideras cookies.
    app.get("/create-product/", validateCookie, (req, res) => {
        res.render("create-product");
    });
};
