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
app.get("/addToBasket", (req, res) => {
  fs.readFile("./data/cart.json", "utf8", (err, data) => {
    let goods = JSON.parse(data);
    res.send(goods);
  });
});

app.post("/addToBasket", (req, res) => {
  const newGood = req.body;
  fs.readFile("./data/cart.json", "utf8", (err, data) => {
    const goods = JSON.parse(data);

    if (goods.find((good) => good.id_product == newGood.id_product)) {
      res
        .status("400")
        .json({ error: "already have good with id " + newGood.id_product });
    } else {
      goods.push(newGood);
      fs.writeFileSync("./data/cart.json", JSON.stringify(goods, null, "\t"));
      res.json({ result: "added good ok", id: newGood.id_product });
    }
  });
  fs.readFile("./data/stats.json", "utf8", (err, data) => {
    const listActivities = JSON.parse(data);
    const newActivity = {
      date: new Date(),
      action: "Добавление в корзину",
      item: newGood.product_name,
    };
    listActivities.push(newActivity);
    fs.writeFileSync(
      "./data/stats.json",
      JSON.stringify(listActivities, null, "\t")
    );
  });
});

app.post("/delFromBasket", (req, res) => {
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
  fs.readFile("./data/stats.json", "utf8", (err, data) => {
    const listActivities = JSON.parse(data);
    const newActivity = {
      date: new Date(),
      action: "Удаление из корзины",
      item: item.product_name,
    };
    listActivities.push(newActivity);
    fs.writeFileSync(
      "./data/stats.json",
      JSON.stringify(listActivities, null, "\t")
    );
  });
});
app.post("/changeBasket", (req, res) => {
  console.log(req.body);
  const item = req.body;
  fs.readFile("./data/cart.json", "utf8", (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      let cart = JSON.parse(data);
      let index = cart.findIndex((elem) => elem.id_product == item.id_product);
      cart[index].number = item.number;

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
  fs.readFile("./data/stats.json", "utf8", (err, data) => {
    const listActivities = JSON.parse(data);
    const newActivity = {
      date: new Date(),
      action: "Изменение количества",
      item: item.product_name,
    };
    listActivities.push(newActivity);
    fs.writeFileSync(
      "./data/stats.json",
      JSON.stringify(listActivities, null, "\t")
    );
  });
});
app.listen(3000, function () {
  console.log("server is running on port 3000!");
});
