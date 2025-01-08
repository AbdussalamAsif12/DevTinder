const express = require("express");
const { adminAuth } = require("../middleware/auth");
const app = express();

app.use("/admin",adminAuth)

app.get("/user", (req, res) => {
  res.send({ task: "User Data Send", message: "oK! Done" });
});
app.get("/admin/getAllData", (req, res) => {
  res.send({ task: "Get Admin All Data Sent", message: "oK! Done" });
});

app.get("/admin/deleteUser", (req, res) => {
  res.send({ task: "Delete Admin a user", message: "oK! Done" });
});

app.listen(3000, () => {
  console.log(`SERVER is successfully listing on 3000`);
});
