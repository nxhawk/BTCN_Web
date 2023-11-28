import fetch from "./DB_provider.js";
import Movie from "./Movie.js";
import Reviews from "./Reviews.js";

export default {
  props: ["isDarkMode", "theMovie"],
  components: {
    Reviews,
  },
  data() {
    return {
      movie: null,
    };
  },
  methods: {
    async loadMovieDetail() {
      let data = await fetch(`detail/movie/${this.theMovie.id}`);
      if (data.items.length == 0) this.movie = this.theMovie;
      else this.movie = new Movie(data.items[0]);
    },
  },
  mounted() {
    this.loadMovieDetail();
  },
  template: `
    <div class="my-2" v-if="movie !=null">
        <div class="row">
        <div class="col-4">
                <img :src="movie.image" :alt="movie.title" style="width: 100%">
        </div>
        <div class="col-8">
        <div class="container mt-1">
        <p class="text-start border border-info border-5 rounded p-3" :class ="isDarkMode?'text-white':'text-black'">
            <template v-if="movie.title!=null"><b>Title:</b> {{movie.title}} <br></template>
            <template v-if="movie.year!=null"> <b>Year:</b> {{movie.year}} <br></template>

            <template v-if="movie.directorList !=null && movie.directorList.length>0">
            <b>Director: </b>
                <span v-for="director in movie.directorList">
                    <span>{{director.name}}</span>
                    <span v-if="director.id != movie.directorList[movie.directorList.length - 1].id">, </span>
                    <span v-else>.</span>
                </span>
                <br>
            </template>

            <template v-if="movie.plot!=null"> <b>Plot:</b> {{movie.plot}} <br></template>
            <template v-if="movie.type!=null"> <b>Type:</b> {{movie.type}}<br></template>

            <template v-if="movie.genreList!=null && movie.genreList.length>0">
            <b>Genre: </b>
                <span v-for="gen in movie.genreList">
                    <span>{{gen.value}}</span>
                    <span v-if="gen.value != movie.genreList[movie.genreList.length - 1].value">, </span>
                    <span v-else>.</span>
                </span>
                <br>
            </template>

            <template v-if="movie.actorList!=null && movie.actorList.length>0">
            <b>Actor: </b>
                <span v-for="actor in movie.actorList">
                    <a href="#" style="text-decoration:none" @click.prevent="$emit('showActor', actor.id)">{{actor.name}}</a>
                    <span v-if="actor.id != movie.actorList[movie.actorList.length - 1].id">, </span>
                    <span v-else>.</span>
                </span>
                <br>
            </template>
        </p>
    </div>
        </div>

        </div>
          <Reviews :isDarkMode="isDarkMode" :id="movie.id"/>
    </div>
`,
};
