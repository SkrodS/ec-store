module.exports = (app, mon, bcrypt) => {
    mon.connect(process.env.DBPATH, { useNewUrlParser: true, useUnifiedTopology: true });

    const productSchema = new mon.Schema({
        name: String,
        description: String,
        image: String,
        popular: Boolean,
    });

    let Product = mon.model("Product", productSchema);


    const adminSchema = new mon.Schema({
        username: String,
        password: String,
        adminKey: String,
    });

    let Admin = mon.model("Admin", adminSchema);


    const orderSchema = new mon.Schema({
        firstname: String,
        lastname: String,
        address: String,
        zipCode: Number,
        city: String,
        cartItems: Object,
    });

    let Order = mon.model("Order", orderSchema);

    require("./get-routes.js")(app, Product, Admin, Order);

    // Product.create({
    //     name: "T-shirt by Jen",
    //     description: "A white T-shirt designed by Jen.",
    //     image: "/img/jen-tshirt.jpg",
    //     popular: false,
    // });
    
    // Product.create({
    //     name: "T-shirt by Vilma",
    //     description: "A white T-shirt designed by Vilma.",
    //     image: "/img/vilma-tshirt.jpg",
    //     popular: false,
    // });

    // Product.create({
    //     name: "T-shirt by Stina",
    //     description: "A white T-shirt designed by Stina.",
    //     image: "/img/stina-tshirt.jpg",
    //     popular: false,
    // });

    // Admin.create({
    //     username: "robinwidjebackadmin",
    //     password: bcrypt.hashSync("robinadmin", 10),
    //     adminKey: "test",
    // });

    // Order.create({
    //     firstname: "Bob",
    //     lastname: "Stensson",
    //     address: "Spelvägen 19",
    //     zipCode: 66330,
    //     city: "Skoghall",
    //     cartItems: [],
    // });
};