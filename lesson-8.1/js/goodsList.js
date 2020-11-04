Vue.component("goods-list", {
  props: ["goods"],
  data() {
    return { filteredGoods: [] };
  },
  mounted() {
    this.filteredGoods = this.goods.slice();
  },
  template: `
    <div class="goods-list">
      <goods-item v-for="good in filteredGoods" 
        :good="good" :key="good.id_product">
      </goods-item>
    </div>`,
  created() {
    hostBus.$on("clickSearch", this.filterGoods);
  },
  methods: {
    filterGoods(searchLine) {
      const regexp = new RegExp(searchLine, "i");
      this.filteredGoods = this.goods.filter((good) =>
        good.product_name.match(regexp)
      );
    },
  },
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
import { hostBus } from "./globalVar.js";
