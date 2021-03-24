module.exports = (mon) => {
    mon.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true });

    const testSchema = new mon.Schema({
        text: String,
        number: Number,
        date: Date,
    });

    let Test = mon.model("Test", testSchema);

    Test.create({
        text: "tjena",
        number: 2397,
        date: new Date(),
    });

    console.log(Test)

    Test.findOne({text: "tjena"});
};