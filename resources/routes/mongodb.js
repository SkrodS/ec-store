module.exports = (mon, bcrypt) => {
    mon.connect(process.env.DBPATH, { useNewUrlParser: true, useUnifiedTopology: true });

    const productSchema = new mon.Schema({
        name: String,
        description: String,
        image: String,
        popular: Boolean,
        price: Number,
    });

    Product = mon.model("Product", productSchema);

    const adminSchema = new mon.Schema({
        username: String,
        password: String,
        sessionId: String,
    });

    Admin = mon.model("Admin", adminSchema);


    const orderSchema = new mon.Schema({
        firstname: String,
        lastname: String,
        email: String,
        address: String,
        country: String,
        city: String,
        zipCode: Number,
        bagItems: Array,
        date: Date,
    });

    Order = mon.model("Order", orderSchema);

    const archiveSchema = new mon.Schema({
        firstname: String,
        lastname: String,
        email: String,
        address: String,
        country: String,
        city: String,
        zipCode: Number,
        bagItems: Array,
        date: Date,
    });

    Archive = mon.model("Archive", orderSchema);


    // FAST CREATES FOLLOWING!
    
    // Product.create({
    //     name: "Gray EC Hoodie",
    //     description: "A gray hoodie with the original EC logo.",
    //     image: "/img/gray.jpg",
    //     popular: true,
    //     price: 400,
    // });

    // Product.create({
    //     name: "Red EC Hoodie",
    //     description: "A red hoodie with the original EC logo.",
    //     image: "/img/red.jpg",
    //     popular: false,
    //     price: 400,
    // });

    // Product.create({
    //     name: "T-shirt by Stina",
    //     description: "A white t-shirt designed by Stina.",
    //     image: "/img/stina-tshirt.jpg",
    //     popular: true,
    //     price: 250,
    // });

    // Product.create({
    //     name: "T-shirt by Vilma",
    //     description: "A white t-shirt designed by Vilma.",
    //     image: "/img/vilma-tshirt.jpg",
    //     popular: false,
    //     price: 250,
    // });

    // Product.create({
    //     name: "T-shirt by Jen",
    //     description: "A white t-shirt designed by Jen.",
    //     image: "/img/jen-tshirt.jpg",
    //     popular: false,
    //     price: 250,
    // });

    // Admin.create({
    //     username: "admin",
    //     password: bcrypt.hashSync("admin", 10),
    //     sessionId: null,
    // });
};