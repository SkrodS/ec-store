module.exports = (app, cookie, bcrypt) => {

    app.post("/product/:id/add-item", (req, res) => {
        Product.findOne({"_id": req.params.id}, [], async (err, product) => {
            if (product) {
                if (req.cookies.cartItems) {
                    let cartItems = [req.cookies.cartItems];
                    cartItems.push({name: product.name, size: req.body.size, quantity: parseInt(req.body.quantity)});
                    
                    cartItems = cartItems.reduce((acc, val) => acc.concat(val), []);

                    if (Array.isArray(cartItems)) {
                        cartItems = Array.from(cartItems.reduce((acc, { quantity, ...r }) => {
                            const key = JSON.stringify(r);
                            const current = acc.get(key) || { ...r, quantity: 0 };
                            return acc.set(key, { ...current, quantity: current.quantity + quantity });
                        }, new Map).values());
                    };
                    
                    await res.cookie("cartItems", cartItems, {maxAge: 10800000});
                }
                else {
                    await res.cookie("cartItems", {"name": product.name, "size": req.body.size, "quantity": parseInt(req.body.quantity)}, {maxAge: 10800000});
                };
                res.redirect("/");
            }
            else {
                res.send(err);
            };
        });
    });
};