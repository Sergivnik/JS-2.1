const API_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const app = new Vue({
  el: "#app",
  data: {
    goods: [],
    filteredGoods: [],
    searchLine: "",
    isVisibleCart: false,
    basketGoods: [],
  },
  methods: {
    async makeGETRequest(url) {
      let response = await fetch(url);
      if (response.ok) {
        let goods = await response.text();
        return goods;
      }
    },
    FilterGoods() {
      const regexp = new RegExp(this.searchLine, "i");
      this.filteredGoods = this.goods.filter((good) =>
        regexp.test(good.product_name)
      );
    },
    basketVisible() {
      this.isVisibleCart = !this.isVisibleCart;
    },
    addGoodToBasket: function (e) {
      let id = e.target.dataset["id"];
      let check = true;
      for (let good of this.filteredGoods) {
        if (good.id_product == id) {
          for (let goodBasket of this.basketGoods) {
            if (goodBasket.id_product == id) {
              check = false;
              goodBasket.number++;
            }
          }
          if (check) {
            good.number = 1;
            this.basketGoods.push(good);
          }
          break;
        }
      }
    },
    addGoodInBasket(index) {
      this.basketGoods[index].number++;
    },
    delGoodInBasket(index) {
      this.basketGoods[index].number--;
    },
  },

  mounted() {
    this.makeGETRequest(`${API_URL}/catalogData.json`)
      .then((goods) => {
        this.goods = JSON.parse(goods);
        this.filteredGoods = JSON.parse(goods);
        this.goods.push({
          id_product: "01",
          price: 150,
          product_name: "Футболка",
          img: "img/shirt.jpg",
        });
        this.filteredGoods.push({
          id_product: "01",
          price: 150,
          product_name: "Футболка",
          img: "img/shirt.jpg",
        });
      })
      .catch(() => {
        alert("Чёт не так пошло((");
      });
  },
});
