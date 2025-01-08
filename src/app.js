const express = require("express");

const app = express();

app.get("/getUserData", (req, res) => {
  try {
   
    throw new Error("blah blah");
    res.send("User Data send")
  } catch (error) {
    res.status(500).send("Some Error Contact support team")
  }
});


// Optional code to check the error
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.listen(3000, () => {
  console.log(`SERVER is successfully listing on 3000`);
});
