const express = require("express");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/prfoile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(7777, () => {
      console.log(`Server is successfully listing on PORT 7777....`);
    });
  })

  .catch((err) => {
    console.err(`${err} : Database cannot be connected!!`);
  });
