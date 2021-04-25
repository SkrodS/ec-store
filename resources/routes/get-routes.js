module.exports = (app) => {

    //START PAGE
    app.get("/", (req, res) => {
        Product.find({popular: true},[], (err, popular) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("start", {popular:popular});
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
                res.render("all-products", {product:product});
            };
        });
    });

    //HOODIES PAGE
    app.get("/all-products/hoodies", (req, res) => {
        Product.find({"name" : {$regex : ".*Hoodie.*"}}, [], (err, product) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("hoodies", {product:product})
            }
        });
    });

    //T-SHIRTS PAGE
    app.get("/all-products/t-shirts", (req, res) => {
        Product.find({"name" : {$regex : ".*T-shirt.*"}}, [], (err, product) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("t-shirts", {product:product})
            }
        });
    });

    //PRODUCT PAGE
    app.get("/product/:id", (req, res) => {
        console.log(req.cookies.cartItems);

        Product.findById(req.params.id, (err, product) => {
            if (err) {
                res.send("error");
            }
            else {
                res.render("product", {product:product});
            };
        });
    });
};