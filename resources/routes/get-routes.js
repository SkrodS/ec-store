module.exports = (app) => {
    app.get("/", (req, res) => {
        res.render("start");
    });

    app.get("/all-products", (req, res) => {
        res.render("all-products");
    });
};