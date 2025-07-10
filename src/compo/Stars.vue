<template>
  <div class="card h-100 border-0 rounded-4 shadow-lg trust-score-card">
    <div class="card-header bg-white pb-0 px-4 pt-4 border-bottom-0 rounded-top-4">
      <h5 class="card-title d-flex align-items-center mb-0 fw-bold text-dark">
        <i class="bi bi-patch-check-fill text-primary me-2 fs-4"></i> Trust Score
      </h5>
    </div>

    <div class="card-body px-4 py-3 text-center d-flex flex-column justify-content-center">
      <div class="display-4 fw-bolder text-primary mb-1 animated-score">4.9</div> <div class="text-secondary small mb-3 fw-medium">Based on 47 reviews</div>

      <div class="d-flex justify-content-center align-items-center mb-2">
        <i
          v-for="n in 5"
          :key="n"
          class="bi bi-star-fill text-warning me-1"
          :class="{'glow-star': n <= 4}"
          style="font-size: 1.2rem;" ></i>
        <i class="bi bi-star-half text-warning" style="font-size: 1.2rem;"></i> </div>

      <p class="text-muted small mt-2 mb-0">
        Customers consistently rate our service highly.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrustScoreCard',
};
</script>

---

### Styling Enhancements

```vue
<style scoped>
.trust-score-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  position: relative;
  border-radius: 1.5rem !important; /* Softer, modern rounded corners */
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.08) !important; /* Deeper, softer shadow */
}

.trust-score-card:hover {
  transform: translateY(-5px); /* Gentle lift effect on hover */
  box-shadow: 0 1rem 2.5rem rgba(var(--bs-primary-rgb), 0.15) !important; /* Primary-tinted shadow on hover */
}

/* Header Styling */
.card-header {
  border-bottom: none !important; /* Remove default header border */
}

.card-title {
  font-size: 1.4rem; /* Slightly larger title */
  color: var(--bs-dark);
}

/* Trust Score Value */
.display-4 {
  font-size: 3.5rem; /* Significantly larger score */
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(var(--bs-primary-rgb), 0.2); /* Subtle shadow for depth */
}

.fw-bolder {
  font-weight: 900 !important; /* Make the score extra bold */
}

.text-primary {
  color: var(--bs-primary) !important; /* Emphasize with primary color */
}

/* Reviews Count */
.text-secondary {
  color: var(--bs-secondary) !important; /* Consistent muted text */
}

.fw-medium {
  font-weight: 500 !important;
}

/* Star Ratings */
.bi-star-fill, .bi-star-half {
  color: var(--bs-warning) !important; /* Ensure warning color for stars */
  transition: transform 0.2s ease;
}

.bi-star-fill:hover, .bi-star-half:hover {
  transform: scale(1.1); /* Slight pop on star hover */
}

/* Optional: Subtle animation for the score on load/initial display */
.animated-score {
  animation: fadeInScale 0.6s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Optional: Slight glow effect for filled stars */
.glow-star {
  filter: drop-shadow(0 0 3px rgba(255, 193, 7, 0.7));
}

/* Additional descriptive text */
p.text-muted {
  font-size: 0.875rem; /* Standard small text size */
}
</style>