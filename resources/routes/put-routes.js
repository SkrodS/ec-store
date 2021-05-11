module.exports = (app) => {

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

    //UPDATE PRODUCT ROUTE
    app.put("/update-product/:id", validateCookie, async (req, res) => {
        let checked;
        
        if (req.body.popular == "on") {
            checked = true;
        }
        else if (!req.body.popular) {
            checked = false;
        };

        await Product.findOneAndUpdate({ _id: req.params.id }, {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            popular: checked,
            price: req.body.price,
        }); 
        res.redirect("/admin-products");
    });
};