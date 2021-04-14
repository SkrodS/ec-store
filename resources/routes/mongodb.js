module.exports = (mon, bcrypt) => {
    mon.connect(process.env.DBPATH, { useNewUrlParser: true, useUnifiedTopology: true });

    const productSchema = new mon.Schema({
        name: String,
        description: String,
        image: String,
        size: String,
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
        cartItems: Array,
    });

    let Order = mon.model("Order", orderSchema);

    // Product.create({
    //     name: "Gray logo",
    //     description: "A gray hoodie with the normal EC Logo",
    //     image: "tototow",
    //     size: "medium",
    // })
    
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