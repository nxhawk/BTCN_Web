export default {
  props: ["isDarkMode"],
  data() {
    return {
      search: "",
    };
  },
  methods: {
    clearData() {
      this.search = "";
    },
  },
  template: `
  <nav class="navbar navbar-expand-lg rounded mt-2 border" :class="isDarkMode?'bg-dark text-white border-secondary':'bg-body-tertiary text-black'">
    <div class="container-fluid">
      <a class="navbar-brand" :class="isDarkMode?'text-white':''" href="#" @click.prevent="$emit('loadHomePage')">Home</a>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model = "search">
        <button class="btn btn-outline-success" type="submit" @click.prevent="$emit('handleSearch', search)">Search</button>
      </form>
    </div>
  </nav>
  `,
};
