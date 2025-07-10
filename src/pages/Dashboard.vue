<template>
  <div class="container py-5">
    <div class="mb-5 text-center">
      <h1 class="display-4 fw-bold text-primary">Your Dashboard</h1>
      <p class="lead text-muted">Track your deliveries and trips with ease.</p>
    </div>

    <div class="row mb-4 gx-3">
      <div class="col-md-6 col-lg-4 mb-3 mb-md-0">
        <div class="input-group shadow-sm rounded-pill overflow-hidden">
          <span class="input-group-text border-0 bg-white ps-3">
            <i class="bi bi-search text-muted"></i>
          </span>
          <input v-model="searchTerm" type="text" class="form-control border-0 pe-3" placeholder="Search by location or type..." />
        </div>
      </div>
      <div class="col-md-3 col-lg-3 mb-3 mb-md-0">
        <input type="date" v-model="filterStartDate" class="form-control shadow-sm rounded-pill" title="Filter from date" />
      </div>
      <div class="col-md-3 col-lg-3 mb-3 mb-md-0">
        <input type="date" v-model="filterEndDate" class="form-control shadow-sm rounded-pill" title="Filter to date" />
      </div>
      <div class="col-md-12 col-lg-2">
        <button class="btn btn-outline-secondary w-100 shadow-sm rounded-pill" @click="clearFilters">Clear Filters</button>
      </div>
    </div>

    <ul class="nav nav-pills nav-justified mb-4 p-2 bg-light rounded-pill shadow-sm" id="dashboardTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active rounded-pill" id="deliveries-tab" data-bs-toggle="tab" href="#parcels" role="tab">
          <i class="bi bi-box-seam me-2"></i>Your Parcels
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link rounded-pill" id="trips-tab" data-bs-toggle="tab" href="#trips" role="tab">
          <i class="bi bi-truck me-2"></i>Your Trips
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link rounded-pill" id="delivery-parcels" data-bs-toggle="tab" href="#delivery-parcelsu" role="tab">
          <i class="bi bi-patch-check me-2"></i>Confirmed Deliveries
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link rounded-pill" id="messages-tab" data-bs-toggle="tab" href="#messages" role="tab">
          <i class="bi bi-chat-dots me-2"></i>Messages
        </a>
      </li>
    </ul>

    <div class="tab-content" id="dashboardTabsContent">
      <div class="tab-pane fade show active" id="parcels" role="tabpanel">
        <div class="card shadow-sm border-0 rounded-4">
          <div class="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center rounded-top-4">
            <span>Your Delivery Requests</span>
            <span class="badge bg-light text-primary rounded-pill">{{ filteredDeliveries.length }}</span>
          </div>
          <div class="card-body p-0">
            <div v-if="isLoading" class="text-center p-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="text-muted mt-2">Fetching your parcels...</p>
            </div>
            <div v-else>
              <ul v-if="filteredDeliveries.length" class="list-group list-group-flush">
                <li v-for="(item, index) in filteredDeliveries" :key="index" class="list-group-item list-group-item-action p-4">
                  <a href="#" @click.prevent="goToFindCarriers(item.product_id)" class="text-decoration-none text-dark">
                    <div class="d-flex w-100 justify-content-between">
                      <h6 class="mb-1 fw-bold text-truncate">{{ item.item_type }}</h6>
                      <small class="text-muted">Budget: <span class="fw-bold text-success">₹{{ item.budget }}</span></small>
                    </div>
                    <p class="mb-1 text-muted small">
                      <i class="bi bi-geo-alt-fill me-1"></i> {{ item.pickup_address }} <i class="bi bi-arrow-right mx-1"></i> {{ item.dropoff_address }}
                    </p>
                    <small class="text-secondary">
                      <i class="bi bi-calendar me-1"></i> Pickup Date: {{ item.pickup_date }}
                    </small>
                  </a>
                </li>
              </ul>
              <div v-else class="p-4 text-center text-muted">
                <i class="bi bi-box-seam display-4 text-light"></i>
                <p class="mb-0 mt-2">No delivery requests found. Ready to send something?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="trips" role="tabpanel">
        <div class="card shadow-sm border-0 rounded-4">
          <div class="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center rounded-top-4">
            <span>Your Shared Trips</span>
            <span class="badge bg-light text-primary rounded-pill">{{ filteredTrips.length }}</span>
          </div>
          <div class="card-body p-0">
            <div v-if="isLoading" class="text-center p-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="text-muted mt-2">Fetching your trips...</p>
            </div>
            <div v-else>
              <ul v-if="filteredTrips.length" class="list-group list-group-flush">
                <li v-for="(trip, index) in filteredTrips" :key="index" class="list-group-item list-group-item-action p-4">
                  <a href="#" @click.prevent="goToViewRequests(trip.transport_trip_id)" class="text-decoration-none text-dark">
                    <div class="d-flex w-100 justify-content-between">
                      <h6 class="mb-1 fw-bold text-truncate">{{ trip.start_location }} <i class="bi bi-arrow-right mx-1"></i> {{ trip.destination }}</h6>
                      <small class="text-muted">Price/Kg: <span class="fw-bold text-success">₹{{ trip.price_per_kg }}</span></small>
                    </div>
                    <p class="mb-1 text-muted small">
                      <i class="bi bi-calendar me-1"></i> Departs: {{ trip.departure_date }} at {{ trip.departure_time }}
                    </p>
                    <small class="text-secondary">
                      <i class="bi bi-car-fill me-1"></i> Vehicle: {{ trip.vehicle_type }}
                    </small>
                  </a>
                </li>
              </ul>
              <div v-else class="p-4 text-center text-muted">
                <i class="bi bi-truck display-4 text-light"></i>
                <p class="mb-0 mt-2">No trips found. Share your route and earn!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="delivery-parcelsu" role="tabpanel">
        <div class="card shadow-sm border-0 rounded-4">
          <div class="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center rounded-top-4">
            <span>Confirmed Deliveries</span>
            <span class="badge bg-light text-primary rounded-pill">{{ confirmedTrips.length }}</span>
          </div>
          <div class="card-body p-0">
            <div v-if="isLoading" class="text-center p-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="text-muted mt-2">Loading confirmed trips...</p>
            </div>
            <div v-else>
              <ul v-if="confirmedTrips.length" class="list-group list-group-flush">
                <li v-for="(trip, index) in confirmedTrips" :key="index" class="list-group-item list-group-item-action p-4">
                  <a href="#" @click.prevent="goToViewRequests(trip.transport_trip_id)" class="text-decoration-none text-dark">
                    <div class="d-flex w-100 justify-content-between">
                      <h6 class="mb-1 fw-bold text-truncate">{{ trip.start_location }} <i class="bi bi-arrow-right mx-1"></i> {{ trip.destination }}</h6>
                      <small class="text-muted">Price/Kg: <span class="fw-bold text-success">₹{{ trip.price_per_kg }}</span></small>
                    </div>
                    <p class="mb-1 text-muted small">
                      <i class="bi bi-calendar-check-fill me-1"></i> Departs: {{ trip.departure_date }} at {{ trip.departure_time }}
                    </p>
                    <small class="text-secondary">
                      <i class="bi bi-patch-check-fill me-1 text-success"></i> Confirmed by Sender
                    </small>
                  </a>
                </li>
              </ul>
              <div v-else class="p-4 text-center text-muted">
                <i class="bi bi-patch-check display-4 text-light"></i>
                <p class="mb-0 mt-2">No trips confirmed by sender yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="messages" role="tabpanel">
        <div class="card shadow-sm border-0 rounded-4">
          <div class="card-header bg-primary text-white fw-bold rounded-top-4">
            Messages
          </div>
          <div class="card-body p-4 text-center text-muted">
            <i class="bi bi-chat-dots display-4 text-light"></i>
            <p class="mb-0 mt-2">Chat with senders and carriers to coordinate your deliveries and trips.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      deliveryRequests: [],
      tripData: [],
      isLoading: false,
      searchTerm: '',
      filterStartDate: '',
      filterEndDate: '',
      fetchingData: [], // This holds all trip data fetched for confirmedTrips computation
    };
  },
  computed: {
    filteredDeliveries() {
      return this.deliveryRequests
        .filter((item) => {
          const keyword = this.searchTerm.toLowerCase();
          const matchesSearch =
            item.item_type.toLowerCase().includes(keyword) ||
            item.pickup_address.toLowerCase().includes(keyword) ||
            item.dropoff_address.toLowerCase().includes(keyword);

          const itemDate = new Date(item.pickup_date);
          const start = this.filterStartDate ? new Date(this.filterStartDate) : null;
          const end = this.filterEndDate ? new Date(this.filterEndDate) : null;

          const matchesDate =
            (!start || itemDate >= start) && (!end || itemDate <= end);

          return matchesSearch && matchesDate;
        })
        .sort((a, b) => new Date(b.pickup_date) - new Date(a.pickup_date));
    },
    filteredTrips() {
      return this.tripData
        .filter((trip) => {
          const keyword = this.searchTerm.toLowerCase();
          const matchesSearch =
            trip.start_location.toLowerCase().includes(keyword) ||
            trip.destination.toLowerCase().includes(keyword);

          const tripDate = new Date(trip.departure_date);
          const start = this.filterStartDate ? new Date(this.filterStartDate) : null;
          const end = this.filterEndDate ? new Date(this.filterEndDate) : null;

          const matchesDate =
            (!start || tripDate >= start) && (!end || tripDate <= end);

          return matchesSearch && matchesDate;
        })
        .sort((a, b) => new Date(b.departure_date) - new Date(a.departure_date));
    },
    confirmedTrips() {
      return (this.fetchingData || []).filter(
        (trip) => trip.confirmation_done_by_sender !== null
      );
    },
  },
  created() {
    this.fetchData("parcels"); // Fetch data for the default active tab on component creation
  },
  mounted() {
    // Event listener for tab changes
    document.getElementById("dashboardTabs").addEventListener("shown.bs.tab", (event) => {
      const tabId = event.target.getAttribute("href").substring(1);
      this.clearFilters(); // Clear filters when switching tabs
      this.fetchData(tabId); // Fetch data specific to the new tab
      // Original alert functionality preserved
      if (tabId === "delivery-parcelsu") {
        alert("View your confirmed trips");
      } else if (tabId === "messages") {
        alert("Chat with senders and carriers");
      }
    });
  },
  methods: {
    fetchData(tab) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const email = this.$store.getters.getUser.email; // Assuming email is correctly retrieved from Vuex store
      const query = `email=${encodeURIComponent(email)}`;
      this.isLoading = true;

      fetch(`${baseUrl}api/allinfodata?${query}`)
        .then((res) => res.json())
        .then((data) => {
          this.fetchingData = data.tripData || []; // Always update fetchingData to compute confirmedTrips
          if (tab === "parcels") {
            this.deliveryRequests = data.deliveryRequests || [];
          } else if (tab === "trips") {
            this.tripData = data.tripData || [];
          }
          this.isLoading = false;
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          this.isLoading = false;
          // Optionally, show a user-friendly error message
        });
    },
    goToViewRequests(tripId) {
      this.$router.push({ path: "/view-requests", query: { transportTripId: tripId } });
    },
    goToFindCarriers(productId) {
      this.$router.push({ path: "/find-carriers", query: { id: productId } });
    },
    clearFilters() {
      this.searchTerm = '';
      this.filterStartDate = '';
      this.filterEndDate = '';
    },
  },
};
</script>

<style scoped>
/* Custom modern UI styles */
.container {
  max-width: 1200px;
}

.display-4 {
  font-size: 2.5rem;
}

/* Filter inputs */
.form-control.rounded-pill,
.btn.rounded-pill {
  border-radius: 50rem !important; /* Extremely rounded */
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.input-group-text {
  background-color: white;
  border-right: 0;
}

.input-group .form-control {
  border-left: 0;
}

/* Tabs styling */
.nav-pills .nav-link {
  color: var(--bs-dark);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.nav-pills .nav-link.active {
  background-color: var(--bs-primary);
  color: white;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.nav-pills .nav-item {
  flex-grow: 1;
  text-align: center;
}

/* Card styling */
.card {
  border-radius: 1rem !important;
  overflow: hidden;
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.12);
}

.card-header {
  border-bottom: none;
  font-size: 1.1rem;
  padding: 1.25rem 1.5rem;
}

.list-group-item {
  border-color: #eee;
}

.list-group-item-action:hover {
  background-color: var(--bs-light);
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%; /* Adjust based on desired layout */
}

/* Placeholder icons in empty states */
.text-light {
  color: #dee2e6 !important; /* A light grey for icons */
}
</style>