const express = require("express");
const path = require("path");
const dataBase = require("./db");

const app = express();

app.use(express.json({ limit: "100mb" }));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "../public/index.html");
});

app.get("/pictures", function (req, res) {
  const items = dataBase.showItems();
  res.send(items);
});

app.post("/pictures/:id", function (req, res) {
  const item = dataBase.addItem(req.body);
  res.send(item);
});

app.put("/pictures/:id", function (req, res) {
  const item = dataBase.replaceItem(req.body);
  res.send(item);
});

app.delete("/pictures/:id", function (req, res) {
  const id = req.params.id;
  const items = dataBase.deleteItem(id);
  res.send(items);
});

app.listen(3333, () => {
  console.log("Application listening on port 3333!");
});
