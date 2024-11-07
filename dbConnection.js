const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ServiceConnectUser_Db");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Connection Success");
});

module.exports=db