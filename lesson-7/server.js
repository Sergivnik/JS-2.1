const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.static("."));
app.use(express.json());

app.get("/data", (req, res) => {
  fs.readFile("./data/catalog.json", "utf8", (err, data) => {
    let goods = JSON.parse(data);
    res.send(goods);
  });
});

app.post("/addToBasket", (req, res) => {
  console.log(req.body);
  const item = req.body;
  fs.readFile("./data/cart.json", "utf8", (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const cart = JSON.parse(data);
      cart.push(item);

      fs.writeFile(
        "./data/cart.json",
        JSON.stringify(cart, null, "\t"),
        (err) => {
          if (err) {
            res.send('{"result": 0}');
          } else {
            res.send('{"result": 1}');
          }
        }
      );
    }
  });
});

app.post("/delFromBasket", (req, res) => {
  console.log(req.body);
  const item = req.body;
  fs.readFile("./data/cart.json", "utf8", (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      let cart = JSON.parse(data);
      let index = cart.findIndex((elem) => elem.id_product == item.id_product);
      cart.splice(index, 1);

      fs.writeFile(
        "./data/cart.json",
        JSON.stringify(cart, null, "\t"),
        (err) => {
          if (err) {
            res.send('{"result": 0}');
          } else {
            res.send('{"result": 1}');
          }
        }
      );
    }
  });
});
app.listen(3000, function () {
  console.log("server is running on port 3000!");
});
