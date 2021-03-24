module.exports = (app) => {
    app.get("/", (req, res) => {
        res.send();
    });
    
    app.listen(3000, (err) => {
        if (!err) {
            console.log("Connected");
        }
        else {
            console.log(err);
        };
    });
};