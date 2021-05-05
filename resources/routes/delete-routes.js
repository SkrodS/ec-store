module.exports = (app, cookie) => {

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
                    res.status(403).redirect("sign-in");
                };
            });
        }
        else {
            res.status(403).redirect("sign-in");
        };
    };
    
    //DELETE ORDER ROUTE
    app.delete("/delete-order/:id", validateCookie, async (req, res) => {
        await Archive.remove({ _id: req.params.id });
        res.redirect("/admin-orders");
    });
};