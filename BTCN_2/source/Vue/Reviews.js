import fetch from "./DB_provider.js";

export default {
  props: ["isDarkMode", "id"],
  data() {
    return {
      reviews: [],
      firstReview: null,
    };
  },
  methods: {
    async loadReviews() {
      let data = await fetch(`detail/reviews/${this.id}`);
      if (data.items.length == 0) return;
      this.reviews = data.items[0].splice(0, 5);
      this.firstReview = this.reviews.splice(0, 1);
    },
  },
  mounted() {
    this.loadReviews();
  },
  template: `
  <div v-if="reviews.length > 0">
  <h2 class="mt-4" :class="isDarkMode?'text-white':''">Reviews</h2>
  <div id="carouselExampleControlsNoTouching" class="carousel slide mb-4" data-bs-touch="false">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <div class="card" :data-bs-theme="isDarkMode?'dark':'light'">
            <div class="card-body">
              <h5 class="card-title">From: {{firstReview[0].username}}</h5>
              <p class="card-text">{{firstReview[0].content}}</p>
            </div>
        </div>
      </div>
      <div class="carousel-item" v-for ="review in reviews">
        <div class="card" :data-bs-theme="isDarkMode?'dark':'light'">
            <div class="card-body">
                <h5 class="card-title">From: {{review.username}}</h5>
                <p class="card-text">{{review.content}}</p>
            </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
        <span class="carousel-control-prev-icon ml-2" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
  </div>
  </div>
  
  `,
};
