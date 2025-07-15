<template>
  <div :class="`theme-${currentTheme}`">
    <div class="container py-4">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-outline-secondary btn-sm" @click="toggleTheme">
          <i :class="themeIcon"></i>
        </button>
      </div>

      <div v-if="isLoading" class="card p-4 rounded-4 shadow-sm">
        <div class="placeholder-glow">
          <div class="placeholder col-6 mb-2"></div>
          <div class="placeholder col-4 mb-2"></div>
          <div class="placeholder col-7 mb-2"></div>
          <div class="placeholder col-5 mb-2"></div>
        </div>
      </div>

      <div v-else-if="acceptedbythetransporter && acceptedbythetransporter.accepted_by_which_transporter?.[0]"
        class="card p-4 rounded-4 shadow-lg animate__animated animate__fadeIn">
        <div class="d-flex flex-column flex-lg-row gap-4">{{acceptedbythetransporter}}
          <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
            style="width: 70px; height: 70px; font-size: 1.5rem;">
            {{ getInitials(acceptedbythetransporter.email) }}
          </div>
          <div class="flex-grow-1">
            <h5 class="fw-semibold text-primary mb-2">{{ acceptedbythetransporter.email }}</h5>
            <p class="mb-1 text-muted"><i class="bi bi-geo-alt me-1"></i>{{ acceptedbythetransporter.pickup_address }} →
              {{ acceptedbythetransporter.dropoff_address }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-calendar me-1"></i>{{ acceptedbythetransporter.pickup_date }} ({{
              acceptedbythetransporter.delivery_timeframe }})</p>
            <p class="mb-1 text-muted"><i class="bi bi-person me-1"></i>Receiver: {{
              acceptedbythetransporter.receiver_name }} ({{ acceptedbythetransporter.receiver_phone }})</p>
            <p class="mb-1 text-muted"><i class="bi bi-currency-rupee me-1"></i>Budget: ₹{{
              acceptedbythetransporter.budget }}</p>
            <p class="mb-1 text-muted"><i class="bi bi-info-circle me-1"></i>{{
              acceptedbythetransporter.item_description }}</p>
            <div class="mt-2">
              <span v-for="(tag, i) in acceptedbythetransporter.special_requirements" :key="i"
                class="badge bg-warning text-dark me-1">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="text-end">
            <p class="mb-1 text-muted"><i class="bi bi-truck me-1"></i>Accepted By:</p>
            <h6 class="text-success">{{ acceptedbythetransporter.accepted_by_which_transporter[0]?.split('@')[0] }}</h6>
            <p class="text-muted small">Trip ID: {{ acceptedbythetransporter.accepted_travel_id }}</p>
            <div class="d-flex mt-3">
              <button v-if="!acceptedbythetransporter.confirmation_by_sender" @click="submitAcceptance"
                class="btn btn-outline-primary btn-sm w-100">
                Confirm Acceptance
              </button>
              <div v-else class="confirmation-badge mt-2">✔</div>
              <p class="text-muted small mt-2">Status: {{ acceptedbythetransporter.confirmation_by_sender }}</p>
            </div>
          </div>
        </div>
        <div class="card shadow-sm p-3 mt-4">
          <h5 class="text-primary">Offers Available</h5>
          <div class="mb-3">
            <select class="form-select" v-model="selectedOffer">
              <option disabled value="">Select an Offer</option>
              <option v-for="offer in acceptedOffers" :key="offer.transport_trip_id" :value="offer">
                {{ offer.email }} | {{ offer.start_location }} → {{ offer.destination }} | ₹{{ offer.price_per_kg }}/kg
              </option>
            </select>
          </div>

          <div v-if="selectedOffer" class="border p-3 rounded-3 bg-light">
            <div>{{ selectedOffer.transport_trip_id }}</div>
            <h6>{{ selectedOffer.email }}</h6>
            <div>{{ $route.query.id }}</div>
            <div>{{ selectedOffer.offered_by[0] }}</div>

            <div class="d-flex flex-row justify-content-between ">
              <div>
                <h6>{{ selectedOffer.email }}</h6>
              </div>
              <div>
                <button class="btn btn-success btn-sm mt-2"
                  @click="viewOffer(selectedOffer.transport_trip_id, selectedOffer.email, $route.query.id, selectedOffer.offered_by[0])">
                  <i class="bi bi-arrow-up-right-square-fill"></i> View Offer
                </button>
              </div>
            </div>
            <p><i class="bi bi-geo-alt me-1"></i>{{ selectedOffer.start_location }} → {{ selectedOffer.destination }}</p>
            <p><i class="bi bi-truck"></i> {{ selectedOffer.vehicle_type }}</p>
            <p><i class="bi bi-currency-rupee"></i> ₹{{ selectedOffer.price_per_kg }}/kg</p>
            <p><i class="bi bi-card-text"></i> {{ selectedOffer.additional_notes }}</p>

            <button class="btn btn-success btn-sm mt-2"
              @click="confirmOffer(selectedOffer.transport_trip_id, acceptedbythetransporter.product_id)"
              :disabled="!!acceptedbythetransporter.confirmation_by_sender">
              {{ selectedOffer.transport_trip_id !== acceptedbythetransporter.confirmation_by_sender ?
                acceptedbythetransporter.confirmation_by_sender ? 'Confirm This Offer' : 'Confirm Offer' : 'you condirmed it Already Confirmed'
              }}
            </button>
          </div>
        </div>

        <div v-if="acceptedbythetransporter.confirmation_by_sender" class="mt-4">
          <h5 class="text-secondary">Carrier's Uploaded Files</h5>
          <button class="btn btn-outline-info btn-sm mb-3" @click="fetchCarrierUploadedFiles"
            :disabled="fetchingCarrierFiles">
            <span v-if="fetchingCarrierFiles">Fetching...</span>
            <span v-else>Fetch Files</span>
          </button>

          <div v-if="carrierUploadedBlobUrls.length">
            <h6 class="fw-bold">Uploaded Files:{{ carrierUploadedBlobUrls }}</h6>
            <div class="row gx-3 gy-3">
              <div v-for="(url, i) in carrierUploadedBlobUrls" :key="'uploaded-preview-' + i" class="col-md-4 col-sm-6">
                <div class="file-preview-card border rounded shadow-sm overflow-hidden">
                  <img v-if="isImage(carrierUploadedBlobs[i])" :src="url" class="img-fluid rounded" alt="Uploaded image" />
                  <video v-else-if="isVideo(carrierUploadedBlobs[i])" :src="url" controls
                    class="img-fluid rounded"></video>
                  <a v-else :href="url" target="_blank"
                    class="d-block p-3 text-center text-decoration-none text-primary">
                    <i class="bi bi-file-earmark-arrow-down fs-1"></i>
                    <p class="mb-0">Download File {{ i + 1 }}</p>
                  </a>
                  <div class="file-info p-2 bg-light border-top">
                    <small class="d-block">Size: {{ (carrierUploadedBlobs[i].size / 1024).toFixed(2) }} KB</small>
                    <small class="d-block">Type: {{ carrierUploadedBlobs[i].type }}</small>
                  </div>
                </div>
              </div>
            </div>
          
          </div>
          <p v-else-if="!fetchingCarrierFiles && acceptedbythetransporter.confirmation_by_sender"
            class="text-muted small">No files uploaded by the carrier yet.</p>
        </div>
        <div class="mt-4" v-if="carrierUploadedBlobs.length">
          <div class="card shadow-sm border-0 bg-light">
            <div class="card-body text-center">
              <h5 class="card-title text-primary mb-3">
                Share This OTP with the Delivery Person
              </h5>

              <div class="display-4 fw-bold text-dark mb-3">
                {{ acceptedbythetransporter.otp }}
              </div>

              <button class="btn btn-outline-success px-4 py-2">
                <i class="bi bi-chat-left-text me-2"></i> Tell OTP
              </button>
            </div>
          </div>
        </div>



         <!-- <h5 class="text-secondary">Carrier's Uploaded Files</h5>
          <button class="btn btn-outline-info btn-sm mb-3" @click="fetchlastCarrierUploadedFiles"
            :disabled="fetchingCarrierFiles">
            <span v-if="fetchingCarrierFiles">Fetching...</span>
            <span v-else>last section Fetch Files last sect{{lastSectionImages}}ion</span>
          </button> -->

          <h5   v-if="carrierUploadedBlobs.length" class="text-secondary">Carrier's Uploaded Files</h5>
<button class="btn btn-outline-info btn-sm mb-3" @click="fetchlastCarrierUploadedFiles"
  :disabled="fetchingLastSectionImages"> <span v-if="fetchingLastSectionImages">Fetching...</span>
  <span v-else>Fetch Last Section Files</span>
</button>

<div v-if="lastSectionImageUrls.length > 0" class="image-gallery mt-3">
  <h6>Last Section Images:</h6>
  <div class="row">
    <div class="col-md-4 col-sm-6 mb-3" v-for="(imageUrl, index) in lastSectionImageUrls" :key="index">
      <div class="card">
        <img :src="imageUrl" class="card-img-top img-fluid" alt="Last Section Image" style="max-height: 200px; object-fit: cover;">
        <div class="card-body">
          <p class="card-text text-muted small">Image {{ index + 1 }}</p>
          <a :href="imageUrl" :download="`last_section_image_${index + 1}.png`" class="btn btn-sm btn-outline-primary">Download</a>
        </div>
      </div>
    </div>
  </div>
</div>
<div v-else-if="!fetchingLastSectionImages">
  <p class="text-muted mt-3">No last section images available or fetched yet.</p>
</div>


        


        <div class="mt-4" v-if="lastSectionImageUrls.length">
          <h5 class="text-secondary">Rate this Delivery Person</h5>
          <div class="d-flex align-items-center gap-2">
            <div class="rating-stars">
              <i v-for="n in 5" :key="n" class="bi"
                :class="userRating >= n ? 'bi-star-fill text-warning' : 'bi-star text-secondary'" @click="setRating(n)"
                style="cursor: pointer; font-size: 1.4rem;"></i>
            </div>
            <button class="btn btn-success btn-sm"
              @click="submitRating(acceptedbythetransporter.accepted_by_which_transporter)"
              :disabled="!userRating || ratingSubmitted">
              {{ ratingSubmitted ? 'Submitted' : 'Submit Rating' }}
            </button>
          </div>
          <p v-if="ratingSubmitted" class="text-success mt-2">Thanks for rating!</p>
        </div>
      </div>

      <div v-else>
        <div class="d-flex align-items-start mb-4">
          <button class="btn btn-light me-3" @click="goBack">
            <i class="bi bi-arrow-left"></i>
          </button>
          <div>
            <h2 class="fw-bold mb-1">Available Carriers</h2>
            <p class="text-muted">{{ filteredCarriers.length }} carriers found</p>
          </div>
        </div>

        <div class="card shadow-sm border-0 p-3 mb-4">
          <div class="row gy-2">
            <div class="col-md-3">
              <label class="form-label small text-muted">Vehicle Type</label>
              <select class="form-select" v-model="filters.vehicle">
                <option value="">All</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small text-muted">Start Location</label>
              <input type="text" class="form-control" v-model="filters.startLocation" placeholder="e.g., Mumbai" />
            </div>
            <div class="col-md-3">
              <label class="form-label small text-muted">Destination</label>
              <input type="text" class="form-control" v-model="filters.destination" placeholder="e.g., Delhi" />
            </div>
            <div class="col-md-3">
              <label class="form-label small text-muted">Sort By</label>
              <select class="form-select" v-model="sortBy">
                <option value="">Default</option>
                <option value="time">Departure Time</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
            <div class="col-12 mt-2">
              <label class="form-label small text-muted">Search Email / Notes</label>
              <input type="text" class="form-control" v-model="searchQuery" placeholder="Search..." />
            </div>
          </div>
          <div class="d-flex justify-content-end mt-3">
            <button class="btn btn-sm btn-outline-secondary" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i> Clear Filters
            </button>
          </div>
        </div>

        <div v-if="paginatedCarriers.length" class="row gy-4">
          <div class="col-12" v-for="carrier in paginatedCarriers" :key="carrier.transport_trip_id">
            <div class="carrier-card card p-4 shadow-sm border-0 rounded-4 animate__animated animate__fadeInUp">
              <div class="d-flex flex-column flex-lg-row align-items-start gap-4">
                {{ carrier }}
                <div
                  class="carrier-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                  <span class="fw-bold">{{ getInitials(carrier.email) }}</span>
                </div>

                <div class="flex-grow-1">
                  <h5 class="mb-1 text-dark fw-semibold">{{ carrier.email }}</h5>

                  <p class="text-muted small mb-1"><i class="bi bi-geo-alt-fill me-1 text-info"></i><span
                      class="fw-medium">{{ carrier.start_location }}</span> <i class="bi bi-arrow-right mx-1"></i> <span
                      class="fw-medium">{{ carrier.destination }}</span></p>
                  <p class="text-muted small mb-1"><i class="bi bi-calendar-event me-1 text-success"></i>{{
                    carrier.departure_date }} at {{ carrier.departure_time }}</p>

                  <p class="text-muted small mb-1"><i class="bi bi-truck-flatbed me-1 text-primary"></i>Vehicle: <span
                      class="fw-medium text-capitalize">{{ carrier.vehicle_type }}</span></p>
                  <p class="text-muted small mb-1"><i class="bi bi-box-seam me-1 text-secondary"></i>Max Package: <span
                      class="fw-medium">{{ carrier.max_package_size || 'Not Specified' }}</span></p>

                  <div class="item-badges mt-2 d-flex flex-wrap gap-2">
                    <span v-if="carrier.accept_documents"
                      class="badge bg-secondary-subtle text-secondary fw-medium px-3 py-2 rounded-pill">Documents</span>
                    <span v-if="carrier.accept_medicine"
                      class="badge bg-danger-subtle text-danger fw-medium px-3 py-2 rounded-pill">Medicine</span>
                    <span v-if="carrier.accept_electronics"
                      class="badge bg-info-subtle text-info fw-medium px-3 py-2 rounded-pill">Electronics</span>
                    <span v-if="carrier.accept_fragile"
                      class="badge bg-warning-subtle text-warning fw-medium px-3 py-2 rounded-pill">Fragile</span>
                    <span v-if="carrier.has_insurance"
                      class="badge bg-success-subtle text-success fw-medium px-3 py-2 rounded-pill">Insured</span>
                  </div>

                  <p class="mt-2 small text-muted fst-italic">{{ carrier.additional_notes }}</p>
                </div>

                <div class="text-lg-end text-start mt-3 mt-lg-0 flex-shrink-0">
                  <h4 class="text-primary fw-bold mb-3">₹{{ carrier.price_per_kg }}/kg</h4>

                  <div class="d-grid gap-2">
                    <button class="btn btn-primary btn-lg rounded-pill px-4" :disabled="selectedCarrier"
                      @click="selectCarrier(carrier.transport_trip_id)">
                      <i v-if="selectedCarrier === carrier.transport_trip_id" class="bi bi-check-circle-fill me-2"></i>
                      {{ selectedCarrier === carrier.transport_trip_id ? 'Selected!' : 'Select Carrier' }}
                    </button>
                    <button class="btn btn-outline-secondary btn-lg rounded-pill px-4">
                      <i class="bi bi-chat-dots me-2"></i> Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 d-flex justify-content-center">
            <nav aria-label="Carrier Pagination">
              <ul class="pagination pagination-modern shadow-sm rounded-pill">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page"
                  :class="{ active: page === currentPage }">
                  <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-truck fs-2 text-muted mb-3"></i>
          <h5>No carriers found</h5>
          <p class="text-muted">Try adjusting your filters or search.</p>
          <button class="btn btn-outline-primary" @click="goBack">Modify Request</button>
        </div>
      </div>

      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div v-if="toastMessage" class="toast align-items-center show" :class="toastClass" role="alert">
          <div class="d-flex">
            <div class="toast-body">{{ toastMessage }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
              @click="toastMessage = ''"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encryptUserData } from "../cry";

export default {
  name: "FindCarriers",

  data() {
    return {
      isLoading: true,
      acceptedbythetransporter: null,
      carriers: [],
      acceptedOffers: [],
      selectedOffer: null,
      selectedCarrier: null,
      userRating: 0,
      ratingSubmitted: false, // Initial state

      ratingSubmitted: false,
      carrierUploadedBlobs: [],
      carrierUploadedBlobUrls: [],
      fetchingCarrierFiles: false,
      toastMessage: '',
      toastType: 'success', // Added to control toast color
      currentTheme: localStorage.getItem('theme') || 'light',
      filters: {
        vehicle: '',
        startLocation: '',
        destination: ''
      },
       lastSectionImages: [], // To store Blob objects for last section images
    lastSectionImageUrls: [], // To store object URLs for displaying last section images
    fetchingLastSectionImages: false, 
      sortBy: '',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
      deliveryConfirmed: false,
    };
  },
  computed: {
    themeIcon() {
      return this.currentTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    },
    toastClass() {
      return `text-bg-${this.toastType}`;
    },
    filteredCarriers() {
      let result = this.carriers;

      // Apply search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(c =>
          c.email?.toLowerCase().includes(query) ||
          c.additional_notes?.toLowerCase().includes(query)
        );
      }

      // Apply filters
      if (this.filters.vehicle) {
        result = result.filter(c => c.vehicle_type === this.filters.vehicle);
      }
      if (this.filters.startLocation) {
        result = result.filter(c => c.start_location?.toLowerCase().includes(this.filters.startLocation.toLowerCase()));
      }
      if (this.filters.destination) {
        result = result.filter(c => c.destination?.toLowerCase().includes(this.filters.destination.toLowerCase()));
      }

      // Apply sorting
      if (this.sortBy === "time") {
        result = result.sort((a, b) =>
          new Date(`${a.departure_date} ${a.departure_time}`) - new Date(`${b.departure_date} ${b.departure_time}`)
        );
      } else if (this.sortBy === "priceLow") {
        result = result.sort((a, b) => a.price_per_kg - b.price_per_kg);
      } else if (this.sortBy === "priceHigh") {
        result = result.sort((a, b) => b.price_per_kg - a.price_per_kg);
      }
      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredCarriers.length / this.itemsPerPage);
    },
    paginatedCarriers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredCarriers.slice(start, start + this.itemsPerPage);
    }
  },
  mounted() {
    this.toggleBodyTheme();
    this.fetchDeliveryData();
    this.fetchCarriers();
    const { source, destination } = this.$route.query;
    if (source) this.filters.startLocation = source;
    if (destination) this.filters.destination = destination;
  },
  methods: {
async fetchlastCarrierUploadedFiles() {
  this.fetchingLastSectionImages = true;
  this.lastSectionImages = [];
  this.lastSectionImageUrls = [];

  try {
    const { product_id, confirmation_by_sender, accepted_by_which_transporter } = this.acceptedbythetransporter;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!product_id || !confirmation_by_sender || !accepted_by_which_transporter?.[0]) {
      this.showToast("Missing essential details to fetch last section images.", "danger");
      return;
    }

    const transporterEmail = accepted_by_which_transporter[0];

    const res = await fetch(`${baseUrl}get-last-section-images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product_id,
        confirmationBySender: confirmation_by_sender,
        email: transporterEmail
      })
    });

    if (!res.ok) {
      const errorResult = await res.json();
      console.error("API Error fetching last section images:", errorResult.error || errorResult.message);
      this.showToast(errorResult.error || errorResult.message || "Failed to fetch last section images.", "danger");
      return;
    }

    const result = await res.json();

    if (!result.data || result.data.length === 0) {
      this.showToast("No last section images uploaded yet for this trip.", "info");
      return;
    }

    const blobs = [];
    // Iterate through each record received from the server
    for (const record of result.data) {
      // Check for 'cnfdeliverylast' image data
      if (record.cnfdeliverylast) {
        try {
          const byteCharacters = atob(record.cnfdeliverylast.split(",")[1]);
          const byteNumbers = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          // Assuming a common image type if not explicitly stored, e.g., 'image/jpeg' or 'image/png'
          // You might need to infer type from the base64 prefix (e.g., data:image/png;base64,...)
          const fileType = record.cnfdeliverylast.split(',')[0].split(';')[0].split(':')[1] || 'image/jpeg';
          blobs.push(new Blob([byteNumbers], { type: fileType }));
        } catch (decodeError) {
          console.error("Error decoding cnfdeliverylast image:", decodeError);
        }
      }

      // Check for 'signature' image data
      if (record.signature) {
        try {
          const byteCharacters = atob(record.signature.split(",")[1]);
          const byteNumbers = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const fileType = record.signature.split(',')[0].split(';')[0].split(':')[1] || 'image/png'; // Signatures are often PNGs
          blobs.push(new Blob([byteNumbers], { type: fileType }));
        } catch (decodeError) {
          console.error("Error decoding signature image:", decodeError);
        }
      }
      this.checkExistingRating();
    }

    this.lastSectionImages = blobs;
    this.lastSectionImageUrls = blobs.map(blob => URL.createObjectURL(blob));

    if (blobs.length > 0) {
      this.showToast("Last section images fetched successfully!", "success");
    } else {
      this.showToast("No valid last section images found in the response.", "info");
    }

  } catch (err) {
    console.error("Network or unexpected error fetching last section images:", err);
    this.showToast("An unexpected error occurred.", "danger");
  } finally {
    this.fetchingLastSectionImages = false;
  }
},
 
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.currentTheme);
      this.toggleBodyTheme();
    },
    toggleBodyTheme() {
      document.body.className = this.currentTheme === 'dark' ? 'bg-dark text-white' : '';
    },
    getInitials(email) {
      return email?.charAt(0)?.toUpperCase() || '?';
    },
    async fetchDeliveryData() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const productId = this.$route.query.id;
        const email = this.$store.getters.getUser.email;
        const res = await fetch(`${baseUrl}acceptedbythetransporter?productId=${productId}&email=${email}`);
        const data = await res.json();
        this.acceptedbythetransporter = data?.data?.[0] || null;
        if (this.acceptedbythetransporter?.accepted_by_which_transporter?.[0]) {
          await this.checkExistingRating();
        }
        await this.fetchAcceptedTrips();
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAcceptedTrips() {
      const ids = this.acceptedbythetransporter?.accepted_travel_id || [];
      if (!ids.length) return;
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}get-trips-by-ids`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids })
        });
        const data = await res.json();
        this.acceptedOffers = data?.data || [];
      } catch (err) {
        console.error("Trip fetch error:", err);
      }
    },
    async confirmOffer(tripId, productId) {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        await fetch(`${baseUrl}acceptedbytheperson?tripid=${tripId}&productId=${productId}`, {
          method: "POST"
        });
        this.showToast("Delivery accepted!", "success");
        await this.fetchDeliveryData();
      } catch (err) {
        console.error("Submit acceptance failed", err);
        this.showToast("Failed to accept delivery.", "danger");
      }
    },
    async fetchCarrierUploadedFiles() {
      this.fetchingCarrierFiles = true;
      this.carrierUploadedBlobs = [];
      this.carrierUploadedBlobUrls = [];
      try {
        const { product_id, confirmation_by_sender, accepted_by_which_transporter } = this.acceptedbythetransporter;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}get-photoupload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product_id,
            confirmationBySender: confirmation_by_sender,
            email: accepted_by_which_transporter?.[0]
          })
        });
        const result = await res.json();
        const blobs = [];
        for (const record of result.data || []) {
          for (const file of record.files || []) {
            const byteCharacters = atob(file.base64.split(",")[1]);
            const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
            blobs.push(new Blob([new Uint8Array(byteNumbers)], { type: file.type }));
          }
        }
        this.carrierUploadedBlobs = blobs;
        this.carrierUploadedBlobUrls = blobs.map(blob => URL.createObjectURL(blob));
        if (blobs.length > 0) {
          this.showToast("Files fetched successfully!", "success");
        } else {
          this.showToast("No files uploaded by the carrier yet.", "info");
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        this.showToast("Failed to fetch carrier files.", "danger");
      } finally {
        this.fetchingCarrierFiles = false;
      }
    },
    isImage(blob) {
      return blob?.type?.startsWith("image/");
    },
    isVideo(blob) {
      return blob?.type?.startsWith("video/");
    },
    viewOffer(Transid, transmailid, prodid, prodmailid) {
      console.log("View Offer clicked", Transid, transmailid, prodid, prodmailid);

      const datatopage = {
        transid: Transid,
        transmailid: transmailid,
        prodid: prodid,
        prodmailid: prodmailid
      };

      const encrypted = encryptUserData(datatopage);

      this.$router.push({
        path: `/new-request/${prodid}`,
        query: {
          id: encrypted
        }
      });
    },

    async submitAcceptance() {
      try {
        const { accepted_travel_id, product_id } = this.acceptedbythetransporter;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        await fetch(`${baseUrl}acceptedbytheperson?tripid=${accepted_travel_id}&productId=${product_id}`, {
          method: "POST"
        });
        this.showToast("Delivery accepted!", "success");
        await this.fetchDeliveryData();
      } catch (err) {
        console.error("Submit acceptance failed", err);
        this.showToast("Failed to submit acceptance.", "danger");
      }
    },
    // async submitRating(mailidtraveler) {
    //   try {
    //     const { product_id, confirmation_by_sender} = this.acceptedbythetransporter;
    //     const baseUrl = import.meta.env.VITE_API_BASE_URL;
    //     const res = await fetch(`${baseUrl}add-rating`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         product_id,
    //         travelid: confirmation_by_sender,
    //         rating: this.userRating,
    //         mailidtraveler: mailidtraveler[0]
    //       })
    //     });
    //     const result = await res.json();
    //     if (res.ok || res.status === 409) {
    //       this.showToast("Thank you for rating!", "success");
    //       this.ratingSubmitted = true;
    //     } else {
    //       this.showToast("Failed to rate: " + result.error, "danger");
    //     }
    //   } catch (err) {
    //     console.error("Rating error:", err);
    //     this.showToast("An error occurred while rating.", "danger");
    //   }
    // },
  


  
  async submitRating(mailidtraveler) {
  try {
    const { product_id, confirmation_by_sender } = this.acceptedbythetransporter;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    // Make the API call to your backend
    const res = await fetch(`${baseUrl}add-rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id,
        travelid: confirmation_by_sender, // This is likely the ID of the traveler/transporter
        rating: this.userRating,
        mailidtraveler: mailidtraveler[0] // Assuming mailidtraveler is an array and you want the first element
      })
    });

    const result = await res.json(); // Parse the JSON response from the server

    // Handle API responses
    if (res.ok || res.status === 409) {
      // If the request was successful (2xx) or a 409 Conflict (already rated)
      this.showToast("Already rated!", "danger");
      this.ratingSubmitted = true;
      this.rating='' // Disable the submit button and show 'Submitted'
    } else {
      // If there was any other error status from the server
      this.showToast("Failed to rate: " + result.error, "danger");
    }
  } catch (err) {
    // Catch any network errors or issues before the server responds
    console.error("Rating error:", err);
    this.showToast("An error occurred while rating.", "danger");
  }
},
  
  
    async checkExistingRating() {
      try {
        const { product_id, accepted_travel_id } = this.acceptedbythetransporter;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseUrl}ratings?product_id=${product_id}&travelid=${accepted_travel_id}`);
        const result = await res.json();
        if (Array.isArray(result.data) && result.data.length > 0) {
          this.userRating = result.data[0].rating;
          this.ratingSubmitted = true;
        }
      } catch (err) {
        console.error("Rating fetch error:", err);
      }
    },
    fetchCarriers() {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      fetch(`${baseUrl}api/fetch-carriers`)
        .then(res => res.json())
        .then(data => {
          this.carriers = data;
        })
        .catch(err => console.error("Error fetching carriers:", err));
    },
    clearFilters() {
      this.filters = { vehicle: '', startLocation: '', destination: '' };
      this.sortBy = '';
      this.searchQuery = '';
      this.currentPage = 1;
    },
    goBack() {
      this.$router.push("/post-delivery");
    },
    selectCarrier(transportTripId) {
      this.selectedCarrier = transportTripId;
      const deliveryData = {
        requestId: this.$route?.query?.id || null,
        carrierId: transportTripId,
        email: this.$store.getters.getUser.email,
        status: "carrier-selected",
        selectedAt: new Date().toISOString(),
        transport_trip_id: transportTripId
      };
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      fetch(`${baseUrl}api/offer-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            this.showToast("Server Error: " + data.error, "danger");
          } else {
            this.showToast("Carrier selected successfully!", "success");
            setTimeout(() => {
              this.$router.push({ path: "/dashboard" });
            }, 1000);
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
          this.showToast("Failed to submit the request.", "danger");
        });
    },
    setRating(n) {
      if (!this.ratingSubmitted) this.userRating = n;
    },
    async confirmDeliverylast(productId, confirmedTripId, otp) {
      if (!productId || !confirmedTripId || !otp) {
        this.showToast('Missing essential delivery details.', 'danger');
        return;
      }
      if (this.deliveryConfirmed) {
        this.showToast('Delivery already confirmed.', 'info');
        return;
      }

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}cnfdeliverylast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: productId,
            confirmation_by_sender: confirmedTripId,
            otp: otp
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        this.showToast('Delivery confirmed successfully!', 'success');
        this.deliveryConfirmed = true;
        await this.fetchDeliveryData();

      } catch (error) {
        console.error('Error confirming delivery:', error);
        this.showToast(`Failed to confirm delivery: ${error.message}`, 'danger');
      }
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type; // Set the type for dynamic class binding
      setTimeout(() => {
        this.toastMessage = '';
        this.toastType = 'success'; // Reset to default
      }, 3000);
    }
  }
};
</script>

<style scoped>
/* Modern UI polish */
.placeholder {
  background-color: #e0e0e0;
  border-radius: 0.25rem;
}

.theme-dark {
  background-color: #121212;
  color: #fff;
}

.theme-dark .card {
  background-color: #1e1e1e;
  color: #fff;
}

.theme-dark .form-control,
.theme-dark .form-select {
  background-color: #2c2c2c;
  border-color: #444;
  color: #fff;
}

.theme-dark .form-control::placeholder {
  color: #bbb;
}

.theme-dark .btn-outline-dark {
  color: #fff;
  border-color: #ccc;
}

/* Updated toast styles to use text-bg-* classes */
.toast.text-bg-success {
  background-color: var(--bs-success) !important;
  color: #fff !important;
}

.toast.text-bg-danger {
  background-color: var(--bs-danger) !important;
  color: #fff !important;
}

.toast.text-bg-info {
  background-color: var(--bs-info) !important;
  color: #fff !important;
}

.theme-dark .toast {
  /* You might want to fine-tune dark theme toast colors */
  background-color: #333 !important;
  color: #fff !important;
}

/* Carrier Card Styles */
.carrier-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-radius: 1.25rem !important;
  /* Slightly more rounded */
  overflow: hidden;
  /* Ensures content respects border-radius */
}

.carrier-card:hover {
  transform: translateY(-5px);
  /* Lift effect on hover */
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.08) !important;
  /* Stronger shadow on hover */
}

.carrier-avatar {
  width: 70px;
  /* Slightly larger avatar */
  height: 70px;
  font-size: 1.6rem;
  /* Adjust font size for initials */
  flex-shrink: 0;
  /* Prevent shrinking when content is long */
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  /* Subtle shadow for avatar */
  border: 3px solid var(--bs-white);
  /* White border around avatar */
}

/* Text and Icon Colors */
.text-dark {
  color: var(--bs-dark) !important;
}

.text-muted {
  color: var(--bs-secondary) !important;
}

.fw-semibold {
  font-weight: 600 !important;
}

.fw-medium {
  font-weight: 500 !important;
}

/* Item Badges (New subtle badge classes) */
.item-badges .badge {
  font-size: 0.8rem;
  /* Slightly larger font for badges */
  letter-spacing: 0.02em;
}

/* Icons within text */
.text-info {
  color: var(--bs-info) !important;
}

.text-success {
  color: var(--bs-success) !important;
}

.text-primary {
  color: var(--bs-primary) !important;
}

.text-secondary {
  color: var(--bs-secondary) !important;
}

/* Buttons */
.btn-primary.rounded-pill {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
  box-shadow: 0 0.3rem 0.7rem rgba(var(--bs-primary-rgb), 0.2);
  transition: all 0.2s ease;
}

.btn-primary.rounded-pill:hover {
  background-color: var(--bs-primary-dark);
  /* Slightly darker primary on hover */
  border-color: var(--bs-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.3);
}

.btn-outline-secondary.rounded-pill {
  border: 1px solid var(--bs-secondary);
  color: var(--bs-secondary);
  transition: all 0.2s ease;
}

.btn-outline-secondary.rounded-pill:hover {
  background-color: var(--bs-secondary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 0.3rem 0.7rem rgba(var(--bs-secondary-rgb), 0.1);
}

/* Pagination Styles */
.pagination-modern .page-item .page-link {
  border-radius: 50rem !important;
  /* Fully rounded pills */
  margin: 0 0.25rem;
  /* Space between pills */
  min-width: 40px;
  /* Ensure a decent width for numbers */
  text-align: center;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  color: var(--bs-dark);
  border: 1px solid var(--bs-light);
  /* Softer border */
  background-color: var(--bs-white);
}

.pagination-modern .page-item:first-child .page-link,
.pagination-modern .page-item:last-child .page-link {
  border-radius: 50rem !important;
  /* Ensure end buttons are also fully rounded */
}


.pagination-modern .page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
  box-shadow: 0 0.25rem 0.75rem rgba(var(--bs-primary-rgb), 0.2);
  transform: translateY(-2px);
  /* Slight lift */
}

.pagination-modern .page-item .page-link:hover {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary-text-emphasis);
  border-color: var(--bs-primary-border-subtle);
}

.pagination-modern .page-item.disabled .page-link {
  color: var(--bs-gray-400);
  background-color: var(--bs-light);
  border-color: var(--bs-border-color);
  cursor: not-allowed;
  box-shadow: none;
}

/* File Preview Card Styles */
.file-preview-card {
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background-color: var(--bs-white);
  /* Light background for card */
}

.theme-dark .file-preview-card {
  background-color: #2c2c2c;
  /* Dark background for card */
  border-color: #444;
}

.file-preview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.file-preview-card img,
.file-preview-card video {
  display: block;
  width: 100%;
  height: 150px;
  /* Fixed height for consistency */
  object-fit: cover;
  /* Cover the area, cropping if necessary */
  border-bottom: 1px solid var(--bs-border-color);
}

.file-info {
  font-size: 0.8rem;
  color: var(--bs-secondary-text-emphasis);
}

.theme-dark .file-info {
  background-color: #333;
  color: #bbb;
}

/* For the confirm delivery button to center itself within the text-center div */
.text-center .btn-lg {
  display: inline-flex;
  /* Use inline-flex to center the button itself */
}
</style>