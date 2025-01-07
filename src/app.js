const express = require("express");

const app = express();

app.get("/dataEnter", (req, res) => {
  res.send({  task: "GET", message: "oK! Done"  });
});
app.post("/dataEnter", (req, res) => {
  res.send({ task: "POST", message: "Data Saved Successfully" });
});
app.put("/dataEnter", (req, res) => {
  res.send({ task: "PUT", message: "Data Update Successfully" });
});
app.delete("/dataEnter", (req, res) => {
  res.send({ task: "DELETE", message: "Data Deleted Successfully" });
});

app.listen(3000, () => {
  console.log(`SERVER is successfully listing on 3000`);
});
