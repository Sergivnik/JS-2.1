const API_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const hostBus = new Vue();
Vue.component("goods-list", {
  props: ["goods"],
  template: `
    <div class="goods-list">
      <goods-item v-for="good in goods" 
        :good="good" :key="good.id_product">
      </goods-item>
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
      <button v-on:click="click_btn" class="btn-to-cart">В корзину</button>
    </div>
  `,
  methods: {
    click_btn() {
      hostBus.$emit("addGoodToBasket", this.good);
    },
  },
});
Vue.component("field-search", {
  props: ["text"],
  template: `
  <div>
    <input class="goods-search" :value="text" @input="input"/>
    <button class="search-button" type="button" @click="click_search">Искать</button>
  </div>`,
  methods: {
    click_search() {
      this.$emit("click_search", text);
    },
    input(e) {
      text = e.target.value;
    },
  },
});
Vue.component("basket-list", {
  data() {
    return { basketGoods: [] };
  },
  template: `
    <div class="basket-list">
      <basket-item 
        v-for="(good,index) in basketGoods" 
        :good="good" 
        :index="index" 
        :key="good.id_product">
      </basket-item>
      <p class="summ">Итого на сумму {{sum}} рублей</p>
    </div>`,
  mounted() {
    this.makeGETRequest("/addToBasket")
      .then((goods) => {
        this.basketGoods = JSON.parse(goods);
      })
      .catch(() => {
        this.isError = true;
      });
  },
  created() {
    hostBus.$on("addGoodToBasket", this.addGoodToBasket);
    hostBus.$on("addGoodInBasket", this.addInBasket);
    hostBus.$on("delGoodInBasket", this.delInBasket);
  },
  beforeDestroy() {
    hostBus.$off("addGoodToBasket");
    hostBus.$off("addGoodInBasket");
    hostBus.$off("delGoodInBasket");
  },
  computed: {
    sum() {
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
    addInBasket: function (index) {
      this.basketGoods[index].number++;
    },
    delInBasket: function (index) {
      if (this.basketGoods[index].number > 1) {
        this.basketGoods[index].number--;
      } else {
        app.makePOSTRequest("/delFromBasket", this.basketGoods[index]);
        this.basketGoods.splice(index, 1);
      }
    },
    addGoodToBasket: function (good) {
      let check = true;
      for (let goodBasket of this.basketGoods) {
        if (goodBasket.id_product == good.id_product) {
          check = false;
          goodBasket.number++;
        }
      }
      if (check) {
        this.basketGoods.push({ ...Object(good), number: 1 });
        app.makePOSTRequest(
          "/addToBasket",
          this.basketGoods[this.basketGoods.length - 1]
        );
      }
    },
  },
});
Vue.component("basket-item", {
  props: ["good", "index"],
  template: `
    <div class="goods-item">
      <h3>{{ good.product_name }}</h3>
      <img v-if="good.img !=null" :src="good.img" width="100" height="100" alt="">
      <img v-else src="img/noPhoto.jpg" width="100" height="100" alt="">
      <p>Цена: {{ good.price }} рублей</p>
      <p>Количество: {{ good.number }}</p>
      <button @click="addGoodInBasket" class="btn-in-cart">Добавить</button>
      <button @click="delGoodInBasket" class="btn-in-cart">Удалить</button>
    </div>
  `,
  methods: {
    addGoodInBasket() {
      hostBus.$emit("addGoodInBasket", this.index);
    },
    delGoodInBasket() {
      hostBus.$emit("delGoodInBasket", this.index);
    },
  },
});
Vue.component("net-error", {
  template: `<h2 class="h2error">Чёт не так пошло((</h2>`,
});
const app = new Vue({
  el: "#app",
  data: {
    goods: [],
    searchLine: "",
    isVisibleCart: false,
    basketGoods: [],
    isError: false,
  },
  computed: {
    //   filteredGoods() {
    //     const regexp = new RegExp(this.searchLine, 'i');
    //     return this.goods.filter((good) => good.product_name.match(regexp));
    // },
  },
  methods: {
    async makeGETRequest(url) {
      let response = await fetch(url);
      if (response.ok) {
        let goods = await response.text();
        return goods;
      }
    },
    async makePOSTRequest(url, data) {
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data),
      });
    },

    filterGoods: function (text) {
      this.searchLine = text;
      const regexp = new RegExp(text, "i");
      this.filteredGoods = this.goods.filter((good) =>
        regexp.test(good.product_name)
      );
    },
    basketVisible() {
      this.isVisibleCart = !this.isVisibleCart;
    },
  },
  mounted() {
    this.makeGETRequest(`/data`)
      .then((goods) => {
        this.goods = JSON.parse(goods);
      })
      .catch(() => {
        this.isError = true;
      });
  },
});
