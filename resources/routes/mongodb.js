module.exports = (mon) => {
    mon.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true });

    const testSchema = new mon.Schema({
        text: String,
        number: Number,
        date: Date,
    });

    let Test = mon.model("Test", testSchema);

    console.log(Test)

    Test.findOne({text: "tjena"});
};