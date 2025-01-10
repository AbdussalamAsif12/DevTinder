const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://abdusslamasif8955:1Pshs6Pgq7oqospl@namastenodeakshay.zoybo.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
