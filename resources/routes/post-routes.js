module.exports = (app, cookie, bcrypt) => {

    app.post("/product/:id/add-item", (req, res) => {
        Product.findOne({"_id": req.params.id}, [], async (err, product) => {
            if (product) {
                if (req.cookies.cartItems) {
                    let cartItems = [req.cookies.cartItems];
                    cartItems.push({name: product.name, size: req.body.size, quantity: req.body.quantity});
                    await res.cookie("cartItems", cartItems, {maxAge: 10800000});
                    console.log(req.cookies.cartItems);
                }
                else {
                    await res.cookie("cartItems", {name: product.name, size: req.body.size, quantity: req.body.quantity}, {maxAge: 10800000});
                };
                res.redirect("/");
            }
            else {
                res.send(err);
            };
        });
    });
};