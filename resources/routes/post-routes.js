module.exports = (app, bcrypt) => {

    //POST FOR ADDING ITEMS TO SHOPPING BAG
    //Om man lyckas leta efter en produkt i databasen utan errors så läggs den produkten till i bagItems-cookie:n.
    app.post("/product/:id/add-item", (req, res) => {
        Product.findOne({"_id": req.params.id}, [], async (err, product) => {
            if (product) {
                if (req.cookies.bagItems) { //Om cookien "bagItems" redan existerar.
                    let bagItems = [req.cookies.bagItems]; //Lägger till redan existerande kundvagnsföremål till en lista.
                    bagItems.push({ name: product.name, //Lägger till den nya produkten i listan.
                                    size: req.body.size,
                                    quantity: parseInt(req.body.quantity),
                                    price: parseInt(req.body.price),
                                    image: req.body.image });
                    
                    bagItems = bagItems.reduce((acc, val) => acc.concat(val), []); //"Plattar" till listan, så att det inte kan finns en lista i listan.

                    if (Array.isArray(bagItems)) {
                        bagItems = Array.from(bagItems.reduce((acc, { quantity, ...r }) => { //Raderar dubbletter (föremål som har samma storlek och namn) av föremål och summerar deras quantity.
                            const key = JSON.stringify(r);
                            const current = acc.get(key) || { ...r, quantity: 0 };
                            return acc.set(key, { ...current, quantity: current.quantity + quantity });
                        }, new Map).values());
                    };
                    
                    await res.cookie("bagItems", bagItems, { maxAge: 10800000 }); //Skapar cookien
                }
                else { //Om cookien "bagItems" inte redan existerar.
                    await res.cookie("bagItems", { "name": product.name,  //Skapar cookien
                                                    "size": req.body.size,
                                                    "quantity": parseInt(req.body.quantity),
                                                    "price": parseInt(req.body.price),
                                                    "image": req.body.image }, 
                                                    { maxAge: 10800000 });
                };
                res.redirect("/shopping-bag");
            }
            else {
                res.send("Something went wrong...");;
            };
        });
    });

    //UPDATE BAG ROUTE
    //Raderar ett föremål ur kundvagnen.
    app.post("/update-bag", async (req, res) => {
        let bag = req.cookies.bagItems;
        let deleted = JSON.parse(req.body.deleted) //Föremålet som ska tas bort.

        if (Array.isArray(bag) && bag.length > 1) {
            bag.forEach((element, i) => { //Går igenom hela kundvagnen
                if (deleted.name == element.name && deleted.size == element.size) {
                    bag.splice(i, 1); //Tar bort föremålet med samma namn och storlek som deleted.
                };
            });

            if (!bag.length) { //Om kundvagnen är tom efter att föremålet har raderats
                await res.clearCookie("bagItems"); //Tar bort hela cookien.
            }
            else {
                await res.cookie("bagItems", bag, { maxAge: 10800000 }); //Uppdaterar cookien.
            };
        }
        else {
            await res.clearCookie("bagItems"); //Tar bort hela cookien.
        }
        res.redirect("/shopping-bag");
    });

    //CREATE ORDER ROUTE
    //Skapar en ny order i kollektionen "Orders".
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
        await res.cookie("orderComplete", true, { maxAge: 600000 }); //Skapar en orderComplete cookie så att /order-complete kan laddas.
        await res.clearCookie("bagItems"); //Tömmer kundvagnen.
        res.redirect("/order-complete");
    });

    //SIGN IN ROUTE
    //Om det angivna användarnamnet och lösenordet stämmer överens med en adminanvändare så får man en giltig cookie, ett sessionId
    //och man skickas till /admin.
    app.post("/post/sign-in", (req, res) => {
        Admin.findOne({ "username": req.body.username }, async (err, user) => {
            if (err) {
                res.send("Something went wrong...");;
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
                    res.redirect("/sign-in?error=true"); //Om man inte lyckas logga in så skickas man till /sign-in med en query string.
                }
            }
            else {
                res.redirect("/sign-in?error=true");
            }
        })
    });

    //LOG OUT ROUTE
    //Tar bort sessionId från adminanvändaren i databasen och raderar admincookie:n.
    //Användaren skickas till /sign-in.
    app.post("/log-out", async (req, res) => {
        await Admin.findOneAndUpdate({ sessionId: req.cookies.admin }, { sessionId: null });
        res.clearCookie("admin");
        res.redirect("/sign-in");
    });

    //VALIDATE COOKIE FUNCTION
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

    //ARCHIVE ORDER ROUTE
    //Om man lyckas leta efter ordern vars ID finns lagrad i URL:n i databasen utan errors så raderas ordern från
    //kollektionen "Orders" och skapas på nytt i kollektionen "Archives".
    //Innan denna route körs så valideras cookies.
    app.post("/archive-order/:id", validateCookie, (req, res) => {
        Order.findOneAndDelete({ _id: req.params.id }, async (err, order) => {
            if (err) {
                res.send("Something went wrong...");
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
        res.redirect("back"); //Skickar användaren tillbaka till förra routen.
    });

    //UN-ARCHIVE ORDER ROUTE
    //Om man lyckas leta efter ordern vars ID finns lagrad i URL:n i databasen utan errors så raderas ordern från
    //kollektionen "Archives" och skapas på nytt i kollektionen "Orders".
    //Innan denna route körs så valideras cookies.
    app.post("/un-archive-order/:id", validateCookie, (req, res) => {
        Archive.findOneAndDelete({ _id: req.params.id }, async (err, order) => {
            if (err) {
                res.send("Something went wrong...");;
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
        res.redirect("back"); //Skickar användaren tillbaka till förra routen.
    });

    //CREATE PRODUCT ROUTE
    //Skapar en ny produkt.
    //Innan denna route körs så valideras cookies.
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