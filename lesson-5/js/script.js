const API_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const app = new Vue({
  el: "#app",
  data: {
    goods: [],
    filteredGoods: [],
    searchLine: "",
    isVisibleCart: false,
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
        console.log(this.goods[0]);
      })
      .catch(() => {
        alert("Чёт не так пошло((");
      });
  },
});
