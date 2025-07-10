<template>
  <div class="container py-4">
    <h2 class="mb-4">My Deliveries</h2>
    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" data-bs-toggle="tab" href="#active" role="tab">Active ({{ activeDeliveries.length }})</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" data-bs-toggle="tab" href="#completed" role="tab">Completed ({{ completedDeliveries.length }})</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" data-bs-toggle="tab" href="#cancelled" role="tab">Cancelled ({{ cancelledDeliveries.length }})</a>
      </li>
    </ul>

    <div class="tab-content">
      <!-- Active Deliveries -->
      <div class="tab-pane fade show active" id="active" role="tabpanel">
        <div v-for="delivery in activeDeliveries" :key="delivery.id" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ delivery.itemDescription }}</h5>
            <p class="card-text">
              Status: {{ getStatusLabel(delivery.status) }}<br>
              Type: {{ delivery.itemType }}<br>
              Budget: ${{ delivery.budget }}<br>
              Pickup: {{ delivery.pickupAddress }}<br>
              Dropoff: {{ delivery.dropoffAddress }}
            </p>
            <div class="d-flex flex-wrap gap-2 mt-3">
              <button class="btn btn-outline-primary btn-sm">Chat</button>
              <button class="btn btn-outline-secondary btn-sm">Call</button>
              <button class="btn btn-outline-info btn-sm">View Details</button>
              <button v-if="delivery.status === 'pending'" class="btn btn-outline-danger btn-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Deliveries -->
      <div class="tab-pane fade" id="completed" role="tabpanel">
        <div v-for="delivery in completedDeliveries" :key="delivery.id" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ delivery.itemDescription }}</h5>
            <p class="card-text">
              Status: Delivered<br>
              Type: {{ delivery.itemType }}<br>
              Budget: ${{ delivery.budget }}<br>
              Pickup: {{ delivery.pickupAddress }}<br>
              Dropoff: {{ delivery.dropoffAddress }}
            </p>
            <button class="btn btn-outline-success btn-sm">Rate Carrier</button>
          </div>
        </div>
      </div>

      <!-- Cancelled Deliveries -->
      <div class="tab-pane fade" id="cancelled" role="tabpanel">
        <div v-if="cancelledDeliveries.length === 0" class="text-muted text-center py-4">
          No cancelled deliveries
        </div>
        <div v-else>
          <div v-for="delivery in cancelledDeliveries" :key="delivery.id" class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">{{ delivery.itemDescription }}</h5>
              <p class="card-text">
                Status: Cancelled<br>
                Type: {{ delivery.itemType }}<br>
                Budget: ${{ delivery.budget }}<br>
                Pickup: {{ delivery.pickupAddress }}<br>
                Dropoff: {{ delivery.dropoffAddress }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mockDeliveries = [
  {
    id: "del-1",
    itemType: "Electronics",
    itemDescription: "MacBook Pro laptop",
    pickupAddress: "123 Tech Street, Boston, MA",
    dropoffAddress: "456 Innovation Ave, New York, NY",
    status: "in-transit",
    budget: 40,
  },
  {
    id: "del-2",
    itemType: "Documents",
    itemDescription: "Legal documents envelope",
    pickupAddress: "789 Legal Plaza, Boston, MA",
    dropoffAddress: "321 Business Center, New York, NY",
    status: "matched",
    budget: 25,
  },
  {
    id: "del-3",
    itemType: "Medicine",
    itemDescription: "Prescription medication",
    pickupAddress: "567 Pharmacy Lane, Boston, MA",
    dropoffAddress: "890 Residential St, New York, NY",
    status: "pending",
    budget: 35,
  },
  {
    id: "del-4",
    itemType: "Books",
    itemDescription: "Cancelled book delivery",
    pickupAddress: "Library, Boston, MA",
    dropoffAddress: "College Dorm, New York, NY",
    status: "cancelled",
    budget: 20,
  },
];

const completedDeliveries = [
  {
    id: "del-comp-1",
    itemType: "Electronics",
    itemDescription: "iPhone 15 Pro",
    pickupAddress: "Apple Store, Boston, MA",
    dropoffAddress: "Home Address, New York, NY",
    status: "delivered",
    budget: 30,
  },
];

export default {
  data() {
    return {
      deliveries: mockDeliveries,
      completedDeliveries: completedDeliveries,
    };
  },
  computed: {
    activeDeliveries() {
      return this.deliveries.filter(d => d.status !== 'delivered' && d.status !== 'cancelled');
    },
    cancelledDeliveries() {
      return this.deliveries.filter(d => d.status === 'cancelled');
    },
  },
  methods: {
    getStatusLabel(status) {
      switch (status) {
        case 'pending': return 'Finding Carrier';
        case 'matched': return 'Carrier Assigned';
        case 'picked-up': return 'Picked Up';
        case 'in-transit': return 'In Transit';
        case 'delivered': return 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return status;
      }
    },
  },
};
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
}
</style>
