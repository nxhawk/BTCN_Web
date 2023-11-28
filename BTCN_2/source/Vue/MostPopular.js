import fetch from "./DB_provider.js";
import Movie from "./Movie.js";

export default {
  props: ["isDarkMode"],
  data() {
    return {
      movies: [],
      firstThreeMovies: [],
      listMovie: [],
    };
  },
  methods: {
    async loadMostPopularMovies() {
      let data = await fetch("get/mostpopular/per_page=30&page=1");
      data.items.map((obj) => this.movies.push(new Movie(obj)));
      this.firstThreeMovies.push(this.movies.splice(0, 3));
      for (let i = 0; i < 9; i++) this.listMovie.push(this.movies.splice(0, 3));

      data.items.map((obj) => this.movies.push(new Movie(obj)));
    },
  },
  mounted() {
    this.loadMostPopularMovies();
  },
  template: `
  <div class="mb-5">
    <h3 class="text-start" :class="isDarkMode?'text-white':'text-black'">Most Popular</h3>  

    <div id="popularSlide" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="3" aria-label="Slide 4"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="4" aria-label="Slide 5"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="5" aria-label="Slide 6"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="6" aria-label="Slide 7"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="7" aria-label="Slide 8"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="8" aria-label="Slide 9"></button>
            <button type="button" data-bs-target="#popularSlide" data-bs-slide-to="9" aria-label="Slide 10"></button>
        </div>

        <div class="carousel-inner">
            <div class="carousel-item active" v-for="movie in firstThreeMovies">
              <div class="row">
                  <div class="col-4" v-for="m in movie">
                    <div class="box-container">
                        <img style="cursor:pointer;" :src="m.image" class="d-block rounded-1 border border-black" :alt="m.title" @click="$emit('handleMovieDetail', m)">
                        <div class="box" :class="isDarkMode?'bg-white text-black':'bg-black  text-white-50'">{{m.title}} ({{m.year}})</div>
                    </div>
                  </div>
              </div>
            </div>
        
            <div class="carousel-item" v-for="movie in listMovie">
              <div class="row">
                  <div class="col-4" v-for="m in movie">
                    <div class="box-container">
                      <img style="cursor:pointer;" :src="m.image" class="d-block rounded-1 border border-black" :alt="m.title" @click="$emit('handleMovieDetail', m)">
                      <div class="box" :class="isDarkMode?'bg-white text-black':'bg-black  text-white-50'">{{m.title}} ({{m.year}})</div>
                    </div>
                  </div>
              </div>
            </div>
        
        
        </div>

        <button class="carousel-control-prev" type="button" data-bs-target="#popularSlide" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#popularSlide" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
    </div>
  </div>
  `,
};
