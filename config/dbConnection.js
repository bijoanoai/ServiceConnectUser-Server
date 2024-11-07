// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/ServiceConnectUser_Db");

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "Connection Error"));
// db.once("open", () => {
//   console.log("Connection Success");
// });

// module.exports=db

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
