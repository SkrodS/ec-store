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
};