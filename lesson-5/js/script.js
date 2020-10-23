const API_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
Vue.component("goods-list", {
  props: ["goods"],
  template: `
    <div class="goods-list">
      <goods-item v-for="good in goods" :good="good"></goods-item>
    </div>`,
});
Vue.component("goods-item", {
  props: ["good"],
  template: `
    <div class="goods-item">
      <h3>{{ good.product_name }}</h3>
      <img v-if="good.img !=null" :src="good.img" width="100" height="100" alt="">
      <img v-else src="img/noPhoto.jpg" width="100" height="100" alt="">
      <p>Цена: {{ good.price }} рублей</p>
      <button  :data-id="good.id_product" @click="app.addGoodToBasket" class="btn-to-cart">В корзину</button>
    </div>
  `,
});
const app = new Vue({
  el: "#app",
  data: {
    goods: [],
    filteredGoods: [],
    searchLine: "",
    isVisibleCart: false,
    basketGoods: [],
  },
  computed: {
    calcSum() {
      let sum = 0;
      this.basketGoods.forEach((element) => {
        sum = sum + element.price * element.number;
      });
      return sum;
    },
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
            //Вот тут вопрос!!! Почему не работает код из строк 42-43 вернее не работает динамически?
            //good.number = 1;
            //this.basketGoods.push(good)
            this.basketGoods.push({ ...Object(good), number: 1 });
          }
          break;
        }
      }
    },
    addGoodInBasket(index) {
      this.basketGoods[index].number++;
    },
    delGoodInBasket(index) {
      if (this.basketGoods[index].number > 1) {
        this.basketGoods[index].number--;
      } else {
        this.basketGoods.splice(index, 1);
      }
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
