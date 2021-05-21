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
    
    //DELETE ORDER ROUTE
    //Denna route raderar order från kollektionen "Archives" baserat ID:t som skickas med från EJS-filen "admin-orders.ejs"
    //Innan denna route körs så valideras cookies.
    app.delete("/delete-order/:id", validateCookie, async (req, res) => {
        await Archive.remove({ _id: req.params.id });
        res.redirect("/admin-orders");
    });

    //DELETE PRODUCT ROUTE
    //Denna route raderar produkt från kollektionen "Products" baserat på ID:t som skickas med från EJS-filen "update-product.ejs"
    //Innan denna route körs så valideras cookies.
    app.delete("/delete-product/:id", validateCookie, async (req, res) => {
        await Product.remove({ _id: req.params.id });
        res.redirect("/admin-products");
    });
};