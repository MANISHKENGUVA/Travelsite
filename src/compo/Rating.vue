<template>
  <div class="d-flex align-items-center">
    <span
      v-for="star in 5"
      :key="star"
      class="me-1"
      @click="!readonly && setRating(star)"
      @mouseover="!readonly && (hoverRating = star)"
      @mouseleave="!readonly && (hoverRating = 0)"
      style="cursor: pointer; font-size: 24px;"
    >
      <i
        class="bi"
        :class="[
          showHalfStar(star) ? 'bi-star-half text-warning' :
          (hoverRating || rating) >= star ? 'bi-star-fill text-warning' : 'bi-star text-secondary'
        ]"
      ></i>
    </span>
    <small class="ms-2">{{ ratingDisplay }} / 5</small>
  </div>
</template>
<script>
export default {
  props: {
    initialRating: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rating: this.initialRating,
      hoverRating: 0
    };
  },
  computed: {
    ratingDisplay() {
      return this.rating.toFixed(1);
    }
  },
  methods: {
    setRating(star) {
      this.rating = star;
      this.$emit("rated", this.rating);

      // Optional: save to API
      this.saveRatingToAPI(this.rating);
    },
    showHalfStar(star) {
      return this.readonly && this.rating + 0.5 >= star && this.rating < star;
    },
    async saveRatingToAPI(rating) {
      try {
        const response = await fetch("https://your-api.com/save-rating", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ rating })
        });

        if (!response.ok) throw new Error("Failed to save rating");
        console.log("Rating saved!");
      } catch (error) {
        console.error("Rating save error:", error);
      }
    }
  }
};
</script>
