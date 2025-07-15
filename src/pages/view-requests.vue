<template>
  <div class="delivery-requests-container">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h2 fw-bold mb-0">Delivery Requests</h2>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-success" style="width: 3rem; height: 3rem" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Finding packages that match your route...</p>
      </div>

      <div v-else>
        <div v-if="requests.length === 0" class="alert alert-light text-center p-5 border-dashed">
          <i class="bi bi-box-seam fs-1 text-muted"></i>
          <p class="mt-3 mb-0">No delivery requests available at this time.</p>
        </div>

        <div v-else>
          <div
            v-for="(request, index) in requests"
            :key="request.product_id"
            class="card request-card mb-4 shadow-sm"
          >
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title fw-bold">{{ request.item_type }}</h5>
                  <p class="card-subtitle text-muted">{{ request.item_description }}</p>
                </div>
                <span class="badge bg-success-soft text-success-dark fs-6">
                  Budget: ₹{{ request.budget }}
                </span>
              </div>

              <div class="row mb-3">
                <div class="col-md-6 mb-3 mb-md-0">
                  <p class="mb-1 fw-medium"><i class="bi bi-box-arrow-up-right me-2"></i><strong>Pickup:</strong></p>
                  <p class="text-muted ps-4">{{ request.pickup_address }}</p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1 fw-medium"><i class="bi bi-box-arrow-in-down-right me-2"></i><strong>Dropoff:</strong></p>
                  <p class="text-muted ps-4">{{ request.dropoff_address }}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3 mb-md-0">
                   <p class="mb-1 fw-medium"><i class="bi bi-person-check me-2"></i><strong>Receiver:</strong></p>
                   <p class="text-muted ps-4">{{ request.receiver_name }} - {{ request.receiver_phone }}</p>
                </div>
                  <div class="col-md-6">
                     <p class="mb-1 fw-medium"><i class="bi bi-clock me-2"></i><strong>Timeframe:</strong></p>
                     <p class="text-muted ps-4">{{ getTimeframeLabel(request.delivery_timeframe) }}</p>
                  </div>
              </div>

              <div v-if="request.special_instructions" class="mt-3">
                <p class="fw-medium"><i class="bi bi-chat-left-dots me-2"></i><strong>Special Instructions:</strong></p>
                <p class="text-muted fst-italic ps-4">"{{ request.special_instructions }}"</p>
              </div>

              <div v-if="request.special_requirements?.length" class="mt-3">
                <p class="fw-medium"><strong>Special Requirements:</strong></p>
                <ul class="list-unstyled ps-4">
                  <li v-for="req in request.special_requirements" :key="req" class="text-muted">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>{{ req }}
                  </li>
                </ul>
              </div>

              <hr class="my-4" />

              <div class="d-flex flex-wrap align-items-center justify-content-between">
              <div class="me-3 mb-2 mb-md-0">
                <span v-if="request.confirmation_by_sender && request.confirmation_by_sender == $route.query.transportTripId" class="badge bg-success-soft text-success-dark"><i class="bi bi-check-circle-fill me-1"></i> Confirmed by Sender</span>
                <span v-else-if="request.confirmation_by_sender && request.confirmation_by_sender != $route.query.transportTripId" class="badge bg-danger-soft text-danger-dark"><i class="bi bi-x-circle-fill me-1"></i> Not Confirmed for Your Trip</span>
                <span v-else-if="request.accepted_travel_id != null" class="badge bg-info-soft text-info-dark"><i class="bi bi-hourglass-split me-1"></i> Awaiting Sender Confirmation</span>
                <span v-else-if="acceptedRequest === request.product_id" class="badge bg-warning-soft text-warning-dark"><i class="bi bi-send-check-fill me-1"></i> Request Sent</span>
                
                <span v-else class="badge bg-secondary-soft text-secondary-dark"><i class="bi bi-question-circle me-1"></i> Pending</span>
              </div>

                <div class="d-flex flex-wrap gap-2">
                  <button
                    class="btn btn-success"
                    :disabled="acceptedRequest !== null || request.accepted_travel_id != null || isoneaccepted || request.confirmation_by_sender != null"
                    @click="handleAcceptRequest(request.product_id)"
                  >
                    <i class="bi bi-check-lg me-1"></i>
                    <span v-if="acceptedRequest === request.product_id">Accepted!</span>
                    <span v-else>Accept (₹{{ request.budget }})</span>
                  </button>
                  <button class="btn btn-outline-secondary"><i class="bi bi-chat-dots me-1"></i> Message</button>
                  <button class="btn btn-outline-secondary"><i class="bi bi-telephone me-1"></i> Call</button>
                </div>
              </div>

              <div v-if="request.confirmation_by_sender && request.confirmation_by_sender == $route.query.transportTripId" class="confirmation-section mt-4 p-3 bg-light rounded">
                <div class="d-flex align-items-center mb-3">
                    <div class="box me-3" :ref="'box-' + index">GO</div>
                    <p class="text-success fw-bold mb-0">Sender has confirmed this request. Please upload proof of pickup.</p>
                </div>

                <div class="mb-3">
                    <label :for="'file-upload-' + index" class="btn btn-outline-primary w-100" :class="{ 'disabled': tempblobs.length >= maxFilesAllowed }">
                        <i class="bi bi-upload me-2"></i> Choose Files to Upload ({{ tempblobs.length }}/{{ maxFilesAllowed }})
                    </label>
                    <input
                        :id="'file-upload-' + index"
                        type="file"
                        multiple
                        ref="fileInput"
                        @change="handleFiles"
                        accept="image/*" class="d-none"
                        :disabled="tempblobs.length >= maxFilesAllowed"
                    />
                </div>
                
                <div v-if="tempblobUrls.length" class="mb-3">
                  <h6 class="fw-bold">Selected Files for Upload:</h6>
                  <div class="row gx-3 gy-3">
                    <div
                      v-for="(url, i) in tempblobUrls"
                      :key="'selected-preview-' + i"
                      class="col-md-4 col-sm-6"
                    >
                      <div class="file-preview-card">
                        <img v-if="isImage(tempblobs[i])" :src="url" class="img-fluid rounded" />
                        <a v-else :href="url" target="_blank" class="d-block p-3 text-center">
                          <i class="bi bi-file-earmark-arrow-down fs-1"></i>
                          <p>File {{ i + 1 }}</p>
                        </a>
                        <div class="file-info p-2">
                          <small>Size: {{ (tempblobs[i].size / 1024).toFixed(2) }} KB</small><br/>
                          <small>Type: {{ tempblobs[i].type }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div class="d-flex gap-2 mb-3">
                   <button class="btn btn-primary w-100" @click="uploadFiles(request.product_id, request.confirmation_by_sender)">
                     <i class="bi bi-cloud-arrow-up-fill me-2"></i> Upload
                   </button>
                   <button class="btn btn-secondary w-100" @click="fetchAllBlobs(request.product_id, request.confirmation_by_sender)">
                     <i class="bi bi-arrow-down-circle me-2"></i> Fetch Uploaded Files
                   </button>
                </div>

                <div v-if="usertempblobUrls.length">
                  <h6 class="fw-bold">Uploaded Files:</h6>
                  <div class="row gx-3 gy-3">
                    <div
                      v-for="(url, i) in usertempblobUrls"
                      :key="'uploaded-preview-' + i"
                      class="col-md-4 col-sm-6"
                    >
                      <div class="file-preview-card">
                        <img v-if="isImage(usertempblobs[i])" :src="url" class="img-fluid rounded" />
                        <video v-else-if="isVideo(usertempblobs[i])" :src="url" controls class="img-fluid rounded"></video>
                        <a v-else :href="url" target="_blank" class="d-block p-3 text-center">
                          <i class="bi bi-file-earmark-arrow-down fs-1"></i>
                          <p>Download File {{ i + 1 }}</p>
                        </a>
                        <div class="file-info p-2">
                          <small>Size: {{ (usertempblobs[i].size / 1024).toFixed(2) }} KB</small><br/>
                          <small>Type: {{ usertempblobs[i].type }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center mt-4">
                    <button
                      @click="confirmDeliverylast(request.product_id, request.confirmation_by_sender,request.otp)"
                      class="btn btn-success btn-lg px-4 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    >
                      <i class="bi bi-check-circle-fill"></i>
                      Confirm Delivery
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
import { gsap } from 'gsap';
import { encryptUserData } from "../cry";

export default {
  data() {
    return {
      requests: [],
      acceptedRequest: null,
      isLoading: true,
      isoneaccepted: false,
      tempblobs: [], // This will now only store up to 3 blobs for new selection
      tempblobUrls: [], // This will now only store up to 3 blob URLs for new selection
      usertempblobs: [], // For already uploaded files fetched from server
      usertempblobUrls: [], // For URLs of already uploaded files
      maxFilesAllowed: 3, // Defines the maximum number of images allowed
    };
  },
  created() {
    this.getRequests();
  },
  methods: {
    async confirmDeliverylast(productId, confirmedBy, otp) {
      const datatopage = {
        productId: productId,
        confirmationBySender: confirmedBy,
        transportTripId: this.$route?.query?.transportTripId,
        email: this.$store.getters.getUser.email,
        otp: otp,
      };
      const id = encryptUserData(datatopage);

      this.$router.push({
        name: 'CnfDelivery',
        params: { id: id },
      });
      // Error handling for navigation is typically done via router hooks or global error handling.
      // The original 'error' variable was not defined in this scope.
    },
    showToast(message, variant = 'info') {
      // For a real application, replace this with a proper toast notification system (e.g., Bootstrap 5's toast, Vue-Toastification)
      alert(message);
    },
    getRequests() {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const email = this.$store.getters.getUser.email;
      const transportTripId = this.$route?.query?.transportTripId || null;
      const query = `email=${encodeURIComponent(email)}&transportTripId=${encodeURIComponent(transportTripId)}`;

      fetch(`${baseUrl}api/view-requests?${query}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          this.requests = data.deliveryRequests || [];
          // Check if any request has an accepted_travel_id, indicating one is already taken
          this.isoneaccepted = this.requests.some(req => req.accepted_travel_id != null);
          this.isLoading = false;
        })
        .catch(err => {
          console.error("Error fetching requests:", err);
          this.isLoading = false;
          this.showToast('Failed to load delivery requests.', 'danger');
        });
    },

    handleFiles(event) {
      const selectedFiles = Array.from(event.target.files);

      // Reset tempblobs and tempblobUrls to only hold the *new* selection
      this.tempblobs = [];
      this.tempblobUrls = [];

      // Filter for image files only and respect the maxFilesAllowed limit
      const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/')).slice(0, this.maxFilesAllowed);

      if (selectedFiles.length > imageFiles.length) {
          // Inform user if non-image files were selected
          this.showToast('Only image files are allowed. Other selected files were ignored.');
      }
      
      if (imageFiles.length === 0 && selectedFiles.length > 0) {
        this.showToast('No valid image files were selected.');
        event.target.value = null; // Clear input if no images are valid
        return;
      }


      if (imageFiles.length > this.maxFilesAllowed) {
        this.showToast(`You can select a maximum of ${this.maxFilesAllowed} images. Only the first ${this.maxFilesAllowed} will be processed.`);
      }

      imageFiles.forEach(file => {
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);
        this.tempblobs.push(blob);
        this.tempblobUrls.push(url);
      });

      // Clear the input element's value to ensure 'change' event fires if the same files are selected again
      event.target.value = '';
    },

    async uploadFiles(productId, confirmationBySender) {
      if (this.tempblobs.length === 0) {
        this.showToast('Please select at least one file to upload.', 'warning');
        return;
      }

      // Indicate loading for user if you have a UI for it
      // this.isUploading = true;

      const email = this.$store.getters.getUser.email;
      const filesAsBase64 = await Promise.all(
        this.tempblobs.map(blob => this.blobToBase64(blob))
      );

      const payload = {
        email,
        productId,
        confirmationBySender,
        files: filesAsBase64.map((base64, i) => ({
          base64,
          type: this.tempblobs[i].type,
          size: this.tempblobs[i].size,
        })),
      };

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      fetch(`${baseUrl}photoupload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(() => {
          this.showToast('Files uploaded successfully!', 'success');
          this.tempblobs = []; // Clear selected files after upload
          this.tempblobUrls = []; // Clear selected file URLs
          // The ref 'fileInput' might be an array if used with v-for, so access the first element
          if (this.$refs.fileInput) {
            const fileInputEl = Array.isArray(this.$refs.fileInput) ? this.$refs.fileInput[0] : this.$refs.fileInput;
            if (fileInputEl) {
              fileInputEl.value = null; // Clear the file input visually
            }
          }
          this.fetchAllBlobs(productId, confirmationBySender); // Refresh the list of uploaded files
        })
        .catch(err => {
          console.error("Upload failed:", err);
          this.showToast('Failed to upload files. Please try again.', 'danger');
        })
        .finally(() => {
          // this.isUploading = false;
        });
    },

    async fetchAllBlobs(productId, confirmationBySender) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}get-photoupload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.$store.getters.getUser.email,
            productId,
            confirmationBySender,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!Array.isArray(result.data)) {
          console.warn("Server response for fetching blobs is not an array:", result);
          this.usertempblobs = [];
          this.usertempblobUrls = [];
          return; // Exit if data is not as expected
        }

        let allBlobs = [];
        result.data.forEach(record => {
          if (Array.isArray(record.files)) {
            record.files.forEach(file => {
              if (file?.base64 && file?.type) {
                const blob = this.base64ToBlob(file.base64, file.type);
                allBlobs.push(blob);
              }
            });
          }
        });

        // Revoke old URLs before creating new ones to prevent memory leaks
        this.usertempblobUrls.forEach(url => URL.revokeObjectURL(url));

        this.usertempblobs = allBlobs;
        this.usertempblobUrls = allBlobs.map(blob => URL.createObjectURL(blob));
        // this.showToast('Uploaded files fetched successfully!', 'info'); // Optional success toast
      } catch (err) {
        console.error("Fetch error:", err);
        this.showToast('Failed to fetch uploaded files.', 'danger');
      }
    },

    handleAcceptRequest(productId) {
      this.acceptedRequest = productId; // Temporarily mark as accepted in UI
      const data = {
        requestId: productId,
        email: this.$store.getters.getUser.email,
        status: "accepted",
        transportTripId: this.$route?.query?.transportTripId,
        acceptedAt: new Date().toISOString(),
      };

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      fetch(`${baseUrl}api/accepted-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(serverRes => {
          console.log("Server response on accept:", serverRes);
          this.showToast('Request accepted successfully! Awaiting sender confirmation.', 'success');
          this.getRequests(); // Re-fetch requests to update the status in the UI
        })
        .catch(err => {
          console.error("Accept error:", err);
          this.showToast('Failed to accept request. Please try again.', 'danger');
          this.acceptedRequest = null; // Revert UI if acceptance fails
        });
    },
    
    goAnimations(index) {
      const boxEl = this.$refs['box-' + index];
      if (boxEl && typeof gsap !== 'undefined') {
        gsap.fromTo(boxEl, { scale: 0.5, opacity: 0, rotation: -180 }, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)"
        });
      }
    },

    getTimeframeLabel(timeframe) {
      const labels = {
        "same-day": "Same Day",
        "next-day": "Next Day",
        "2-3-days": "2-3 Days",
        "flexible": "Flexible",
      };
      return labels[timeframe] || timeframe;
    },

    // Helper to convert Blob to Base64 string
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    // Helper to convert Base64 string back to Blob
    base64ToBlob(base64, mimeType) {
      const byteCharacters = atob(base64.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
    },

    isImage(blob) {
      return blob?.type?.startsWith("image/");
    },
    isVideo(blob) {
      return blob?.type?.startsWith("video/");
    },
  },

  beforeUnmount() {
    // Clean up created object URLs to prevent memory leaks
    this.tempblobUrls.forEach(url => URL.revokeObjectURL(url));
    this.usertempblobUrls.forEach(url => URL.revokeObjectURL(url));
  },
  watch: {
    // Watch 'requests' to trigger GSAP animation when confirmation status changes
    requests: {
      handler(newRequests, oldRequests) {
        newRequests.forEach((newItem, index) => {
          const oldItem = oldRequests ? oldRequests.find(req => req.product_id === newItem.product_id) : undefined;
          const shouldAnimate =
            newItem.confirmation_by_sender !== null &&
            (!oldItem || oldItem.confirmation_by_sender === null);

          if (shouldAnimate) {
            this.$nextTick(() => {
              this.goAnimations(index);
            });
          }
        });
      },
      deep: true, // Watch for nested changes in array objects
      immediate: true // Run handler immediately on component creation
    }
  },
};
</script>

<style scoped>
/* General Styling */
.delivery-requests-container {
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif; /* A modern, clean font */
}

.fw-medium {
  font-weight: 500;
}

/* Card Styling */
.request-card {
  border: none;
  border-radius: 0.75rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.request-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.card-title {
  color: #212529;
}

.card-subtitle {
  font-size: 0.9rem;
}

/* Soft-colored Badges */
.bg-success-soft { background-color: rgba(25, 135, 84, 0.1); }
.text-success-dark { color: #0f5132; }
.bg-info-soft { background-color: rgba(13, 202, 240, 0.1); }
.text-info-dark { color: #0a58ca; }
.bg-warning-soft { background-color: rgba(255, 193, 7, 0.1); }
.text-warning-dark { color: #664d03; }
.bg-danger-soft { background-color: rgba(220, 53, 69, 0.1); }
.text-danger-dark { color: #842029; }
.bg-secondary-soft { background-color: rgba(108, 117, 125, 0.1); }
.text-secondary-dark { color: #41464b; }

.badge {
    padding: 0.5em 0.75em;
    font-weight: 600;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
}

/* Dashed Border for Empty State */
.border-dashed {
  border: 2px dashed #dee2e6;
  border-radius: 0.75rem;
}

/* Confirmation and Upload Section */
.confirmation-section {
  border: 1px solid #e9ecef;
}

.box {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle at 30% 30%, #4da3f0, #216db3);
  border-radius: 50%;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

/* File Preview Styling */
.file-preview-card {
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
    background-color: #f8f9fa;
}

.file-preview-card .file-info {
    background-color: rgba(255, 255, 255, 0.9);
    font-size: 0.75rem;
}

.file-preview-card video, .file-preview-card img {
    display: block;
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.btn i {
    vertical-align: middle;
}

/* Style for disabled file upload button */
.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>