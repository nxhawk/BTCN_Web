import Header from "./Header.js";
import Navbar from "./Navbar.js";
import Newest from "./Newest.js";
import MostPopular from "./MostPopular.js";
import TopRating from "./TopRating.js";
import Footer from "./Footer.js";
import SearchMovie from "./SearchMovie.js";
import MovieDetail from "./MovieDetail.js";
import ActorInfo from "./ActorInfo.js";

export default {
  components: {
    Header,
    Navbar,
    Newest,
    MostPopular,
    TopRating,
    Footer,
    SearchMovie,
    MovieDetail,
    ActorInfo,
  },
  data() {
    return {
      isDarkMode: false,
      search: "",
      showSearchMovie: false,
      showMovieDetail: false,
      showActorPage: false,
      actorID: "",
      theMovie: null,
      isLoading: true,
    };
  },
  methods: {
    changeDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      $("body").toggleClass("bg-black bg-dark-subtle");
    },
    handleSearch(search) {
      if (search == "") return;
      this.search = search;
      this.showSearchMovie = true;
      this.showMovieDetail = false;
      this.showActorPage = false;
      this.movieID = "";
    },
    handleMovieDetail(theMovie) {
      this.theMovie = theMovie;
      this.search = "";
      this.actorID = "";
      this.showSearchMovie = false;
      this.showMovieDetail = true;
      this.showActorPage = false;
    },
    showActor(id) {
      this.theMovie = null;
      this.actorID = id;
      this.search = "";
      this.showSearchMovie = false;
      this.showMovieDetail = false;
      this.showActorPage = true;
    },
    loadHomePage() {
      if (
        this.showActorPage == false &&
        this.showMovieDetail == false &&
        this.showSearchMovie == false
      )
        return;
      this.theMovie = null;
      this.search = "";
      this.actorID = "";
      this.showSearchMovie = false;
      this.showMovieDetail = false;
      this.showActorPage = false;
      this.$refs.NavBar.clearData();
      this.loading();
    },
    loading() {
      this.isLoading = true;
      $("#preloader").fadeIn();
      $("#main").fadeOut();
      $("#main")
        .delay(2000)
        .fadeIn("slow", () => {
          this.isLoading = false;
        });
      $("#preloader")
        .delay(2000)
        .fadeOut("slow", () => {
          $(window).scrollTop(0);
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.loading();
  },
  template: `
    <div>
      <div v-if="isLoading">
        <div class='loadercontainer' id="preloader">
          <div class='loader'>
              <div class='loader--dot'></div>
              <div class='loader--dot'></div>
              <div class='loader--dot'></div>
              <div class='loader--dot'></div>
              <div class='loader--dot'></div>
              <div class='loader--dot'></div>
              <div class='loader--text':class="isDarkMode?'text-white':'text-black'"></div>
          </div>
        </div>
      </div>
      <div id="main" v-else>
        <Header :isDarkMode="isDarkMode" @changeDarkMode="changeDarkMode"/>
        <Navbar :isDarkMode="isDarkMode" @handleSearch = "handleSearch" @loadHomePage="loadHomePage" ref="NavBar"/>
    
        <ActorInfo v-if="showActorPage" :isDarkMode="isDarkMode" :actorID = "actorID" @handleMovieDetail="handleMovieDetail"/>
        <MovieDetail v-else-if="showMovieDetail" :isDarkMode="isDarkMode" :theMovie="theMovie" @showActor="showActor"/>
        <SearchMovie v-else-if="showSearchMovie" :isDarkMode="isDarkMode" :search="search" @handleMovieDetail="handleMovieDetail" @showActor="showActor"/>
        <template v-else>
            <Newest @handleMovieDetail="handleMovieDetail"/>
            <MostPopular :isDarkMode="isDarkMode" @handleMovieDetail="handleMovieDetail"/>
            <TopRating :isDarkMode="isDarkMode" @handleMovieDetail="handleMovieDetail"/>
        </template>
        <Footer :isDarkMode="isDarkMode"/>
      </div>
    </div>
  `,
};
