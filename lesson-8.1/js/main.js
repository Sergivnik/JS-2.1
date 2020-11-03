export const app = new Vue({
  el: "#app",
  data: {
    goods: [],
    isVisibleCart: false,
    isError: false,
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
