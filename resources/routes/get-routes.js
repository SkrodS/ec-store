module.exports = (app, Product, Admin, Order) => {
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

    app.get("/product/:id", (req, res) => {
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