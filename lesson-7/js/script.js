const API_URL =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const hostBus = new Vue();
Vue.component("goods-list", {
  props: ["goods"],
  template: `
    <div class="goods-list">
      <goods-item v-for="good in goods" :good="good" :key="good.id_product" v-on:click-btn="$emit('click-btn-list',$event)" ></goods-item>
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
      <button  v-on:click="$emit('click-btn', good.id_product)" class="btn-to-cart">В корзину</button>
    </div>
  `,
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
  props: ["goods", "sum"],
  template: `
    <div class="basket-list">
      <basket-item v-for="(good,index) in goods" :good="good" :index="index" :key="good.id_product"></basket-item>
      <p class="summ">Итого на сумму {{sum}} рублей</p>
    </div>`,
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
      hostBus.$emit("add-Good-In-Basket", this.index);
    },
    delGoodInBasket() {
      hostBus.$emit("del-Good-In-Basket", this.index);
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
    filteredGoods: [],
    searchLine: "",
    isVisibleCart: false,
    basketGoods: [],
    isError: false,
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
    async makePOSTRequest(url, data) {
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data),
      });
      // let xhr;
      // if (window.XMLHttpRequest) {
      //   xhr = new XMLHttpRequest();
      // } else if (window.ActiveXObject) {
      //   xhr = new ActiveXObject("Microsoft.XMLHTTP");
      // }
      // xhr.onreadystatechange = function () {
      //   if (xhr.readyState === 4) {
      //     callback(xhr.response);
      //   }
      // };

      // xhr.open("POST", url, true);
      // xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

      // xhr.send(data);
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
    addGoodToBasket: function (id) {
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
            this.basketGoods.push({ ...Object(good), number: 1 });
            this.makePOSTRequest(
              "/addToBasket",
              this.basketGoods[this.basketGoods.length - 1]
            );
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
  created() {
    hostBus.$on("add-Good-In-Basket", this.addGoodInBasket);
    hostBus.$on("del-Good-In-Basket", this.delGoodInBasket);
  },
  beforeDestroy() {
    hostBus.$off("add-Good-In-Basket", this.addGoodInBasket);
    hostBus.$off("del-Good-In-Basket", this.delGoodInBasket);
  },
  mounted() {
    this.makeGETRequest(`/data`)
      .then((goods) => {
        this.goods = JSON.parse(goods);
        this.filteredGoods = JSON.parse(goods);
        this.goods.push({
          id_product: "008",
          price: 150,
          product_name: "Футболка",
          img: "img/shirt.jpg",
        });
        this.filteredGoods.push({
          id_product: "008",
          price: 150,
          product_name: "Футболка",
          img: "img/shirt.jpg",
        });
      })
      .catch(() => {
        this.isError = true;
      });
  },
});
