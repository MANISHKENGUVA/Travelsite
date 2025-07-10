<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <div class="icon-circle bg-success d-inline-flex align-items-center justify-content-center mb-3">
        <i class="fas fa-truck text-white fa-2x"></i>
      </div>
      <h2 class="fw-bold text-primary">Share Your Trip</h2>
      <p class="text-muted fs-5">Earn money by helping others deliver packages on your route</p>
    </div>

    <form @submit.prevent="submitForm">
      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-map-marker-alt me-2"></i>Trip Route</h5>
        </div>
        <div class="card-body p-4">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="startLocation" class="form-label fw-bold">Starting Location <span class="text-danger">*</span></label>
              <textarea v-model="form.startLocation" class="form-control rounded-3" id="startLocation" rows="2" placeholder="City, state or full address"></textarea>
              <small v-if="errors.startLocation" class="text-danger">{{ errors.startLocation }}</small>
            </div>
            <div class="col-md-6 mb-3">
              <label for="destination" class="form-label fw-bold">Destination <span class="text-danger">*</span></label>
              <textarea v-model="form.destination" class="form-control rounded-3" id="destination" rows="2" placeholder="City, state or full address"></textarea>
              <small v-if="errors.destination" class="text-danger">{{ errors.destination }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-car me-2"></i>Vehicle & Available Space</h5>
        </div>
        <div class="card-body p-4">
          <div class="mb-4">
            <label class="form-label fw-bold">Vehicle Type <span class="text-danger">*</span></label>
            <div class="d-flex flex-wrap gap-2">
              <button v-for="vehicle in vehicleTypes"
                      :key="vehicle.value"
                      type="button"
                      class="btn btn-outline-success btn-lg rounded-pill px-4 py-2"
                      :class="{ 'active': form.vehicleType === vehicle.value, 'btn-success text-white': form.vehicleType === vehicle.value }"
                      @click="form.vehicleType = vehicle.value">
                <i :class="vehicle.icon" class="me-2"></i> {{ vehicle.label }}
              </button>
            </div>
            <small v-if="errors.vehicleType" class="text-danger">{{ errors.vehicleType }}</small>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="availableSpace" class="form-label fw-bold">Available Space <span class="text-danger">*</span></label>
              <select v-model="form.availableSpace" class="form-select rounded-3" id="availableSpace">
                <option disabled value="">Select space available</option>
                <option value="small">Small (backpack/envelope)</option>
                <option value="medium">Medium (small box/bag)</option>
                <option value="large">Large (large box/suitcase)</option>
                <option value="extra-large">Extra Large (multiple boxes)</option>
              </select>
              <small v-if="errors.availableSpace" class="text-danger">{{ errors.availableSpace }}</small>
            </div>
            <div class="col-md-6 mb-3">
              <label for="maxPackageSize" class="form-label fw-bold">Max Package Dimensions <span class="text-danger">*</span></label>
              <input v-model="form.maxPackageSize" class="form-control rounded-3" id="maxPackageSize" placeholder="e.g., 24x18x12 inches" />
              <small v-if="errors.maxPackageSize" class="text-danger">{{ errors.maxPackageSize }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-clock me-2"></i>Departure Schedule</h5>
        </div>
        <div class="card-body p-4 row">
          <div class="col-md-6 mb-3">
            <label for="departureDate" class="form-label fw-bold">Departure Date <span class="text-danger">*</span></label>
            <input type="date" v-model="form.departureDate" class="form-control rounded-3" id="departureDate" />
            <small v-if="errors.departureDate" class="text-danger">{{ errors.departureDate }}</small>
          </div>
          <div class="col-md-6 mb-3">
            <label for="departureTime" class="form-label fw-bold">Departure Time <span class="text-danger">*</span></label>
            <select v-model="form.departureTime" class="form-select rounded-3" id="departureTime">
              <option disabled value="">Select time</option>
              <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
            </select>
            <small v-if="errors.departureTime" class="text-danger">{{ errors.departureTime }}</small>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary"><i class="fas fa-box me-2"></i>Package Types & Pricing</h5>
        </div>
        <div class="card-body p-4">
          <div class="row mb-3 g-3">
            <div class="col-md-3" v-for="(label, key) in packageTypes" :key="key">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" v-model="form[key]" :id="key" />
                <label class="form-check-label fw-medium" :for="key">{{ label }}</label>
              </div>
            </div>
          </div>

          <div class="row align-items-center">
            <div class="col-md-6 mb-3">
              <label for="pricePerKg" class="form-label fw-bold">Price Per Package <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text rounded-start-3">$</span>
                <input v-model="form.pricePerKg" type="number" class="form-control rounded-end-3" id="pricePerKg" placeholder="25" />
              </div>
              <small v-if="errors.pricePerKg" class="text-danger">{{ errors.pricePerKg }}</small>
            </div>
            <div class="col-md-6 mb-3">
              <div class="form-check mt-3">
                <input class="form-check-input" type="checkbox" v-model="form.hasInsurance" id="hasInsurance" />
                <label class="form-check-label fw-medium" for="hasInsurance">I have delivery insurance</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 border-0 rounded-4">
        <div class="card-header bg-light-subtle py-3 border-bottom-0 rounded-top-4">
          <h5 class="mb-0 text-primary">Additional Notes</h5>
        </div>
        <div class="card-body p-4">
          <textarea v-model="form.additionalNotes" class="form-control rounded-3" rows="3" placeholder="Optional notes..."></textarea>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-3 mt-4">
        <button type="button" class="btn btn-outline-secondary btn-lg rounded-pill px-4" @click="$router.push('/')">Cancel</button>
        <button type="submit" class="btn btn-success btn-lg rounded-pill px-4">
          <i class="fas fa-paper-plane me-2"></i> Publish Trip
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email:this.$store.getters.getUser.email, // Assuming this.$store.getters.getUser.email is correctly set up
        startLocation: "",
        destination: "",
        departureDate: "",
        departureTime: "",
        vehicleType: "",
        availableSpace: "",
        pricePerKg: "",
        maxPackageSize: "",
        acceptDocuments: true,
        acceptMedicine: false,
        acceptElectronics: true,
        acceptFragile: false,
        hasInsurance: false,
        additionalNotes: "",
      },
      errors: {},
      vehicleTypes: [
        { value: "sedan", label: "Sedan", icon: "fas fa-car" },
        { value: "suv", label: "SUV", icon: "fas fa-car-side" },
        { value: "van", label: "Van", icon: "fas fa-shuttle-van" },
        { value: "truck", label: "Truck", icon: "fas fa-truck" },
      ],
      packageTypes: {
        acceptDocuments: "Documents",
        acceptElectronics: "Electronics",
        acceptMedicine: "Medicine",
        acceptFragile: "Fragile Items",
      },
      timeSlots: [
        "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
        "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
      ],
    };
  },
  methods: {
    submitForm() {
      this.errors = {};
      const requiredFields = [
        "startLocation", "destination", "departureDate", "departureTime",
        "vehicleType", "availableSpace", "pricePerKg", "maxPackageSize",
      ];

      let isValid = true;

      requiredFields.forEach((field) => {
        if (!this.form[field]) {
          this.errors[field] = "This field is required";
          isValid = false;
        }
      });

      if (!isValid) return;

      const trip = {
        transportTripId: Math.random().toString(36).substring(2),
        datatobackend :{ ...this.form },
        status: "active",
      };
        alert("Trip submitted successfully!\n" + JSON.stringify(trip, null, 2));

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
        fetch(`${baseUrl}api/add-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(trip),
      })
        .then(res => res.json())
        .then(data => {
          console.log("Server response:", data);


            this.$router.push({ path: "/view-requests", query: { transportTripId: trip.transportTripId } });
        })
        .catch(err => {
          console.error("Fetch error:", err);
          alert("Failed to submit the request. Please try again later.");
        });



    },
  },
};
</script>

<style scoped>
/* Custom styles for a modern look */
.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: var(--bs-success); /* Using Bootstrap variable */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: var(--bs-light-subtle); /* Lighter background for header */
  border-bottom: 1px solid var(--bs-border-color-translucent);
}

.form-label {
  font-size: 0.95rem;
  color: var(--bs-dark);
}

.form-control,
.form-select,
.btn {
  border-radius: 0.75rem; /* More rounded corners */
}

/* Specific style for active vehicle type button */
.btn-outline-success.active,
.btn-outline-success:active,
.btn-success.text-white {
  background-color: var(--bs-success) !important;
  border-color: var(--bs-success) !important;
  color: white !important;
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-success-rgb), 0.25);
}

.btn-outline-success {
  border-width: 2px; /* Slightly thicker border for outline buttons */
}

.input-group-text {
  background-color: var(--bs-light);
  border-color: var(--bs-border-color);
  color: var(--bs-body-color);
  border-right: 0;
}

.input-group input.form-control {
  border-left: 0;
}

.form-check-input:checked {
  background-color: var(--bs-success);
  border-color: var(--bs-success);
}
</style>