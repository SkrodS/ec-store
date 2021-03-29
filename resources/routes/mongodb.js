module.exports = (mon) => {
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
    //     name: "Hoodie",
    //     description: "test",
    //     image: "tototo",
    //     size: "medium",
    // })
};