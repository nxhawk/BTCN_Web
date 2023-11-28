import fetch from "./DB_provider.js";
import Movie from "./Movie.js";

export default {
  data() {
    return {
      movies: [],
      fisrtMovie: [],
    };
  },
  methods: {
    async loadList5Newest() {
      let data = await fetch("get/topboxoffice/per_page=5&page=1");
      data.items.map((obj) => this.movies.push(new Movie(obj)));
      this.firstMovie = this.movies.splice(0, 1);
    },
  },
  mounted() {
    this.loadList5Newest();
  },
  template: `
  <div id="newestSlide" class="carousel slide mt-2 mb-3" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#newestSlide" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#newestSlide" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#newestSlide" data-bs-slide-to="2" aria-label="Slide 3"></button>
      <button type="button" data-bs-target="#newestSlide" data-bs-slide-to="3" aria-label="Slide 4"></button>
      <button type="button" data-bs-target="#newestSlide" data-bs-slide-to="4" aria-label="Slide 5"></button>
    </div>

    <div class="carousel-inner">
      <div class="carousel-item active" v-for="movie in firstMovie">
        <img :src="movie.image" class="d-block rounded-2" :alt="movie.title" style="cursor:pointer;" @click="$emit('handleMovieDetail', movie)">
        <div class="carousel-caption d-none d-md-block">
            <h5>{{movie.fullTitle}}</h5>
        </div>
      </div>

      <div class="carousel-item" v-for="movie in movies" @click="$emit('handleMovieDetail', movie)">
        <img :src="movie.image" class="d-block rounded-2" :alt="movie.title" style="cursor:pointer;">
        <div class="carousel-caption d-none d-md-block">
            <h5>{{movie.fullTitle}}</h5>
        </div>
      </div>
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#newestSlide" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#newestSlide" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
    </button>
  </div>
  `,
};
