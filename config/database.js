const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    process.env.DB_CONNECTION_SECRET,
    
    
  );
};

module.exports = connectDB;
