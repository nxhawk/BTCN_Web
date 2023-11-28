import fetch from "./DB_provider.js";
import Movie from "./Movie.js";
import SearchMovieByActor from "./SearchMovieByActor.js";

export default {
  props: ["isDarkMode", "search"],
  components: {
    SearchMovieByActor,
  },
  data() {
    return {
      movies: [],
      page: 1,
      total_page: 0,
      haveResult: false,
    };
  },
  methods: {
    async loadAllMovies(page) {
      this.haveResult = false;
      let data = await fetch(
        `search/movie/${this.search}?per_page=6&page=${page}`
      );
      this.page = page;
      this.movies = [];
      this.total_page = data.total_page;
      data.items.map((obj) => this.movies.push(new Movie(obj)));
      if (this.movies.length > 0) this.haveResult = true;
    },
    handleHaveResult() {
      this.haveResult = true;
    },
    handleMovieDetail(m) {
      this.$emit("handleMovieDetail", m);
    },
  },
  mounted() {
    this.loadAllMovies(1);
  },
  watch: {
    search: {
      handler() {
        this.loadAllMovies(1);
      },
      deep: true,
    },
  },
  template: `
    <div>
        <h2 v-if="movies.length > 0" :class="isDarkMode?'text-white':''" class="mt-2">Movies</h2>
        <div class="row">
            <div class="col-4 mb-4" v-for="movie in movies">
                <div class="card ms-auto me-auto" style="width: 19rem; height:100%" @click="$emit('handleMovieDetail', movie)">
                    <img style="cursor:pointer;" :src="movie.image" class="card-img-top" :alt="movie.title">
                    <div class="card-body rounded" :class="isDarkMode?'text-white bg-dark':''">
                        <p class="text-center fw-bold">{{movie.title}}</p>
                        <p class="text-center">({{movie.year}})</p>
                    </div>
                </div>
            </div>
        </div>

        <nav class="d-flex justify-content-center align-items-center" :data-bs-theme="isDarkMode?'dark':''" v-if="movies.length > 0">
          <ul class="pagination overflow-x-auto">
              <li class="page-item" :class="page==1?'disabled':''">
                <a class="page-link" href="#" aria-label="Previous" @click.prevent="loadAllMovies(page-1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              
              <template v-for="n in total_page">
                <li class="page-item" :class="page===n?'active':''">
                  <span v-if="n===page" class="page-link">{{n}}</span>
                  <a v-else class="page-link" href="#" @click.prevent="loadAllMovies(n)">{{n}}</a>
                </li>
              </template>

              <li class="page-item" :class="page==total_page?'disabled':''">
                  <a class="page-link" href="#" aria-label="Next" @click.prevent="loadAllMovies(page+1)">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
              </li>
          </ul>
        </nav>

        <SearchMovieByActor :search="search" :isDarkMode="isDarkMode" @handleMovieDetail="handleMovieDetail"/>

        <h2 v-if="haveResult == false" class="p-4" :class="isDarkMode?'text-white':''">No result</h2>
    </div>
  `,
};
