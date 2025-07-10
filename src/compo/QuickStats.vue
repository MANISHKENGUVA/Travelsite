<template>
  <div class="card h-100 border-0 rounded-4 shadow-lg this-month-card">
    <div class="card-header bg-white pb-0 px-4 pt-4 border-bottom-0 rounded-top-4">
      <h5 class="card-title d-flex align-items-center mb-0 fw-bold text-dark">
        <i class="bi bi-calendar-check-fill text-primary me-2 fs-4"></i> This Month
      </h5>
    </div>

    <div class="card-body p-4">
      <div class="metric-item mb-3 pb-2 border-bottom border-dashed">
        <span class="text-muted fw-medium">Deliveries</span>
        <span class="fw-semibold text-dark fs-5">8</span>
      </div>

      <div class="metric-item mb-3 pb-2 border-bottom border-dashed">
        <span class="text-muted fw-medium">Earnings</span>
        <span class="fw-semibold text-dark fs-5">$240</span>
      </div>

      <div class="metric-item">
        <span class="text-muted fw-medium">Success Rate</span>
        <span class="fw-semibold text-success fs-5">100%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThisMonthCard',
};
</script>

---

### Styling Enhancements

```vue
<style scoped>
.this-month-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  position: relative;
  border-radius: 1.5rem !important; /* Consistent rounded corners with other cards */
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.08) !important; /* Deeper, softer shadow */
}

.this-month-card:hover {
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

/* Icon Styling */
.bi-calendar-check-fill {
  color: var(--bs-primary) !important; /* Use primary color for main icon */
}

/* Metric Items */
.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem; /* Spacing for the border */
}

/* Dashed border for separation */
.border-dashed {
  border-bottom-style: dashed !important;
  border-color: var(--bs-border-color-translucent) !important;
}

.text-muted {
  color: var(--bs-secondary) !important; /* Consistent muted text */
  font-size: 0.95rem; /* Slightly larger for readability */
}

.fw-medium {
  font-weight: 500 !important;
}

.text-dark {
  color: var(--bs-dark) !important; /* Ensure value text is clearly visible */
}

.fs-5 {
  font-size: 1.25rem !important; /* Larger font size for the values */
  font-weight: 600 !important; /* Slightly bolder values */
}

.text-success {
  color: var(--bs-success) !important; /* Ensure success color for success rate */
}
</style>