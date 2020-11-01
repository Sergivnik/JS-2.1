export default Vue.component("field_search", {
  data() {
    return {
      searchLine: "",
    };
  },
  template: `
  <div>
    <input 
      class="goods-search" 
      v-model="searchLine"
    />
    <button 
      class="search-button" 
      type="button" 
      @click="click_search">
      Искать
    </button>
  </div>`,
  methods: {
    click_search() {
      hostBus.$emit("clickSearch", this.searchLine);
    },
  },
});
