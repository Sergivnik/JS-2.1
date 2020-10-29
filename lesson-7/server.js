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
//  app.post("/addToBasket", function (req, res) {
//    res.send(req.body);
//  });

app.post("/addToBasket", (req, res) => {
  console.log(req.body);
  const item = req.body;
  fs.readFile("./data/cart.json", "utf8", (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      console.log(data);
      const cart = JSON.parse(data);
      cart.push(item);

      fs.writeFile(
        "./data/cart.json",
        JSON.stringify(cart, null, "\t"),
        (err) => {
          if (err) {
            res.send('{"result": 0}');
            console.log("err");
          } else {
            res.send('{"result": 1}');
            console.log("good");
          }
        }
      );
    }
  });
});

app.listen(3000, function () {
  console.log("server is running on port 3000!");
});
