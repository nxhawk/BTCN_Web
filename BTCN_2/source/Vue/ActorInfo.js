import fetch from "./DB_provider.js";
import Movie from "./Movie.js";

export default {
  props: ["isDarkMode", "actorID"],
  data() {
    return {
      actor: null,
      movies: [],
      list3Movies: [],
      page: 1,
    };
  },
  methods: {
    async loadActorInfo() {
      let data = await fetch(`detail/name/${this.actorID}`);
      this.actor = data.items[0];
      this.movies = [];
      this.page = 1;

      if (this.actor != null) {
        data = await fetch(
          `search/name/${this.actor.name}?per_page=500&page=1`
        );
        this.movies = [];
        data.items.map((obj) => this.movies.push(new Movie(obj)));
      }

      if (this.movies.length > 0) {
        for (let i = 0; i < this.movies.length / 3; i++)
          this.list3Movies.push(this.movies.splice(0, 3));
        if (this.movies.length > 0)
          this.list3Movies.push(this.movies.splice(0, this.movies.length));
      }
    },
    loadAllMovies(page) {
      this.page = page;
    },
  },
  mounted() {
    this.loadActorInfo();
  },
  template: `
  <div class="my-2">
  <div v-if="actor !=null">
  <h2 :class ="isDarkMode?'text-white':'text-black'">About</h2>
  <div class="row">
      <div class="col-4">
          <img :src="actor.image" :alt="actor.name" style="width: 100%">
      </div>
      <div class="col-8">
          <div class="container mt-1">
              <p class="text-start border border-info border-5 rounded p-3" :class ="isDarkMode?'text-white':'text-black'">
                <template v-if="actor.name!=null"><b>Name:</b> {{actor.name}} <br></template>
                <template v-if="actor.role!=null"><b>Role:</b> {{actor.role}} <br></template>
                <template v-if="actor.awards.length > 0"><b>Awards:</b> {{actor.awards}} <br></template>
                <template v-if="actor.summary!=null"><b>Summary:</b> {{actor.summary}} <br></template>

              </p>
          </div>
      </div>
  </div>


  <h2 v-if="list3Movies.length > 0" :class ="isDarkMode?'text-white':'text-black'" class="mt-4">Movies Involved</h2>
  <div class="row mt-2">
        <div class="col-4 mb-4" v-for="movie in list3Movies[page - 1]">
            <div class="card ms-auto me-auto" style="width: 19rem; height:100%" @click="$emit('handleMovieDetail', movie)">
                <img style="cursor:pointer;" :src="movie.image" class="card-img-top" :alt="movie.title">
                <div class="card-body rounded" :class="isDarkMode?'text-white bg-dark':''">
                    <p class="text-center fw-bold">{{movie.title}}</p>
                    <p class="text-center">({{movie.year}})</p>
                </div>
            </div>
        </div>
    </div>

    <nav class="d-flex justify-content-center align-items-center" :data-bs-theme="isDarkMode?'dark':''" v-if="list3Movies.length > 0">
      <ul class="pagination overflow-x-auto">
          <li class="page-item" :class="page==1?'disabled':''">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="loadAllMovies(page-1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          
          <template v-for="n in list3Movies.length">
            <li class="page-item" :class="page===n?'active':''">
              <span v-if="n===page" class="page-link">{{n}}</span>
              <a v-else class="page-link" href="#" @click.prevent="loadAllMovies(n)">{{n}}</a>
            </li>
          </template>

          <li class="page-item" :class="page==list3Movies.length?'disabled':''">
              <a class="page-link" href="#" aria-label="Next" @click.prevent="loadAllMovies(page+1)">
                <span aria-hidden="true">&raquo;</span>
              </a>
          </li>
      </ul>
    </nav>

</div>
<div v-else :class ="isDarkMode?'text-white':'text-black'" class="p-4">
  <h2>There is no information about this actor.</h2>
</div>
  </div>
  
  `,
};
