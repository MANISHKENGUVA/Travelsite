<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-4">
    <div class="alert alert-danger shadow-lg border-3 border-danger-subtle rounded-4 py-4 px-5 w-100 mw-md animate__animated animate__zoomIn">
      <i class="bi bi-shield-exclamation-fill display-1 text-danger mb-3"></i>
      <h1 class="fw-bold display-5 text-danger mb-2">Access Denied</h1>
      <p class="fs-5 text-dark">You do not have permission to view this page or perform this action.</p>
      <router-link to="/" class="btn btn-danger btn-lg mt-3 px-4 rounded-pill">
        <i class="bi bi-house-door-fill me-2"></i> Return Home
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessDenied'
};
</script>

<style scoped>
.mw-md {
  max-width: 600px;
}

body.theme-dark .bg-light {
  background-color: #1a1a1a !important;
  color: #e0e0e0;
}

body.theme-dark .alert-danger {
  background-color: #2b0000;
  border-color: #a00;
  color: #ffcccc;
}

body.theme-dark .btn-danger {
  background-color: #c0392b;
  border-color: #c0392b;
}

body.theme-dark .btn-danger:hover {
  background-color: #e74c3c;
  border-color: #e74c3c;
}
</style>
