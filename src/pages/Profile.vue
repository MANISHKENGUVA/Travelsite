<template>
  <div class="container py-5">
    <h2 class="mb-5 text-center fw-bold text-dark animate__animated animate__fadeInDown">Your Profile Settings</h2>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="card  border-0 rounded-4 shadow-sm profile-summary-card animate__animated animate__fadeInLeft">
          <div class="card-body p-4 text-center">
            <div
              class="profile-avatar d-inline-flex align-items-center justify-content-center text-white mb-3 shadow-sm"
              :style="{ backgroundColor: getColorFromUsername($store.state.user) }"
            >
              <span class="fw-bold">{{ $store.state.user ? $store.state.user[0].toUpperCase() : 'U' }}</span>
            </div>

            <h5 class="mb-1 fw-bold text-dark">{{ profile.firstName }} {{ profile.lastName }}</h5>
            <p class="text-muted small mb-3">{{ profile.email }}</p>

            <div class="mb-3 d-flex justify-content-center align-items-center">
              <i v-for="i in 5" :key="i" class="bi fs-5 me-1"
                 :class="i <= Math.floor(profile.rating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"></i>
              <span class="small text-muted fw-medium">({{ profile.reviewCount }} reviews)</span>
            </div>

            <hr class="my-3 border-dashed">

            <div class="row text-center">
              <div class="col-6">
                <div class="h5 fw-bold text-dark mb-0">{{ profile.totalDeliveries }}</div>
                <small class="text-muted">Deliveries</small>
              </div>
              <div class="col-6">
                <div class="h5 fw-bold text-primary mb-0">{{ Math.round(verificationProgress) }}%</div>
                <small class="text-muted">Verified</small>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-4 border-0 rounded-4 shadow-sm verification-status-card animate__animated animate__fadeInLeft animate__delay-0-2s">
          <div class="card-header bg-white py-3 px-4 border-bottom-0 rounded-top-4">
            <h6 class="mb-0 fw-bold text-dark">
              <i class="bi bi-shield-check-fill text-info me-2"></i> Verification Status
            </h6>
          </div>
          <div class="card-body p-4">
            <div class="mb-3">
              <small class="d-flex justify-content-between mb-1 text-muted fw-medium">
                <span>Overall Progress</span>
                <span>{{ Math.round(verificationProgress) }}%</span>
              </small>
              <div class="progress rounded-pill" style="height: 8px;">
                <div class="progress-bar bg-primary" role="progressbar" :style="'width: ' + verificationProgress + '%'"
                     :aria-valuenow="verificationProgress" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

            <ul class="list-group list-group-flush mt-3">
              <li v-for="(verified, label) in verificationLabels" :key="label"
                  class="list-group-item d-flex justify-content-between align-items-center px-0 py-2 bg-transparent border-0">
                <div class="d-flex align-items-center">
                  <i :class="verified ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-warning'"
                     class="me-2 fs-5"></i>
                  <span class="fw-medium text-dark">{{ label }}</span>
                </div>
                <span class="badge rounded-pill px-3 py-1" :class="verified ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
                  {{ verified ? 'Verified' : 'Pending' }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="profile-tabs animate__animated animate__fadeInRight">
          <ul class="nav nav-pills custom-nav-pills mb-4 d-flex justify-content-start flex-nowrap overflow-auto pb-2" role="tablist">
            <li class="nav-item me-2">
              <a class="nav-link active" data-bs-toggle="tab" href="#personal-info-tab">Personal Info</a>
            </li>
            <li class="nav-item me-2">
              <a class="nav-link" data-bs-toggle="tab" href="#verification-tab">Verification</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#security-tab">Security</a>
            </li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane fade show active" id="personal-info-tab">
              <div class="card border-0 rounded-4 shadow-sm">
                <div class="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom-0 rounded-top-4">
                  <h6 class="mb-0 fw-bold text-dark">Personal Information</h6>
                  <div>
                    <button v-if="!isEditing" class="btn btn-primary-light btn-sm rounded-pill px-3 animate-btn" @click="isEditing = true">
                      <i class="bi bi-pencil me-1"></i> Edit
                    </button>
                    <div v-else class="btn-group">
                      <button class="btn btn-outline-secondary btn-sm rounded-pill px-3 me-2 animate-btn" @click="cancelEdit">
                        <i class="bi bi-x me-1"></i> Cancel
                      </button>
                      <button class="btn btn-success btn-sm rounded-pill px-3 animate-btn" @click="saveEdit">
                        <i class="bi bi-check me-1"></i> Save Changes
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body p-4">
                    <div v-if="alert.personalInfo.message" :class="`alert alert-${alert.personalInfo.type} alert-dismissible fade show rounded-3 mb-4`" role="alert">
                        <i :class="alert.personalInfo.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'" class="me-2"></i>
                        {{ alert.personalInfo.message }}
                        <button type="button" class="btn-close" @click="alert.personalInfo.message = ''" aria-label="Close"></button>
                    </div>

                  <form @submit.prevent="saveEdit">
                    <div class="row g-3 mb-3">
                      <div class="col-md-6">
                        <label for="firstName" class="form-label fw-medium text-muted">First Name</label>
                        <input type="text" class="form-control rounded-pill-input" id="firstName" v-model="editedProfile.firstName" :disabled="!isEditing" />
                      </div>
                      <div class="col-md-6">
                        <label for="lastName" class="form-label fw-medium text-muted">Last Name</label>
                        <input type="text" class="form-control rounded-pill-input" id="lastName" v-model="editedProfile.lastName" :disabled="!isEditing" />
                      </div>
                    </div>
                    <div class="row g-3 mb-3">
                      <div class="col-md-6">
                        <label for="email" class="form-label fw-medium text-muted">Email Address</label>
                        <input type="email" class="form-control rounded-pill-input" id="email" :value="profile.email" disabled />
                      </div>
                      <div class="col-md-6">
                        <label for="phone" class="form-label fw-medium text-muted">Phone Number</label>
                        <input type="tel" class="form-control rounded-pill-input" id="phone" v-model="editedProfile.phone" :disabled="!isEditing" />
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="address" class="form-label fw-medium text-muted">Street Address</label>
                      <input type="text" class="form-control rounded-pill-input" id="address" v-model="editedProfile.address" :disabled="!isEditing" />
                    </div>
                    <div class="row g-3 mb-3">
                      <div class="col-md-4">
                        <label for="city" class="form-label fw-medium text-muted">City</label>
                        <input type="text" class="form-control rounded-pill-input" id="city" v-model="editedProfile.city" :disabled="!isEditing" />
                      </div>
                      <div class="col-md-4">
                        <label for="state" class="form-label fw-medium text-muted">State</label>
                        <input type="text" class="form-control rounded-pill-input" id="state" v-model="editedProfile.state" :disabled="!isEditing" />
                      </div>
                      <div class="col-md-4">
                        <label for="zipCode" class="form-label fw-medium text-muted">ZIP Code</label>
                        <input type="text" class="form-control rounded-pill-input" id="zipCode" v-model="editedProfile.zipCode" :disabled="!isEditing" />
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="bio" class="form-label fw-medium text-muted">Bio</label>
                      <textarea class="form-control rounded-textarea" id="bio" v-model="editedProfile.bio" :disabled="!isEditing" rows="4"></textarea>
                      <small class="form-text text-muted">Tell us a little about yourself (e.g., your interests, experience).</small>
                    </div>
                    <div v-if="isEditing" class="d-flex justify-content-end mt-4">
                      <button type="button" class="btn btn-outline-secondary rounded-pill px-4 me-2 animate-btn" @click="cancelEdit">Cancel</button>
                      <button type="submit" class="btn btn-primary rounded-pill px-4 animate-btn">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="verification-tab">
              <div class="card border-0 rounded-4 shadow-sm">
                <div class="card-body p-4 text-center">
                  <i class="bi bi-file-earmark-person-fill text-primary display-3 mb-3"></i>
                  <h5 class="fw-bold text-dark mb-2">Complete Your Identity Verification</h5>
                  <p class="text-muted mb-4">
                    To unlock full features and build trust, please upload a valid government-issued ID.
                    This helps us ensure a secure community for everyone.
                  </p>
                  <button class="btn btn-primary rounded-pill px-4 py-2 animate-btn">
                    <i class="bi bi-cloud-arrow-up-fill me-2"></i> Upload ID
                  </button>
                </div>
              </div>
            </div>

            <div class="tab-pane fade" id="security-tab">
              <div class="card border-0 rounded-4 shadow-sm">
                <div class="card-header bg-white py-3 px-4 border-bottom-0 rounded-top-4">
                  <h6 class="mb-0 fw-bold text-dark">Security Settings</h6>
                </div>
                <div class="card-body p-4">
                  <div class="d-grid gap-3">
                    <button class="btn btn-outline-primary-dashed rounded-pill py-2 animate-btn">
                      <i class="bi bi-key-fill me-2"></i> Change Password
                    </button>
                    <button class="btn btn-outline-primary-dashed rounded-pill py-2 animate-btn">
                      <i class="bi bi-shield-lock-fill me-2"></i> Enable Two-Factor Authentication
                    </button>
                    <button class="btn btn-outline-primary-dashed rounded-pill py-2 animate-btn">
                      <i class="bi bi-clock-history me-2"></i> View Login History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const INITIAL_PROFILE = {
  firstName: "", lastName: "", email: "", phone: "", avatar: "",
  address: "", city: "", state: "", zipCode: "", bio: "",
  rating: 0, reviewCount: 0, totalDeliveries: 0,
  verificationStatus: {
    email: false, phone: false, identity: false, address: false,
  },
};

export default {
  data() {
    return {
      isEditing: false,
      profile: { ...INITIAL_PROFILE },
      editedProfile: { ...INITIAL_PROFILE },
      alert: { // New data property for alerts
        personalInfo: {
          message: '',
          type: '', // success, danger, info
        },
        // You can add more alert objects for other sections if needed
      },
    };
  },
  computed: {
    verificationProgress() {
      const checks = [
        !!this.profile.email,
        !!this.profile.phone,
        !!this.profile.address,
        !!this.profile.city,
        !!this.profile.state,
        !!this.profile.zipCode,
        !!this.profile.bio,
      ];
      const filled = checks.filter(Boolean).length;
      const totalChecks = checks.length;
      return totalChecks > 0 ? (filled / totalChecks) * 100 : 0;
    },
    verificationLabels() {
      return {
        "Email Address": !!this.profile.email,
        "Phone Number": !!this.profile.phone,
        "Address Information": !!this.profile.address && !!this.profile.city && !!this.profile.state && !!this.profile.zipCode,
        "Bio Provided": !!this.profile.bio,
      };
    },
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const userEmail = this.$store.state.user;
      if (!userEmail) {
        console.error("User email not found in store.");
        this.showAlert('personalInfo', 'Error: User not logged in.', 'danger');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      try {
        const res = await fetch(`${baseUrl}profile?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        if (data.profile) {
          const fetchedProfile = data.profile;
          this.profile = {
            firstName: fetchedProfile.first_name || "",
            lastName: fetchedProfile.last_name || "",
            email: fetchedProfile.email || userEmail,
            phone: fetchedProfile.phone || "",
            avatar: fetchedProfile.avatar || "",
            address: fetchedProfile.address || "",
            city: fetchedProfile.city || "",
            state: fetchedProfile.state || "",
            zipCode: fetchedProfile.zip_code || "",
            bio: fetchedProfile.bio || "",
            rating: fetchedProfile.rating || 0,
            reviewCount: fetchedProfile.review_count || 0,
            totalDeliveries: fetchedProfile.total_deliveries || 0,
            verificationStatus: {
              email: !!fetchedProfile.email,
              phone: !!fetchedProfile.phone,
              identity: !!fetchedProfile.identity_doc_url,
              address: !!fetchedProfile.address,
            },
          };
          this.editedProfile = { ...this.profile };
        } else {
          console.warn("Profile data not found in response, initializing with default.");
          this.profile.email = userEmail;
          this.editedProfile.email = userEmail;
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        this.showAlert('personalInfo', 'Failed to load profile data.', 'danger');
      }
    },
    async saveEdit() {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const payload = {
        email: this.profile.email,
        first_name: this.editedProfile.firstName,
        last_name: this.editedProfile.lastName,
        phone: this.editedProfile.phone,
        address: this.editedProfile.address,
        city: this.editedProfile.city,
        state: this.editedProfile.state,
        zip_code: this.editedProfile.zipCode,
        bio: this.editedProfile.bio,
        rating: this.editedProfile.rating,
        review_count: this.editedProfile.reviewCount,
        total_deliveries: this.editedProfile.totalDeliveries,
        is_email_verified: !!this.editedProfile.email,
        is_phone_verified: !!this.editedProfile.phone,
        is_address_verified: !!this.editedProfile.address,
      };

      try {
        const res = await fetch(`${baseUrl}profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          this.profile = { ...this.editedProfile };
          this.isEditing = false;
          this.showAlert('personalInfo', 'Profile updated successfully!', 'success');
          // Reload if necessary, but ideally Vue's reactivity handles updates
          // setTimeout(() => window.location.reload(), 500);
        } else {
          const errorData = await res.json();
          this.showAlert('personalInfo', errorData.message || 'Failed to update profile.', 'danger');
        }
      } catch (err) {
        console.error('Error saving profile:', err);
        this.showAlert('personalInfo', 'Error occurred during profile update.', 'danger');
      }
    },
    cancelEdit() {
      this.editedProfile = { ...this.profile };
      this.isEditing = false;
      this.showAlert('personalInfo', 'Edit cancelled.', 'info');
    },
    getColorFromUsername(email) {
      if (!email || typeof email !== 'string' || email.length === 0) return "#888";
      const username = email.split("@")[0];
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      return `hsl(${hash % 360}, 70%, 50%)`;
    },
    showAlert(section, message, type) {
      // Clear any existing alert first for a fresh display
      this.alert[section].message = '';
      this.alert[section].type = '';

      // Set the new alert
      this.alert[section].message = message;
      this.alert[section].type = type;

      // Automatically hide the alert after a few seconds
      setTimeout(() => {
        this.alert[section].message = '';
      }, 5000); // Alert disappears after 5 seconds
    },
  },
};
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'; /* For subtle entrance animations */

/* General Card Styling */
.card {
  border-radius: 1.5rem !important; /* Consistent rounded corners */
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.05) !important; /* Lighter, modern shadow */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.08) !important;
}

.card-header {
  background-color: white !important;
  border-bottom: none !important; /* Remove default border */
  padding-bottom: 0 !important; /* Adjust padding */
}

h2 {
  font-size: 2.5rem;
  color: var(--bs-dark);
}

h5, h6 {
  font-weight: 700 !important;
}

.text-dark {
    color: var(--bs-dark) !important;
}

.text-muted {
    color: var(--bs-secondary) !important;
}

.fw-bold {
    font-weight: 700 !important;
}

.fw-medium {
    font-weight: 500 !important;
}


/* --- Profile Summary Card --- */
.profile-summary-card {
    background: linear-gradient(135deg, var(--bs-light), var(--bs-white)); /* Soft gradient */
}

.profile-avatar {
  width: 70px; /* Larger avatar */
  height: 70px;
  border-radius: 50% !important;
  font-size: 32px; /* Larger initial text */
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.1); /* Subtle shadow for avatar */
  background-color: var(--bs-primary); /* Fallback color */
  border: 3px solid white; /* White border around avatar */
}

.profile-summary-card .h5 {
  font-size: 1.5rem;
}

.profile-summary-card .small {
  font-size: 0.85rem;
}

.profile-summary-card .bi-star-fill, .profile-summary-card .bi-star {
  font-size: 1.2rem; /* Larger stars */
}

.border-dashed {
  border-style: dashed !important;
  border-color: var(--bs-border-color-translucent) !important;
}

/* --- Verification Status Card --- */
.verification-status-card .progress {
  height: 0.5rem !important; /* Slimmer progress bar */
  border-radius: 0.5rem !important;
  background-color: var(--bs-light);
}

.verification-status-card .progress-bar {
  border-radius: 0.5rem !important;
  background-color: var(--bs-primary) !important; /* Use primary color */
}

.verification-status-card .list-group-item {
  border-bottom: 1px dashed var(--bs-border-color-translucent) !important; /* Dashed borders for list items */
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.verification-status-card .list-group-item:last-child {
  border-bottom: none !important;
}

.verification-status-card .bi {
  font-size: 1.25rem; /* Larger icons in list */
}

.badge.rounded-pill {
  font-size: 0.75em;
  padding: 0.4em 0.9em;
  font-weight: 600;
}

.bg-success-subtle {
    background-color: var(--bs-success-bg-subtle) !important;
    color: var(--bs-success-text-emphasis) !important;
}

.bg-secondary-subtle {
    background-color: var(--bs-secondary-bg-subtle) !important;
    color: var(--bs-secondary-text-emphasis) !important;
}


/* --- Profile Tabs --- */
.custom-nav-pills .nav-link {
  color: var(--bs-dark);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem; /* Pill shape */
  transition: all 0.3s ease;
  background-color: var(--bs-light); /* Light background for inactive tabs */
  margin-right: 0.75rem; /* Space between pills */
}

.custom-nav-pills .nav-link.active {
  background-color: var(--bs-primary);
  color: white;
  box-shadow: 0 0.25rem 0.75rem rgba(var(--bs-primary-rgb), 0.2);
  transform: translateY(-2px); /* Slight lift for active tab */
}

.custom-nav-pills .nav-link:hover:not(.active) {
  background-color: var(--bs-gray-200);
  color: var(--bs-primary);
  transform: translateY(-1px);
}

/* --- Form Elements --- */
.form-label {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: var(--bs-secondary);
}

.form-control {
  border-radius: 0.75rem; /* Consistent input border-radius */
  padding: 0.75rem 1rem;
  border-color: var(--bs-border-color);
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
  background-color: var(--bs-white);
}

.form-control:disabled {
  background-color: var(--bs-light);
  opacity: 0.8;
}

.rounded-pill-input {
  border-radius: 50rem !important; /* Full pill shape for inputs */
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.rounded-textarea {
    border-radius: 1rem !important; /* Slightly rounded for textareas */
    padding: 1rem;
}

/* --- Buttons --- */
.btn {
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.btn-primary-light {
    background-color: var(--bs-primary-bg-subtle);
    color: var(--bs-primary-text-emphasis);
    border-color: var(--bs-primary-border-subtle);
}

.btn-primary-light:hover {
    background-color: var(--bs-primary);
    color: white;
    box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.2);
}

.btn-outline-primary-dashed {
  border: 1px dashed var(--bs-primary) !important;
  color: var(--bs-primary) !important;
}

.btn-outline-primary-dashed:hover {
  background-color: var(--bs-primary) !important;
  color: white !important;
  box-shadow: 0 0.25rem 0.5rem rgba(var(--bs-primary-rgb), 0.2);
  transform: translateY(-1px);
}

.btn.rounded-pill {
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
}

.animate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.3rem 0.7rem rgba(0, 0, 0, 0.1);
}

/* --- Verification Tab Empty State --- */
.verification-tab .card .card-body {
    padding: 3rem !important;
}

.verification-tab .bi.display-3 {
    font-size: 4rem !important;
    line-height: 1;
}

/* Animate.css integration */
.animate__animated {
  --animate-duration: 0.5s;
}
.animate__fadeInLeft {
  --animate-delay: 0.1s;
}
.animate__fadeInRight {
  --animate-delay: 0.2s;
}
.animate__fadeInDown {
  --animate-delay: 0s;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .custom-nav-pills {
    justify-content: center !important; /* Center tabs on small screens */
  }
}
</style>