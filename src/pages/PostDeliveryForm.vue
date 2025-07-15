To provide you with the full Vue file, I will reconstruct the `PostDeliveryForm.vue` component, ensuring all the provided `template`, `script`, and `style` sections are correctly assembled.

I've incorporated the fix for `lon` vs `lng` in the `selectAddress` method and updated the frontend validation logic to explicitly check for the presence of `lat` and `lon` within the coordinates.

Here's the complete `PostDeliveryForm.vue` file:

```vue
<template>
  <div class="delivery-form-container py-5">
    <div class="container-xl">
      <div class="text-center mb-5">
        <div class="icon-circle">
          <i class="bi bi-box-seam fs-1"></i>
        </div>
        <h2 class="mt-4 display-5 fw-bold text-dark">Request a Delivery</h2>
        <p class="text-muted mt-2 fs-5">Get your package delivered safely by trusted carriers</p>
      </div>

      <form @submit.prevent="submitForm" class="delivery-form p-4 p-md-5 rounded-4 shadow-lg border">
        <div class="mb-4">
          <label class="form-label fw-bold text-secondary">Item Type *</label>
          <div class="row g-3">
            <div v-for="type in itemTypes" :key="type.value" class="col-6 col-md-4 col-lg-3">
              <button
                type="button"
                class="btn w-100 text-start border py-3 px-4 rounded-3 d-flex align-items-center item-type-btn"
                :class="{ 'btn-primary-soft text-primary shadow-sm selected-item-type': form.itemType === type.value, 'btn-outline-light text-dark': form.itemType !== type.value }"
                @click="form.itemType = type.value"
              >
                <i :class="[type.icon, 'me-3', 'fs-4', {'text-primary': form.itemType === type.value, 'text-muted': form.itemType !== type.value}]"></i>
                <span class="fw-medium">{{ type.label }}</span>
              </button>
            </div>
          </div>
          <small class="text-danger mt-2 d-block" v-if="errors.itemType">{{ errors.itemType }}</small>
        </div>

        <div class="mb-4">
          <label for="itemDescription" class="form-label fw-bold text-secondary">Description *</label>
          <textarea
            id="itemDescription"
            class="form-control rounded-3"
            :class="{'is-invalid': errors.itemDescription}"
            v-model.trim="form.itemDescription"
            rows="3"
            placeholder="e.g., A small box of books, fragile, needs careful handling"
          ></textarea>
          <div class="invalid-feedback" v-if="errors.itemDescription">{{ errors.itemDescription }}</div>
        </div>

        <div class="row mb-4 g-4">
          <div class="col-md-4">
            <label for="itemLength" class="form-label fw-bold text-secondary">Length (cm)</label>
            <input type="number" id="itemLength" class="form-control rounded-3" v-model.number="form.itemLength" placeholder="e.g., 30" min="1">
            <small class="text-danger mt-1 d-block" v-if="errors.itemLength">{{ errors.itemLength }}</small>
          </div>
          <div class="col-md-4">
            <label for="itemWidth" class="form-label fw-bold text-secondary">Width (cm)</label>
            <input type="number" id="itemWidth" class="form-control rounded-3" v-model.number="form.itemWidth" placeholder="e.g., 20" min="1">
            <small class="text-danger mt-1 d-block" v-if="errors.itemWidth">{{ errors.itemWidth }}</small>
          </div>
          <div class="col-md-4">
            <label for="itemHeight" class="form-label fw-bold text-secondary">Height (cm)</label>
            <input type="number" id="itemHeight" class="form-control rounded-3" v-model.number="form.itemHeight" placeholder="e.g., 10" min="1">
            <small class="text-danger mt-1 d-block" v-if="errors.itemHeight">{{ errors.itemHeight }}</small>
          </div>
        </div>

        <div class="mb-4">
          <label for="itemWeight" class="form-label fw-bold text-secondary">Weight (kg) *</label>
          <input
            type="number"
            id="itemWeight"
            class="form-control rounded-3"
            :class="{'is-invalid': errors.itemWeight}"
            v-model.number="form.itemWeight"
            placeholder="e.g., 1.5"
            step="0.1"
            min="0.1"
          />
          <div class="invalid-feedback" v-if="errors.itemWeight">{{ errors.itemWeight }}</div>
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold text-secondary">Special Requirements</label>
          <div class="row g-3">
            <div class="col-sm-6 col-md-4" v-for="(option, index) in checkboxes" :key="index">
              <label class="form-check d-flex align-items-center p-3 rounded-3 border border-light hover-bg-light cursor-pointer">
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  :id="option.key"
                  :value="option.label"
                  v-model="form.specialRequirements"
                />
                <i :class="option.icon + ' me-2 text-primary fs-5'" />
                <span class="form-check-label text-muted">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="row mb-4 g-4">
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Pickup Address *</label>
            <div class="position-relative">
              <input
                type="text"
                class="form-control rounded-3"
                :class="{'is-invalid': errors.pickupAddress}"
                v-model.trim="form.pickupAddress"
                @input="searchAddress('pickup')"
                @focus="showSuggestions('pickup')"
                @blur="hideSuggestionsDelayed('pickup')"
                placeholder="Full pickup address"
              />
              <div class="invalid-feedback" v-if="errors.pickupAddress">{{ errors.pickupAddress }}</div>
              <ul v-if="showPickupSuggestions && pickupSuggestions.length" class="list-group position-absolute w-100 z-1000 mt-1 shadow-sm">
                <li
                  v-for="(suggestion, index) in pickupSuggestions"
                  :key="index"
                  class="list-group-item list-group-item-action cursor-pointer"
                  @mousedown.prevent="selectAddress(suggestion, 'pickup')"
                >
                  {{ suggestion.formatted }}
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Dropoff Address *</label>
            <div class="position-relative">
              <input
                type="text"
                class="form-control rounded-3"
                :class="{'is-invalid': errors.dropoffAddress}"
                v-model.trim="form.dropoffAddress"
                @input="searchAddress('dropoff')"
                @focus="showSuggestions('dropoff')"
                @blur="hideSuggestionsDelayed('dropoff')"
                placeholder="Full dropoff address"
              />
              <div class="invalid-feedback" v-if="errors.dropoffAddress">{{ errors.dropoffAddress }}</div>
              <ul v-if="showDropoffSuggestions && dropoffSuggestions.length" class="list-group position-absolute w-100 z-1000 mt-1 shadow-sm">
                <li
                  v-for="(suggestion, index) in dropoffSuggestions"
                  :key="index"
                  class="list-group-item list-group-item-action cursor-pointer"
                  @mousedown.prevent="selectAddress(suggestion, 'dropoff')"
                >
                  {{ suggestion.formatted }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row mb-4 g-4">
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Pickup Date *</label>
            <input
              type="date"
              class="form-control rounded-3"
              :class="{'is-invalid': errors.pickupDate}"
              v-model="form.pickupDate"
              :min="today"
            />
            <div class="invalid-feedback" v-if="errors.pickupDate">{{ errors.pickupDate }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Delivery Timeframe *</label>
            <select
              class="form-select rounded-3"
              :class="{'is-invalid': errors.deliveryTimeframe}"
              v-model="form.deliveryTimeframe"
            >
              <option disabled value="">Choose...</option>
              <option v-for="time in timeframes" :value="time.value" :key="time.value">
                {{ time.label }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="errors.deliveryTimeframe">{{ errors.deliveryTimeframe }}</div>
          </div>
        </div>

        <div class="mb-4">
          <label for="pickupTime" class="form-label fw-bold text-secondary">Preferred Pickup Time</label>
          <input
            type="time"
            id="pickupTime"
            class="form-control rounded-3"
            v-model="form.pickupTime"
          />
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold text-secondary">Budget *</label>
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0 text-primary rounded-start-3">₹</span>
            <input
              type="number"
              class="form-control rounded-end-3"
              :class="{'is-invalid': errors.budget}"
              v-model.trim="form.budget"
              placeholder="e.g., 250"
              min="0"
              step="any"
            />
            <div class="invalid-feedback" v-if="errors.budget">{{ errors.budget }}</div>
          </div>
          <small class="text-muted d-block mt-1">Carriers may offer lower prices</small>
        </div>

        <div class="row mb-4 g-4">
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Receiver Name *</label>
            <input
              type="text"
              class="form-control rounded-3"
              :class="{'is-invalid': errors.receiverName}"
              v-model.trim="form.receiverName"
              placeholder="Full name of receiver"
            />
            <div class="invalid-feedback" v-if="errors.receiverName">{{ errors.receiverName }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold text-secondary">Receiver Phone *</label>
            <input
              type="tel"
              class="form-control rounded-3"
              :class="{'is-invalid': errors.receiverPhone}"
              v-model.trim="form.receiverPhone"
              placeholder="e.g., +91 98765 43210"
            />
            <div class="invalid-feedback" v-if="errors.receiverPhone">{{ errors.receiverPhone }}</div>
          </div>
        </div>

        <div class="mb-4">
          <label for="receiverEmail" class="form-label fw-bold text-secondary">Receiver Email</label>
          <input
            type="email"
            id="receiverEmail"
            class="form-control rounded-3"
            :class="{'is-invalid': errors.receiverEmail}"
            v-model.trim="form.receiverEmail"
            placeholder="receiver@example.com"
          />
          <div class="invalid-feedback" v-if="errors.receiverEmail">{{ errors.receiverEmail }}</div>
        </div>

        <div class="mb-5">
          <label class="form-label fw-bold text-secondary">Additional Instructions</label>
          <textarea
            class="form-control rounded-3"
            rows="3"
            v-model.trim="form.additionalInstructions"
            placeholder="Any specific instructions for the carrier (e.g., 'Leave at front door, call before arriving')"
          ></textarea>
        </div>

        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-outline-secondary me-3 px-4 py-2 rounded-3" @click="$router.push('/')">Cancel</button>
          <button type="submit" class="btn btn-primary px-4 py-2 rounded-3 shadow-sm">Find Carriers</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostDeliveryForm",
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      geoapifyApiKey: import.meta.env.VITE_GEOAPIFY_API_KEY, // Make sure this is set in your .env
      pickupSuggestions: [],
      dropoffSuggestions: [],
      showPickupSuggestions: false,
      showDropoffSuggestions: false,
      searchTimeout: null,
      form: {
        email: this.$store.getters.getUser?.email || '', // User's email from Vuex store
        itemType: "",
        itemDescription: "",
        itemLength: null, // New field
        itemWidth: null,  // New field
        itemHeight: null, // New field
        itemWeight: null, // New field
        pickupAddress: "",
        pickupCoordinates: null, // { lat: number, lon: number }
        dropoffAddress: "",
        dropoffCoordinates: null, // { lat: number, lon: number }
        pickupDate: "",
        pickupTime: "", // New field: Preferred pickup time
        deliveryTimeframe: "",
        budget: "",
        specialInstructions: "", // Renamed from specialInstructions to avoid confusion with checkboxes
        specialRequirements: [], // Checkbox values
        receiverName: "",
        receiverPhone: "",
        receiverEmail: "", // New field
        additionalInstructions: "", // Renamed for clarity for the large textarea
      },
      errors: {},
      itemTypes: [
        { value: "documents", label: "Documents", icon: "bi bi-file-text" },
        { value: "medicine", label: "Medicine", icon: "bi bi-capsule" },
        { value: "electronics", label: "Electronics", icon: "bi bi-laptop" },
        { value: "food", label: "Food & Groceries", icon: "bi bi-basket" }, // Merged
        { value: "clothing", label: "Clothing", icon: "bi bi-backpack" }, // Changed icon for variety
        { value: "gifts", label: "Gifts", icon: "bi bi-gift" }, // Changed icon
        { value: "furniture", label: "Furniture", icon: "bi bi-lamp" }, // New
        { value: "appliances", label: "Appliances", icon: "bi bi-washer" }, // New
        { value: "other", label: "Other", icon: "bi bi-box-seam" },
      ],
      timeframes: [
        { value: "within-2-hours", label: "Within 2 Hours (Express)" }, // New
        { value: "same-day", label: "Same Day (by EOD)" },
        { value: "next-day", label: "Next Business Day" },
        { value: "2-3-days", label: "2-3 Business Days" },
        { value: "flexible", label: "Flexible (within a week)" },
      ],
      checkboxes: [
        { key: 'fragile', label: 'Fragile item', icon: 'bi-exclamation-triangle-fill' },
        { key: 'perishable', label: 'Perishable item', icon: 'bi-snow' }, // Changed 'refrigeration'
        { key: 'oversized', label: 'Oversized item', icon: 'bi-arrows-fullscreen' }, // New
        { key: 'valuableItem', label: 'Valuable item', icon: 'bi-shield-lock' },
        { key: 'handle-with-care', label: 'Handle with extreme care', icon: 'bi-hand-index-thumb' }, // New
        { key: 'signature-required', label: 'Signature required on delivery', icon: 'bi-pencil-square' }, // New
        { key: 'doorstep-delivery', label: 'Doorstep delivery preferred', icon: 'bi-house-door' },
        { key: 'delivery-to-person-only', label: 'Delivery to specific person only', icon: 'bi-person-check' }, // New
      ],
    };
  },
  methods: {
    // --- Geoapify Address Autocomplete ---
    searchAddress(type) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        const query = type === 'pickup' ? this.form.pickupAddress : this.form.dropoffAddress;

        if (query.length < 3) {
          this[type + 'Suggestions'] = [];
          return;
        }

        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${this.geoapifyApiKey}&limit=5&filter=countrycode:in`
          );
          const data = await response.json();

          if (data && data.features) {
            this[type + 'Suggestions'] = data.features.map(feature => ({
              formatted: feature.properties.formatted,
              lat: feature.properties.lat,
              lon: feature.properties.lon, // Ensure this is 'lon' as per Geoapify
            }));
            this[type === 'pickup' ? 'showPickupSuggestions' : 'showDropoffSuggestions'] = true;
          } else {
            this[type + 'Suggestions'] = [];
          }
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
          this[type + 'Suggestions'] = [];
        }
      }, 300);
    },
    selectAddress(suggestion, type) {
      if (type === 'pickup') {
        this.form.pickupAddress = suggestion.formatted;
        // FIX APPLIED HERE: Ensure 'lon' is used for longitude
        this.form.pickupCoordinates = { lat: suggestion.lat, lon: suggestion.lon };
        this.showPickupSuggestions = false;
      } else {
        this.form.dropoffAddress = suggestion.formatted;
        // FIX APPLIED HERE: Ensure 'lon' is used for longitude
        this.form.dropoffCoordinates = { lat: suggestion.lat, lon: suggestion.lon };
        this.showDropoffSuggestions = false;
      }
      // Clear validation error for this address field if it existed
      if (this.errors[type + 'Address']) {
        delete this.errors[type + 'Address'];
      }
    },
    showSuggestions(type) {
      if (type === 'pickup') {
        this.showPickupSuggestions = this.pickupSuggestions.length > 0;
      } else {
        this.showDropoffSuggestions = this.dropoffSuggestions.length > 0;
      }
    },
    hideSuggestionsDelayed(type) {
      setTimeout(() => {
        if (type === 'pickup') {
          this.showPickupSuggestions = false;
        } else {
          this.showDropoffSuggestions = false;
        }
      }, 150);
    },

    // --- Form Validation ---
    validateForm() {
      this.errors = {};
      const f = this.form;

      if (!f.itemType) this.errors.itemType = "Please select an item type.";
      if (!f.itemDescription || f.itemDescription.length < 10) // Increased min length
        this.errors.itemDescription = "Description must be at least 10 characters.";
      if (!f.itemWeight || isNaN(f.itemWeight) || parseFloat(f.itemWeight) <= 0)
        this.errors.itemWeight = "Weight must be a positive number.";

      // Dimension validation (optional, only if user enters)
      if (f.itemLength !== null && f.itemLength !== '' && (isNaN(f.itemLength) || parseFloat(f.itemLength) <= 0))
          this.errors.itemLength = "Length must be a positive number.";
      if (f.itemWidth !== null && f.itemWidth !== '' && (isNaN(f.itemWidth) || parseFloat(f.itemWidth) <= 0))
          this.errors.itemWidth = "Width must be a positive number.";
      if (f.itemHeight !== null && f.itemHeight !== '' && (isNaN(f.itemHeight) || parseFloat(f.itemHeight) <= 0))
          this.errors.itemHeight = "Height must be a positive number.";


      // ENHANCED COORDINATE VALIDATION
      if (!f.pickupAddress || !f.pickupCoordinates || f.pickupCoordinates.lat === null || f.pickupCoordinates.lon === null || isNaN(f.pickupCoordinates.lat) || isNaN(f.pickupCoordinates.lon)) {
          this.errors.pickupAddress = "Please select a valid pickup address from the suggestions (coordinates required).";
      }
      if (!f.dropoffAddress || !f.dropoffCoordinates || f.dropoffCoordinates.lat === null || f.dropoffCoordinates.lon === null || isNaN(f.dropoffCoordinates.lat) || isNaN(f.dropoffCoordinates.lon)) {
          this.errors.dropoffAddress = "Please select a valid dropoff address from the suggestions (coordinates required).";
      }

      if (!f.pickupDate) this.errors.pickupDate = "Pickup date is required.";
      if (!f.deliveryTimeframe) this.errors.deliveryTimeframe = "Please select a delivery timeframe.";
      if (!f.budget || isNaN(f.budget) || parseFloat(f.budget) <= 0)
        this.errors.budget = "Budget must be a positive number.";

      if (!f.receiverName || f.receiverName.length < 3)
        this.errors.receiverName = "Receiver name is required and must be at least 3 characters.";
      if (!f.receiverPhone || !/^\+?[0-9\s-()]{7,}$/.test(f.receiverPhone)) // Relaxed slightly for more formats
        this.errors.receiverPhone = "A valid phone number is required (min 7 digits).";
      if (f.receiverEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.receiverEmail)) // Only if entered
        this.errors.receiverEmail = "Please enter a valid email address.";

      return Object.keys(this.errors).length === 0;
    },

    // --- Form Submission ---
    async submitForm() {
      if (!this.validateForm()) {
        console.error("Form validation failed:", this.errors);
        alert("Please correct the errors in the form.");
        return;
      }

      console.log("Delivery Request Data to Send:", this.form);

      const prodid = "REQ-" + Date.now(); // Unique ID for the request
      const baseUrl = import.meta.env.VITE_API_BASE_URL; // From .env

      try {
        const response = await fetch(`${baseUrl}api/deliveries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dattosend: {
              // Map form data to backend expected format (assuming these match your backend's DTO)
              item_type: this.form.itemType,
              item_description: this.form.itemDescription,
              item_length: this.form.itemLength,
              item_width: this.form.itemWidth,
              item_height: this.form.itemHeight,
              item_weight: this.form.itemWeight,
              pickup_address: this.form.pickupAddress,
              pickup_latitude: this.form.pickupCoordinates?.lat,
              pickup_longitude: this.form.pickupCoordinates?.lon, // Ensure this is .lon
              dropoff_address: this.form.dropoffAddress,
              dropoff_latitude: this.form.dropoffCoordinates?.lat,
              dropoff_longitude: this.form.dropoffCoordinates?.lon, // Ensure this is .lon
              pickup_date: this.form.pickupDate,
              pickup_time: this.form.pickupTime, // New
              delivery_timeframe: this.form.deliveryTimeframe,
              budget: parseFloat(this.form.budget),
              special_instructions: this.form.additionalInstructions, // Renamed
              special_requirements: this.form.specialRequirements, // Array of strings
              receiver_name: this.form.receiverName,
              receiver_phone: this.form.receiverPhone,
              receiver_email: this.form.receiverEmail, // New
              sender_email: this.form.email, // Sender email from store (mapped to 'email' column in DB)
            },
            product_id: prodid,
            // Assuming the backend auto-generates other IDs like transid/transmailid
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Server response:", result);
        alert("Delivery request submitted successfully! Finding best carriers for you...");

        // Redirect to a page that lists potential carriers or shows request status
        this.$router.push({ name: "find-carriers", query: { id: prodid } });

      } catch (err) {
        console.error("Error submitting form:", err);
        alert(`Failed to submit the request: ${err.message}. Please check your input and try again.`);
      }
    },
  },
};
</script>

<style scoped>
/* Custom variables for primary color and dark mode theming */
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-primary-soft: #e7f0fe; /* Light background for primary elements */

  /* Light Mode Palette */
  --page-bg-light: #f8f9fa; /* Very light gray for page background */
  --card-bg-light: #ffffff; /* White for cards and forms */
  --text-color-light: #212529; /* Dark text for readability */
  --muted-text-color-light: #6c757d; /* Muted text for labels/hints */
  --border-color-light: #e9ecef; /* Light gray border */
  --shadow-color-light: rgba(0, 0, 0, 0.1); /* Subtle shadow */

  /* Dark Mode Palette */
  --page-bg-dark: #121212; /* Very dark background */
  --card-bg-dark: #1e1e1e; /* Darker background for cards */
  --text-color-dark: #e0e0e0; /* Light text for readability */
  --muted-text-color-dark: #a0a0a0; /* Muted text in dark mode */
  --border-color-dark: #3a3a3a; /* Dark border */
  --shadow-color-dark: rgba(0, 0, 0, 0.4); /* Pronounced shadow */

  /* Dark Mode specific Bootstrap overrides for readability */
  --bs-primary-dark-mode: #6a9cff; /* Brighter primary for dark mode */
  --bs-primary-soft-dark: #2a3a4e; /* Darker soft for primary backgrounds */
}

/* Base styles for the component container */
.delivery-form-container {
  background-color: var(--page-bg-light);
  color: var(--text-color-light);
  min-height: 100vh;
  display: flex;
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
}

/* Form Card Styling */
.delivery-form {
  background-color: var(--card-bg-light);
  border: 1px solid var(--border-color-light) !important;
  box-shadow: 0 1rem 3rem var(--shadow-color-light) !important;
  max-width: 900px; /* Max width for the form container */
  margin: 0 auto; /* Center the form on larger screens */
}

/* Icon Circle Styling */
.icon-circle {
  background-color: var(--bs-primary);
  color: white;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Text Colors */
.text-dark { color: var(--text-color-light) !important; }
.text-muted { color: var(--muted-text-color-light) !important; }
.text-secondary { color: var(--muted-text-color-light) !important; } /* For form labels */
.text-primary { color: var(--bs-primary) !important; } /* Standard primary for icons, etc. */

/* Form Control Styling (Inputs, Textareas, Selects) */
.form-control, .form-select {
  background-color: var(--card-bg-light);
  color: var(--text-color-light);
  border: 1px solid var(--border-color-light);
  border-radius: 0.75rem !important;
  padding: 0.75rem 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.form-control::placeholder {
  color: var(--muted-text-color-light);
  opacity: 0.7;
}
.form-control:focus, .form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
.input-group-text {
  background-color: var(--page-bg-light); /* Matches page background for a light feel */
  border: 1px solid var(--border-color-light);
  border-right: none;
  color: var(--bs-primary);
  border-radius: 0.75rem 0 0 0.75rem !important; /* Rounded only on start */
}
.input-group .form-control.rounded-end-3 {
  border-left: none; /* Remove duplicate border */
  border-radius: 0 0.75rem 0.75rem 0 !important; /* Rounded only on end */
}

/* Item Type Buttons */
.item-type-btn {
  background-color: var(--card-bg-light);
  border: 1px solid var(--border-color-light);
  transition: all 0.2s ease-in-out;
  font-size: 1rem; /* Adjust font size */
}
.item-type-btn:hover {
  background-color: #f0f0f0; /* Slightly darker on hover */
  border-color: var(--bs-primary);
}
.item-type-btn.selected-item-type {
  background-color: var(--bs-primary-soft) !important;
  border-color: var(--bs-primary) !important;
  color: var(--bs-primary) !important;
  font-weight: 600; /* Make selected text bolder */
}
.item-type-btn.selected-item-type .text-primary {
  color: var(--bs-primary) !important; /* Ensure icon is primary */
}
.item-type-btn .text-muted {
  color: var(--muted-text-color-light) !important;
}

/* Checkbox Labels */
.form-check label {
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}
.form-check label:hover {
  background-color: #f5f5f5; /* Light hover effect for checkbox cards */
  border-color: var(--bs-primary);
}
.form-check-input {
  border: 1px solid var(--muted-text-color-light);
  flex-shrink: 0; /* Prevent shrinking */
}
.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

/* Form Actions (Buttons) */
.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.75rem !important;
  transition: all 0.2s ease-in-out;
}
.btn-primary {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: white;
}
.btn-primary:hover {
  background-color: #0b5ed7; /* Darker primary on hover */
  border-color: #0a58ca;
}
.btn-outline-secondary {
  border-color: var(--muted-text-color-light);
  color: var(--muted-text-color-light);
}
.btn-outline-secondary:hover {
  background-color: var(--muted-text-color-light);
  color: var(--card-bg-light); /* White text on hover */
}

/* --- Autocomplete Suggestions List Styles --- */
.list-group {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1000;
  max-height: 200px; /* Reduced max height slightly */
  overflow-y: auto;
  border-radius: 0.5rem;
  padding: 0;
  margin-top: 5px;
  list-style: none;

  background-color: var(--card-bg-light);
  border: 1px solid var(--border-color-light);
  box-shadow: 0 4px 12px var(--shadow-color-light);
}
.list-group-item {
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color-light);
  color: var(--text-color-light);
  background-color: var(--card-bg-light);
}
.list-group-item:last-child {
  border-bottom: none;
}
.list-group-item-action:hover, .list-group-item-action:focus {
  background-color: #f0f0f0 !important; /* Lighter background on hover */
  color: var(--bs-primary) !important;
}

/* --- Dark Mode Overrides --- */
body.theme-dark .delivery-form-container {
  background-color: var(--page-bg-dark);
}
body.theme-dark .delivery-form {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark) !important;
  box-shadow: 0 1rem 3rem var(--shadow-color-dark) !important;
}
body.theme-dark .icon-circle {
  background-color: var(--bs-primary-dark-mode);
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.4);
}
body.theme-dark .text-dark { color: var(--text-color-dark) !important; }
body.theme-dark .text-muted { color: var(--muted-text-color-dark) !important; }
body.theme-dark .text-secondary { color: var(--muted-text-color-dark) !important; }
body.theme-dark .text-primary { color: var(--bs-primary-dark-mode) !important; }

body.theme-dark .form-control, body.theme-dark .form-select {
  background-color: #2a2a2a; /* Slightly darker input background */
  color: var(--text-color-dark);
  border-color: var(--border-color-dark);
}
body.theme-dark .form-control::placeholder {
  color: var(--muted-text-color-dark);
}
body.theme-dark .form-control:focus, body.theme-dark .form-select:focus {
  border-color: var(--bs-primary-dark-mode);
  box-shadow: 0 0 0 0.25rem rgba(106, 156, 255, 0.25); /* Dark mode shadow with primary color */
}
body.theme-dark .input-group-text {
  background-color: #2a2a2a;
  border-color: var(--border-color-dark);
  color: var(--bs-primary-dark-mode);
}

body.theme-dark .item-type-btn {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark);
  color: var(--text-color-dark);
}
body.theme-dark .item-type-btn:hover {
  background-color: #2a2a2a; /* Darker hover */
  border-color: var(--bs-primary-dark-mode);
}
body.theme-dark .item-type-btn.selected-item-type {
  background-color: var(--bs-primary-soft-dark) !important;
  border-color: var(--bs-primary-dark-mode) !important;
  color: var(--bs-primary-dark-mode) !important;
}
body.theme-dark .item-type-btn .text-muted {
  color: var(--muted-text-color-dark) !important;
}

body.theme-dark .form-check label:hover {
  background-color: #2a2a2a;
  border-color: var(--bs-primary-dark-mode);
}
body.theme-dark .form-check-input {
  border-color: var(--muted-text-color-dark);
}
body.theme-dark .form-check-input:checked {
  background-color: var(--bs-primary-dark-mode);
  border-color: var(--bs-primary-dark-mode);
}

body.theme-dark .btn-primary {
  background-color: var(--bs-primary-dark-mode) !important;
  border-color: var(--bs-primary-dark-mode) !important;
  color: var(--card-bg-dark) !important; /* Darker text for contrast */
}
body.theme-dark .btn-primary:hover {
  background-color: #5a8be0 !important;
  border-color: #5a8be0 !important;
}
body.theme-dark .btn-outline-secondary {
  border-color: var(--muted-text-color-dark);
  color: var(--muted-text-color-dark);
}
body.theme-dark .btn-outline-secondary:hover {
  background-color: var(--muted-text-color-dark);
  color: var(--card-bg-light); /* White text on hover */
}

/* Dark mode for autocomplete suggestions */
body.theme-dark .list-group {
  background-color: var(--card-bg-dark);
  border-color: var(--border-color-dark);
  box-shadow: 0 4px 12px var(--shadow-color-dark);
}
body.theme-dark .list-group-item {
  background-color: var(--card-bg-dark);
  border-bottom-color: var(--border-color-dark);
  color: var(--text-color-dark);
}
body.theme-dark .list-group-item-action:hover, body.theme-dark .list-group-item-action:focus {
  background-color: #2a2a2a !important; /* Darker background on hover */
  color: var(--bs-primary-dark-mode) !important;
}
</style>

```