const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true, 
            useCreateIndex: true
        });
        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch(err) {
        console.log(`MongoDB Error: ${err.message}`);
        process.exit(1);
    }
}
