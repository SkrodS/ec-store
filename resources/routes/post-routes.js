module.exports = (app, cookie, bcrypt) => {

    //POST FOR ADDING ITEMS TO SHOPPING bag
    app.post("/product/:id/add-item", (req, res) => {
        Product.findOne({"_id": req.params.id}, [], async (err, product) => {
            if (product) {
                if (req.cookies.bagItems) {
                    let bagItems = [req.cookies.bagItems];
                    bagItems.push({ name: product.name,
                                    size: req.body.size,
                                    quantity: parseInt(req.body.quantity),
                                    price: parseInt(req.body.price),
                                    image: req.body.image });
                    
                    bagItems = bagItems.reduce((acc, val) => acc.concat(val), []);

                    if (Array.isArray(bagItems)) {
                        bagItems = Array.from(bagItems.reduce((acc, { quantity, ...r }) => {
                            const key = JSON.stringify(r);
                            const current = acc.get(key) || { ...r, quantity: 0 };
                            return acc.set(key, { ...current, quantity: current.quantity + quantity });
                        }, new Map).values());
                    };
                    
                    await res.cookie("bagItems", bagItems, { maxAge: 10800000 });
                }
                else {
                    await res.cookie("bagItems", { "name": product.name, 
                                                    "size": req.body.size,
                                                    "quantity": parseInt(req.body.quantity),
                                                    "price": parseInt(req.body.price),
                                                    "image": req.body.image }, 
                                                    { maxAge: 10800000 });
                };
                res.redirect("/shopping-bag");
            }
            else {
                res.send(err);
            };
        });
    });

    //UPDATE BAG ROUTE
    app.post("/update-bag", async (req, res) => {
        let bag = req.cookies.bagItems;
        let deleted = JSON.parse(req.body.deleted)

        if (Array.isArray(bag) && bag.length > 1) {
            bag.forEach((element, i) => {
                if (deleted.name == element.name && deleted.size == element.size) {
                    bag.splice(i, 1);
                };
            });

            if (!bag.length) {
                await res.clearCookie("bagItems");
            }
            else {
                await res.cookie("bagItems", bag, { maxAge: 10800000 });
            };
        }
        else {
            await res.clearCookie("bagItems");
        }
        res.redirect("/shopping-bag");
    });

    //CREATE ORDER ROUTE
    app.post("/create-order", async (req, res) => {
        await Order.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            zipCode: req.body.zip,
            bagItems: JSON.parse(req.body.bagItems),
            date: Date.now(),
        })
        await res.cookie("orderComplete", true, { maxAge: 600000 });
        await res.clearCookie("bagItems");
        res.redirect("/order-complete");
    });

    //SIGN IN ROUTE
    app.post("/post/sign-in", (req, res) => {
        Admin.findOne({ "username": req.body.username }, async (err, user) => {
            if (err) {
                console.log(err);
                return
            }
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const sessionId = bcrypt.hashSync((Math.random(Date.prototype.getMilliseconds).toString()), 10);
                    await res.cookie("admin", sessionId, { maxAge: 10800000 });
                    await Admin.findOneAndUpdate({ "username": user.username }, { "sessionId": sessionId});
                    res.redirect("/admin");
                }
                else {
                    res.redirect("/sign-in?error=true");
                }
            }
            else {
                res.redirect("/sign-in?error=true");
            }
        })
    });

    //LOG OUT ROUTE
    app.post("/log-out", async (req, res) => {
        await Admin.findOneAndUpdate({ sessionId: req.cookies.admin }, { sessionId: null });
        res.clearCookie("admin");
        res.redirect("/sign-in");
    });

    //VALIDATE COOKIE FUNCTION
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

    //ARCHIVE ORDER ROUTE
    app.post("/archive-order/:id", validateCookie, (req, res) => {
        Order.findOneAndDelete({ _id: req.params.id }, async (err, order) => {
            if (err) {
                res.send(err);
            }
            else {
                await Archive.create({
                    bagItems: order.bagItems,
                    firstname: order.firstname,
                    lastname: order.lastname,
                    email: order.email,
                    address: order.address,
                    country: order.country,
                    city: order.city,
                    zipCode: order.zipCode,
                    date: order.date,
                });
            };
        });
        res.redirect("back");
    });

    //UN-ARCHIVE ORDER ROUTE
    app.post("/un-archive-order/:id", validateCookie, (req, res) => {
        Archive.findOneAndDelete({ _id: req.params.id }, async (err, order) => {
            if (err) {
                res.send(err);
            }
            else {
                await Order.create({
                    bagItems: order.bagItems,
                    firstname: order.firstname,
                    lastname: order.lastname,
                    email: order.email,
                    address: order.address,
                    country: order.country,
                    city: order.city,
                    zipCode: order.zipCode,
                    date: order.date,
                });
            };
        });
        res.redirect("back");
    });

    //CREATE PRODUCT ROUTE
    app.post("/create-product", validateCookie, async (req, res) => {
        let checked;
        
        if (req.body.popular == "on") {
            checked = true;
        }
        else if (!req.body.popular) {
            checked = false;
        };

        await Product.create({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            popular: checked,
            price: req.body.price,
        }); 
        res.redirect("/admin-products");
    })
};