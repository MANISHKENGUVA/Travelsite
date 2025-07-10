<template>
  <div class="settings-container d-flex justify-content-center align-items-stretch min-vh-100 p-3">
    <div class="settings-card shadow-lg rounded-4 d-flex flex-column flex-md-row animate__animated animate__fadeIn">
      <aside class="settings-sidebar p-4 rounded-start-4">
        <h3 class="mb-4 text-primary-emphasis fw-bold d-flex align-items-center">
          <i class="bi bi-gear-fill me-2"></i> Settings
        </h3>
        <nav class="nav flex-column">
          <a
            v-for="section in sections"
            :key="section.id"
            :class="['nav-link', 'd-flex', 'align-items-center', 'py-2', 'mb-2', { 'active': currentSection === section.id }]"
            @click="selectSection(section.id)"
          >
            <i :class="['bi', section.icon, 'me-3']"></i>
            <span>{{ section.name }}</span>
            <i v-if="section.beta" class="badge bg-info-subtle text-info ms-auto">Beta</i>
          </a>
        </nav>
      </aside>

      <div class="settings-content p-4 p-md-5 rounded-end-4 flex-grow-1">
        <section v-if="currentSection === 'account'" class="animate__animated animate__fadeInRight animate__fast">
          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-person-circle me-2"></i> Account Settings
          </h4>
          <form @submit.prevent="saveProfile">
            <div class="mb-4 text-center">
              <img :src="userProfile.avatar || 'https://via.placeholder.com/100/FFDDC1/FF884D?text=A'"
                   alt="User Avatar"
                   class="rounded-circle avatar-lg mb-3 shadow-sm">
              <input type="file" @change="handleAvatarUpload" class="form-control form-control-sm w-auto mx-auto d-block">
              <small class="text-muted mt-2 d-block">Max 2MB. JPG, PNG.</small>
            </div>

            <div class="mb-3">
              <label for="fullName" class="form-label fw-semibold">Full Name</label>
              <input type="text" v-model="userProfile.name" class="form-control form-control-lg" id="fullName" placeholder="Your full name">
              <div v-if="profileErrors.name" class="text-danger mt-1">{{ profileErrors.name }}</div>
            </div>
            <div class="mb-3">
              <label for="emailAddress" class="form-label fw-semibold">Email Address</label>
              <input type="email" v-model="userProfile.email" class="form-control form-control-lg" id="emailAddress" placeholder="Your email address" disabled>
              <small class="text-muted d-block mt-1">Email cannot be changed directly here. Contact support for changes.</small>
            </div>
            <button type="submit" class="btn btn-primary btn-lg mt-3" :disabled="loading.profile">
              <span v-if="!loading.profile"><i class="bi bi-save me-2"></i> Save Profile</span>
              <span v-else class="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span v-if="loading.profile" class="ms-2">Saving...</span>
            </button>
          </form>

          <hr class="my-5">

          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-key-fill me-2"></i> Change Password
          </h4>
          <form @submit.prevent="changePassword">
            <div class="mb-3">
              <label for="currentPassword" class="form-label fw-semibold">Current Password</label>
              <input type="password" v-model="passwordForm.current" class="form-control form-control-lg" id="currentPassword" placeholder="Enter current password">
              <div v-if="passwordErrors.current" class="text-danger mt-1">{{ passwordErrors.current }}</div>
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label fw-semibold">New Password</label>
              <input type="password" v-model="passwordForm.new" class="form-control form-control-lg" id="newPassword" placeholder="Enter new password">
              <div v-if="passwordErrors.new" class="text-danger mt-1">{{ passwordErrors.new }}</div>
            </div>
            <div class="mb-3">
              <label for="confirmNewPassword" class="form-label fw-semibold">Confirm New Password</label>
              <input type="password" v-model="passwordForm.confirm" class="form-control form-control-lg" id="confirmNewPassword" placeholder="Confirm new password">
              <div v-if="passwordErrors.confirm" class="text-danger mt-1">{{ passwordErrors.confirm }}</div>
            </div>
            <button type="submit" class="btn btn-warning btn-lg mt-3" :disabled="loading.password">
              <span v-if="!loading.password"><i class="bi bi-lock-fill me-2"></i> Change Password</span>
              <span v-else class="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span v-if="loading.password" class="ms-2">Updating...</span>
            </button>
          </form>
        </section>

        <section v-else-if="currentSection === 'general'" class="animate__animated animate__fadeInRight animate__fast">
          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-sliders me-2"></i> General Settings
          </h4>
          <div class="mb-4 d-flex align-items-center justify-content-between p-3 rounded-3 border">
            <div>
              <label for="themeToggle" class="form-label fw-semibold mb-0">Dark Mode</label>
              <p class="text-muted small mb-0">Switch between light and dark themes.</p>
            </div>
            <div class="form-check form-switch ms-3">
              <input class="form-check-input" type="checkbox" id="themeToggle" v-model="generalSettings.darkMode" @change="toggleTheme">
            </div>
          </div>

          <div class="mb-4 d-flex align-items-center justify-content-between p-3 rounded-3 border">
            <div>
              <label for="languageSelect" class="form-label fw-semibold mb-0">Language</label>
              <p class="text-muted small mb-0">Select your preferred language.</p>
            </div>
            <select v-model="generalSettings.language" class="form-select w-auto ms-3" id="languageSelect" @change="saveGeneralSettings">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <p class="text-success mt-3" v-if="generalSuccessMessage"><i class="bi bi-check-circle me-2"></i>{{ generalSuccessMessage }}</p>
          <p class="text-danger mt-3" v-if="generalErrorMessage"><i class="bi bi-exclamation-triangle me-2"></i>{{ generalErrorMessage }}</p>
        </section>

        <section v-else-if="currentSection === 'notifications'" class="animate__animated animate__fadeInRight animate__fast">
          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-bell-fill me-2"></i> Notification Settings
          </h4>
          <div class="mb-3 d-flex align-items-center justify-content-between p-3 rounded-3 border">
            <div>
              <label for="emailNotifications" class="form-label fw-semibold mb-0">Email Notifications</label>
              <p class="text-muted small mb-0">Receive important updates via email.</p>
            </div>
            <div class="form-check form-switch ms-3">
              <input class="form-check-input" type="checkbox" id="emailNotifications" v-model="notificationSettings.email" @change="saveNotificationSettings">
            </div>
          </div>
          <div class="mb-3 d-flex align-items-center justify-content-between p-3 rounded-3 border">
            <div>
              <label for="inAppNotifications" class="form-label fw-semibold mb-0">In-App Notifications</label>
              <p class="text-muted small mb-0">Get alerts directly within the application.</p>
            </div>
            <div class="form-check form-switch ms-3">
              <input class="form-check-input" type="checkbox" id="inAppNotifications" v-model="notificationSettings.inApp" @change="saveNotificationSettings">
            </div>
          </div>
          <div class="mb-3 d-flex align-items-center justify-content-between p-3 rounded-3 border">
            <div>
              <label for="smsNotifications" class="form-label fw-semibold mb-0">SMS Notifications <span class="badge bg-warning-subtle text-warning">Optional</span></label>
              <p class="text-muted small mb-0">Receive critical alerts via SMS (charges may apply).</p>
            </div>
            <div class="form-check form-switch ms-3">
              <input class="form-check-input" type="checkbox" id="smsNotifications" v-model="notificationSettings.sms" @change="saveNotificationSettings">
            </div>
          </div>
          
          <p class="text-success mt-3" v-if="notificationSuccessMessage"><i class="bi bi-check-circle me-2"></i>{{ notificationSuccessMessage }}</p>
          <p class="text-danger mt-3" v-if="notificationErrorMessage"><i class="bi bi-exclamation-triangle me-2"></i>{{ notificationErrorMessage }}</p>
        </section>

        <section v-else-if="currentSection === 'billing'" class="animate__animated animate__fadeInRight animate__fast">
          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-credit-card-fill me-2"></i> Billing & Subscription
          </h4>

          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-primary text-white fw-semibold"><i class="bi bi-journal-check me-2"></i> Current Plan</div>
            <div class="card-body">
              <div v-if="loading.billing" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
                <p class="text-muted mt-2">Fetching subscription details...</p>
              </div>
              <div v-else-if="subscriptionDetails">
                <p class="card-text mb-2">You are currently on the <strong class="text-primary">{{ subscriptionDetails.planName }}</strong> plan.</p>
                <p class="card-text mb-2">Price: <strong class="text-success">{{ subscriptionDetails.price }}</strong> per month</p>
                <p class="card-text mb-2">Renews on: <strong>{{ subscriptionDetails.renewalDate }}</strong></p>
                <p class="card-text mb-3">Status: <span :class="{'badge bg-success': subscriptionDetails.status === 'Active', 'badge bg-warning': subscriptionDetails.status === 'Trial', 'badge bg-danger': subscriptionDetails.status === 'Cancelled'}">{{ subscriptionDetails.status }}</span></p>
                
                <ul class="list-unstyled mb-4">
                  <li v-for="(feature, index) in subscriptionDetails.features" :key="index" class="mb-1">
                    <i class="bi bi-check-circle-fill text-success me-2"></i> {{ feature }}
                  </li>
                </ul>

                <button @click="upgradePlan" class="btn btn-outline-primary me-2"><i class="bi bi-arrow-up-circle me-2"></i> Upgrade/Downgrade Plan</button>
                <button @click="toggleCancelConfirmationArea" class="btn btn-outline-danger" :disabled="subscriptionDetails.status === 'Cancelled'"><i class="bi bi-x-circle me-2"></i> Cancel Subscription</button>
              </div>
              <div v-else class="text-center text-muted py-4">
                <p><i class="bi bi-info-circle me-2"></i> No active subscription found.</p>
                <button @click="upgradePlan" class="btn btn-primary mt-2"><i class="bi bi-plus-circle me-2"></i> Subscribe Now</button>
              </div>
            </div>
          </div>

          <div v-if="showCancelConfirmationArea" class="cancellation-area animate__animated animate__fadeInDown p-4 mb-4 rounded-3 border border-danger bg-danger-subtle text-danger-emphasis">
              <h5 class="mb-3 text-danger fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i> Confirm Cancellation</h5>
              <p class="lead">Are you sure you want to cancel your <strong class="text-danger">{{ subscriptionDetails ? subscriptionDetails.planName : 'active' }}</strong> subscription?</p>
              <p class="text-muted">You will lose access to all premium features at the end of your current billing cycle ({{ subscriptionDetails ? subscriptionDetails.renewalDate : 'unknown date' }}).</p>
              <div class="mb-3">
                <label for="cancellationReason" class="form-label">Tell us why you're cancelling (optional):</label>
                <textarea v-model="cancellationReason" class="form-control" id="cancellationReason" rows="3" placeholder="e.g., Missing feature, too expensive, not using it enough..."></textarea>
              </div>
              <p class="text-danger small mt-2" v-if="cancelError"><i class="bi bi-exclamation-triangle me-2"></i> {{ cancelError }}</p>
              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-secondary" @click="toggleCancelConfirmationArea">Keep Subscription</button>
                <button type="button" class="btn btn-danger" @click="confirmCancelSubscription" :disabled="loading.billing">
                  <span v-if="!loading.billing">Yes, Cancel Subscription</span>
                  <span v-else class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span v-if="loading.billing" class="ms-2">Cancelling...</span>
                </button>
              </div>
          </div>

          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-info text-white fw-semibold"><i class="bi bi-credit-card me-2"></i> Payment Method</div>
            <div class="card-body">
              <div v-if="loading.billing" class="text-center py-3">
                <div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div>
              </div>
              <div v-else-if="paymentMethod.last4 && !showUpdatePaymentForm">
                <p class="mb-2">Card Type: <strong>{{ paymentMethod.cardType }}</strong></p>
                <p class="mb-2">Card Number: **** **** **** <strong>{{ paymentMethod.last4 }}</strong></p>
                <p class="mb-3">Expires: <strong>{{ paymentMethod.expiryDate }}</strong></p>
                <button @click="toggleUpdatePaymentForm" class="btn btn-outline-primary"><i class="bi bi-pencil-square me-2"></i> Update Payment Method</button>
              </div>
              <div v-else-if="!paymentMethod.last4 && !showUpdatePaymentForm" class="text-center text-muted py-3">
                <p><i class="bi bi-credit-card-fill me-2"></i> No payment method on file.</p>
                <button @click="toggleUpdatePaymentForm" class="btn btn-primary mt-2"><i class="bi bi-plus-circle me-2"></i> Add Payment Method</button>
              </div>

              <div v-if="showUpdatePaymentForm" class="update-payment-form animate__animated animate__fadeInUp p-4 mt-3 rounded-3 border border-primary bg-primary-subtle">
                  <h5 class="mb-3 text-primary fw-bold"><i class="bi bi-credit-card-fill me-2"></i> {{ paymentMethod.last4 ? 'Update' : 'Add' }} Payment Method</h5>
                  <p class="text-muted">Please enter your new card details.</p>
                  <form @submit.prevent="updatePaymentMethod">
                    <div class="mb-3">
                      <label for="cardName" class="form-label">Card Holder Name</label>
                      <input type="text" v-model="updatePaymentForm.cardName" class="form-control" id="cardName" required placeholder="John Doe">
                    </div>
                    <div class="mb-3">
                      <label for="cardNumber" class="form-label">Card Number</label>
                      <input type="text" v-model="updatePaymentForm.cardNumber" class="form-control" id="cardNumber" required placeholder="**** **** **** 1234">
                    </div>
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label for="expiryDate" class="form-label">Expiry Date (MM/YY)</label>
                        <input type="text" v-model="updatePaymentForm.expiryDate" class="form-control" id="expiryDate" required placeholder="12/25">
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="cvv" class="form-label">CVV</label>
                        <input type="text" v-model="updatePaymentForm.cvv" class="form-control" id="cvv" required placeholder="123">
                      </div>
                    </div>
                    <p class="text-danger small mt-2" v-if="updatePaymentError"><i class="bi bi-exclamation-triangle me-2"></i> {{ updatePaymentError }}</p>
                    <div class="d-flex justify-content-end gap-2 mt-4">
                      <button type="button" class="btn btn-secondary" @click="toggleUpdatePaymentForm">Cancel</button>
                      <button type="submit" class="btn btn-primary" :disabled="loading.billing">
                        <span v-if="!loading.billing">Save Changes</span>
                        <span v-else class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span v-if="loading.billing" class="ms-2">Saving...</span>
                      </button>
                    </div>
                  </form>
              </div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-header bg-secondary text-white fw-semibold"><i class="bi bi-receipt-cutoff me-2"></i> Billing History</div>
            <div class="card-body">
              <div v-if="loading.billing" class="text-center py-3">
                <div class="spinner-border text-secondary" role="status"><span class="visually-hidden">Loading...</span></div>
              </div>
              <div v-else-if="billingHistory.length > 0">
                <div class="table-responsive">
                  <table class="table table-striped table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="invoice in billingHistory" :key="invoice.id">
                        <td>{{ invoice.date }}</td>
                        <td>{{ invoice.amount }}</td>
                        <td><span :class="{'badge bg-success': invoice.status === 'Paid', 'badge bg-danger': invoice.status === 'Failed'}">{{ invoice.status }}</span></td>
                        <td>
                          <a :href="invoice.link" target="_blank" class="btn btn-sm btn-outline-info me-2">
                            <i class="bi bi-file-earmark-arrow-down-fill"></i> View
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else class="text-center text-muted py-3">
                <p><i class="bi bi-folder2-open me-2"></i> No billing history found.</p>
              </div>
            </div>
          </div>

          <p class="text-success mt-3" v-if="billingSuccessMessage"><i class="bi bi-check-circle me-2"></i>{{ billingSuccessMessage }}</p>
          <p class="text-danger mt-3" v-if="billingErrorMessage"><i class="bi bi-exclamation-triangle me-2"></i>{{ billingErrorMessage }}</p>

        </section>

        <section v-else-if="currentSection === 'privacy'" class="animate__animated animate__fadeInRight animate__fast">
          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-shield-lock-fill me-2"></i> Privacy & Security
          </h4>
          <p class="text-muted">Manage your data, third-party access, and security preferences here. (Coming Soon!)</p>
          <button class="btn btn-outline-secondary mt-3"><i class="bi bi-download me-2"></i> Export My Data</button>
        </section>

        <section v-else-if="currentSection === 'integrations'" class="animate__animated animate__fadeInRight animate__fast">
          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-boxes me-2"></i> Integrations
          </h4>
          <p class="text-muted">Connect your account with other services or manage API keys. (Coming Soon!)</p>
        </section>

        <section v-else-if="currentSection === 'help'" class="animate__animated animate__fadeInRight animate__fast">
          <h4 class="mb-4 text-dark-emphasis fw-bold border-bottom pb-2">
            <i class="bi bi-question-circle-fill me-2"></i> Help & Support
          </h4>
          <p class="text-muted">Find answers to common questions or contact our support team.</p>
          <div class="d-grid gap-2 mt-4">
            <a href="#" class="btn btn-outline-primary btn-lg"><i class="bi bi-book-fill me-2"></i> Go to Knowledge Base</a>
            <a href="#" class="btn btn-outline-info btn-lg"><i class="bi bi-headset me-2"></i> Contact Support</a>
            <a href="#" class="btn btn-outline-secondary btn-lg"><i class="bi bi-lightbulb-fill me-2"></i> Send Feedback</a>
          </div>
        </section>

        <div v-if="globalSuccessMessage" class="alert alert-success mt-4 animate__animated animate__fadeIn" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i> {{ globalSuccessMessage }}
        </div>
        <div v-if="globalErrorMessage" class="alert alert-danger mt-4 animate__animated animate__shakeX" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ globalErrorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// No import for 'Modal' needed anymore!

export default {
  name: 'SettingsPage',
  data() {
    return {
      currentSection: 'account', // Default active section
      sections: [
        { id: 'account', name: 'Account', icon: 'bi-person-circle' },
        { id: 'general', name: 'General', icon: 'bi-sliders' },
        { id: 'notifications', name: 'Notifications', icon: 'bi-bell-fill' },
        { id: 'billing', name: 'Billing & Subscription', icon: 'bi-credit-card-fill' }, // Moved up for visibility
        { id: 'privacy', name: 'Privacy & Security', icon: 'bi-shield-lock-fill', beta: true },
        { id: 'integrations', name: 'Integrations', icon: 'bi-boxes', beta: true },
        { id: 'help', name: 'Help & Support', icon: 'bi-question-circle-fill' },
      ],
      
      // Data for different settings sections
      userProfile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '', // URL or base64 string
      },
      passwordForm: {
        current: '',
        new: '',
        confirm: '',
      },
      generalSettings: {
        darkMode: false,
        language: 'en',
      },
      notificationSettings: {
        email: true,
        inApp: true,
        sms: false,
      },
      // --- Billing & Subscription Data ---
      subscriptionDetails: null, // Will be fetched
      paymentMethod: {}, // Will be fetched
      billingHistory: [], // Will be fetched
      
      updatePaymentForm: {
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      },
      cancellationReason: '', // For cancel subscription feedback

      // New flags to control inline form/confirmation visibility
      showUpdatePaymentForm: false,
      showCancelConfirmationArea: false,

      // Loading states for individual sections
      loading: {
        profile: false,
        password: false,
        billing: false, // New loading state for billing actions
      },

      // Error messages for specific forms
      profileErrors: { name: '' },
      passwordErrors: { current: '', new: '', confirm: '' },
      updatePaymentError: '', // New error for payment modal (now inline)
      cancelError: '', // New error for cancellation modal (now inline)

      // Success/Error messages for individual sections or global
      globalSuccessMessage: '',
      globalErrorMessage: '',
      generalSuccessMessage: '',
      generalErrorMessage: '',
      notificationSuccessMessage: '',
      notificationErrorMessage: '',
      billingSuccessMessage: '', // New success for billing section
      billingErrorMessage: '', // New error for billing section
    };
  },
  mounted() {
    // Initialize dark mode based on current body class
    this.generalSettings.darkMode = document.body.classList.contains('theme-dark');
    // No need to initialize Bootstrap Modals here anymore
    
    // Fetch initial billing data if settings page is directly loaded on billing section
    if (this.currentSection === 'billing') {
      this.fetchSubscriptionDetails();
    }
  },
  methods: {
    /**
     * Changes the active settings section.
     * @param {string} sectionId The ID of the section to display.
     */
    selectSection(sectionId) {
      this.currentSection = sectionId;
      // Clear global messages when changing sections
      this.globalSuccessMessage = '';
      this.globalErrorMessage = '';
      this.billingSuccessMessage = '';
      this.billingErrorMessage = '';

      // Hide any open inline forms/confirmations when changing sections
      this.showUpdatePaymentForm = false;
      this.showCancelConfirmationArea = false;

      // Fetch data for billing section when selected
      if (sectionId === 'billing') {
        this.fetchSubscriptionDetails();
      }
    },

    /**
     * Handles avatar file input change.
     * In a real app, this would involve uploading to a server.
     */
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) { // Max 2MB
          this.globalErrorMessage = 'Avatar image too large. Max 2MB allowed.';
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          this.userProfile.avatar = e.target.result; // For preview
          // In a real app, you'd send file to server here
          this.globalSuccessMessage = 'Avatar selected. Remember to Save Profile!';
        };
        reader.readAsDataURL(file);
      }
    },

    /**
     * Saves user profile information.
     * Simulates an API call.
     */
    async saveProfile() {
      this.loading.profile = true;
      this.globalSuccessMessage = '';
      this.globalErrorMessage = '';
      this.profileErrors = { name: '' };

      if (!this.userProfile.name.trim()) {
        this.profileErrors.name = 'Full Name cannot be empty.';
        this.loading.profile = false;
        return;
      }

      try {
        console.log('Saving profile:', this.userProfile);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Example: const response = await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(this.userProfile) });
        this.globalSuccessMessage = 'Profile updated successfully!';
      } catch (error) {
        console.error('Profile update failed:', error);
        this.globalErrorMessage = 'Failed to update profile. Please try again.';
      } finally {
        this.loading.profile = false;
      }
    },

    /**
     * Changes user's password.
     * Simulates an API call.
     */
    async changePassword() {
      this.loading.password = true;
      this.globalSuccessMessage = '';
      this.globalErrorMessage = '';
      this.passwordErrors = { current: '', new: '', confirm: '' };

      // Basic validation
      if (!this.passwordForm.current) { this.passwordErrors.current = 'Current password is required.'; }
      if (!this.passwordForm.new) { this.passwordErrors.new = 'New password is required.'; }
      if (this.passwordForm.new && this.passwordForm.new.length < 8) { this.passwordErrors.new = 'New password must be at least 8 characters.'; }
      if (!this.passwordForm.confirm) { this.passwordErrors.confirm = 'Confirm new password is required.'; }
      if (this.passwordForm.new && this.passwordForm.new !== this.passwordForm.confirm) { this.passwordErrors.confirm = 'New password and confirmation do not match.'; }

      if (Object.values(this.passwordErrors).some(e => e !== '')) {
        this.loading.password = false;
        return;
      }

      try {
        console.log('Changing password...');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Example: const response = await fetch('/api/user/password', { method: 'PUT', body: JSON.stringify(this.passwordForm) });
        // Assume success based on your backend logic
        this.globalSuccessMessage = 'Password changed successfully!';
        this.passwordForm = { current: '', new: '', confirm: '' }; // Clear form
      } catch (error) {
        console.error('Password change failed:', error);
        this.globalErrorMessage = 'Failed to change password. Please check your current password.';
      } finally {
        this.loading.password = false;
      }
    },

    /**
     * Toggles the application theme (light/dark).
     */
    toggleTheme() {
      if (this.generalSettings.darkMode) {
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
      }
      // In a real app, you'd also save this preference to localStorage or user settings on backend
      this.saveGeneralSettings('Theme updated!');
    },

    /**
     * Saves general settings (e.g., language, theme preference).
     * Simulates an API call.
     * @param {string} [message] Optional success message to display.
     */
    async saveGeneralSettings(message = 'General settings saved!') {
      this.generalSuccessMessage = '';
      this.generalErrorMessage = '';
      try {
        console.log('Saving general settings:', this.generalSettings);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        this.generalSuccessMessage = message;
      } catch (error) {
        console.error('Failed to save general settings:', error);
        this.generalErrorMessage = 'Failed to save general settings.';
      }
    },

    /**
     * Saves notification settings.
     * Simulates an API call.
     */
    async saveNotificationSettings() {
      this.notificationSuccessMessage = '';
      this.notificationErrorMessage = '';
      try {
        console.log('Saving notification settings:', this.notificationSettings);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        this.notificationSuccessMessage = 'Notification preferences updated!';
      } catch (error) {
        console.error('Failed to save notification settings:', error);
        this.notificationErrorMessage = 'Failed to save notification preferences.';
      }
    },

    // --- Billing & Subscription Methods ---
    /**
     * Fetches subscription details, payment method, and billing history.
     * Simulates an API call.
     */
    async fetchSubscriptionDetails() {
      this.loading.billing = true;
      this.billingSuccessMessage = '';
      this.billingErrorMessage = '';
      try {
        console.log('Fetching billing details...');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

        // Simulate successful data fetch
        this.subscriptionDetails = {
          planName: 'Pro Monthly',
          price: '$19.99',
          renewalDate: 'July 25, 2025',
          status: 'Active',
          features: ['All Basic Features', 'Unlimited Projects', 'Priority Support', '100GB Storage']
        };
        this.paymentMethod = {
          cardType: 'Visa',
          last4: '1234',
          expiryDate: '12/26'
        };
        this.billingHistory = [
          { id: 'inv-003', date: 'June 25, 2025', amount: '$19.99', status: 'Paid', link: '#invoice3' },
          { id: 'inv-002', date: 'May 25, 2025', amount: '$19.99', status: 'Paid', link: '#invoice2' },
          { id: 'inv-001', date: 'April 25, 2025', amount: '$19.99', status: 'Paid', link: '#invoice1' },
          // { id: 'inv-004', date: 'July 01, 2025', amount: '$29.99', status: 'Failed', link: '#invoice4' }, // Example of failed
        ];
        this.billingSuccessMessage = 'Subscription details loaded.';
      } catch (error) {
        console.error('Failed to fetch billing details:', error);
        this.billingErrorMessage = 'Failed to load billing details. Please try again later.';
        this.subscriptionDetails = null; // Clear if fetch fails
        this.paymentMethod = {};
        this.billingHistory = [];
      } finally {
        this.loading.billing = false;
      }
    },

    /**
     * Handles Upgrade/Downgrade Plan action.
     * In a real app, this would likely redirect to a pricing page or a checkout flow.
     */
    upgradePlan() {
      this.billingSuccessMessage = '';
      this.billingErrorMessage = '';
      alert('Redirecting to plans page... (Simulated)');
      // In a real application, you might redirect:
      // this.$router.push('/pricing');
      this.billingSuccessMessage = 'You will be redirected to choose a new plan.';
    },

    /**
     * Toggles the visibility of the Update Payment Method form.
     */
    toggleUpdatePaymentForm() {
      this.showUpdatePaymentForm = !this.showUpdatePaymentForm;
      this.updatePaymentError = ''; // Clear error when toggling
      if (this.showUpdatePaymentForm) {
        // Optionally pre-fill form if existing payment method details are desired
        // this.updatePaymentForm.cardName = '...'; // Not available for security
        // this.updatePaymentForm.cardNumber = '**** **** ****' + this.paymentMethod.last4;
        // this.updatePaymentForm.expiryDate = this.paymentMethod.expiryDate;
      } else {
        // Reset form when hiding
        this.updatePaymentForm = { cardName: '', cardNumber: '', expiryDate: '', cvv: '' };
      }
    },

    /**
     * Simulates updating the payment method.
     */
    async updatePaymentMethod() {
      this.loading.billing = true;
      this.updatePaymentError = '';
      this.billingSuccessMessage = '';
      this.billingErrorMessage = '';

      // Basic validation (e.g., check if fields are empty)
      if (!this.updatePaymentForm.cardName || !this.updatePaymentForm.cardNumber || !this.updatePaymentForm.expiryDate || !this.updatePaymentForm.cvv) {
        this.updatePaymentError = 'All fields are required.';
        this.loading.billing = false;
        return;
      }

      console.log('Updating payment method:', this.updatePaymentForm);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        // In a real app, integrate with Stripe, PayPal, etc.
        // On success:
        this.paymentMethod = {
          cardType: 'Visa', // Or detect based on card number
          last4: this.updatePaymentForm.cardNumber.slice(-4),
          expiryDate: this.updatePaymentForm.expiryDate
        };
        this.billingSuccessMessage = 'Payment method updated successfully!';
        this.toggleUpdatePaymentForm(); // Hide form on success
      } catch (error) {
        console.error('Payment update failed:', error);
        this.updatePaymentError = 'Failed to update payment. Please check your details.';
        this.billingErrorMessage = 'Failed to update payment method.';
      } finally {
        this.loading.billing = false;
      }
    },

    /**
     * Toggles the visibility of the Cancel Subscription confirmation area.
     */
    toggleCancelConfirmationArea() {
      this.showCancelConfirmationArea = !this.showCancelConfirmationArea;
      this.cancellationReason = ''; // Clear reason when toggling
      this.cancelError = ''; // Clear error when toggling
    },

    /**
     * Confirms and simulates cancelling the subscription.
     */
    async confirmCancelSubscription() {
      this.loading.billing = true;
      this.cancelError = '';
      this.billingSuccessMessage = '';
      this.billingErrorMessage = '';
      
      console.log('Cancelling subscription with reason:', this.cancellationReason);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        // In a real app, send cancellation request to your billing provider.
        // On success:
        this.subscriptionDetails.status = 'Cancelled'; // Update local state
        this.billingSuccessMessage = 'Subscription cancelled successfully! You will retain access until ' + this.subscriptionDetails.renewalDate + '.';
        this.toggleCancelConfirmationArea(); // Hide confirmation area on success
      } catch (error) {
        console.error('Cancellation failed:', error);
        this.cancelError = 'Failed to cancel subscription. Please try again.';
        this.billingErrorMessage = 'Failed to cancel subscription.';
      } finally {
        this.loading.billing = false;
      }
    },
  },
};
</script>

<style scoped>
/*
 * General Layout & Container
 */
.settings-container {
  background: linear-gradient(135deg, var(--bs-primary-bg-subtle) 0%, var(--bs-light) 100%);
  /* Consistent gradient background */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  min-height: 100vh; /* Ensure it takes full viewport height */
}

.settings-card {
  background-color: var(--bs-white);
  border-radius: 1.75rem; /* Ultra-modern rounded corners */
  max-width: 1200px; /* Wider card for better content display */
  width: 100%;
  min-height: 70vh; /* Minimum height for a substantial feel */
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.18) !important; /* Stronger, deeper shadow */
  border: none;
  overflow: hidden; /* Ensures rounded corners are respected by children */
}

/*
 * Sidebar Navigation
 */
.settings-sidebar {
  flex: 0 0 280px; /* Fixed width for sidebar */
  background-color: var(--bs-light); /* Light background for sidebar */
  border-right: 1px solid var(--bs-border-color-translucent);
  display: flex;
  flex-direction: column;
  padding: 2.5rem !important; /* Generous padding */
}

.settings-sidebar h3 {
  color: var(--bs-primary); /* Primary brand color for sidebar title */
  font-size: 1.8rem;
  margin-bottom: 2.5rem !important;
}

.settings-sidebar .nav-link {
  color: var(--bs-secondary-emphasis);
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem; /* Rounded nav items */
  transition: all 0.3s ease;
  font-size: 1.05rem;
  cursor: pointer; /* Indicate clickable */
}

.settings-sidebar .nav-link:hover {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
  transform: translateX(5px); /* Subtle hover effect */
}

.settings-sidebar .nav-link.active {
  background-color: var(--bs-primary);
  color: var(--bs-white) !important;
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.2);
  transform: translateX(0); /* Ensure active is not translated */
}

.settings-sidebar .nav-link.active i {
  color: var(--bs-white); /* White icons for active state */
}

.settings-sidebar .nav-link i {
  color: var(--bs-primary); /* Primary color for icons */
  font-size: 1.3rem;
  transition: color 0.3s ease;
}

/*
 * Settings Content Area
 */
.settings-content {
  background-color: var(--bs-white);
  flex-grow: 1;
  padding: 3rem !important;
  overflow-y: auto; /* Enable scrolling for long content */
  position: relative; /* For child animations */
}

.settings-content section {
  min-height: 50vh; /* Ensure content sections have minimum height */
}

.settings-content h4 {
  font-size: 1.7rem;
  color: var(--bs-dark-emphasis);
  padding-bottom: 0.5rem;
  margin-bottom: 2.5rem !important;
}

/* Form Elements Consistency */
.form-control-lg, .form-select {
  padding: 0.85rem 1.25rem;
  font-size: 1.05rem;
  border-radius: 0.75rem;
  border-color: var(--bs-border-color-translucent);
}

.form-control-lg:focus, .form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.btn-lg {
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 0.75rem;
  padding: 0.85rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-rgb), 0.3);
}

.btn-warning {
  background-color: var(--bs-warning);
  border-color: var(--bs-warning);
  color: var(--bs-white);
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-warning-rgb), 0.3);
}

/* Specific Section Styles */
.avatar-lg {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid var(--bs-white);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.form-check-input {
  width: 2.5em; /* Larger switch */
  height: 1.5em;
  cursor: pointer;
}

/* Billing Section Specifics */
.card-header {
  border-top-left-radius: 1rem !important;
  border-top-right-radius: 1rem !important;
  font-size: 1.15rem;
  padding: 1rem 1.25rem;
}

.card.shadow-sm {
  border-radius: 1rem !important; /* Rounded card bodies */
}

/* Alerts */
.alert {
  border-radius: 0.75rem;
  font-size: 0.95rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
}

.alert-success {
  background-color: var(--bs-success-bg-subtle);
  border-left: 5px solid var(--bs-success);
  color: var(--bs-success-text-emphasis);
  border-color: var(--bs-success-border-subtle);
}

.alert-danger {
  background-color: var(--bs-danger-bg-subtle);
  border-left: 5px solid var(--bs-danger);
  color: var(--bs-danger-text-emphasis);
  border-color: var(--bs-danger-border-subtle);
}

/* Inline forms/confirmations */
.update-payment-form, .cancellation-area {
  margin-top: 1.5rem;
  margin-bottom: 2.5rem; /* Add space below these sections */
  padding: 2rem !important;
}

.update-payment-form {
  background-color: var(--bs-primary-bg-subtle);
  border-color: var(--bs-primary-border-subtle) !important;
  color: var(--bs-primary-text-emphasis);
}

.cancellation-area {
  background-color: var(--bs-danger-bg-subtle);
  border-color: var(--bs-danger-border-subtle) !important;
  color: var(--bs-danger-text-emphasis);
}


/*
 * Responsive Adjustments
 */
@media (max-width: 767.98px) {
  .settings-card {
    flex-direction: column;
    min-height: unset;
    padding: 0; /* Remove overall padding, sections will have it */
  }

  .settings-sidebar {
    flex: none;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--bs-border-color-translucent);
    border-radius: 1.5rem 1.5rem 0 0; /* Top rounded corners */
    padding: 1.5rem !important;
  }

  .settings-sidebar .nav {
    flex-direction: row; /* Horizontal nav for small screens */
    flex-wrap: wrap;
    justify-content: center;
  }

  .settings-sidebar .nav-link {
    width: auto;
    margin: 0.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    text-align: center;
    flex-direction: column; /* Stack icon and text */
  }

  .settings-sidebar .nav-link i {
    margin-right: 0 !important;
    margin-bottom: 0.25rem;
  }

  .settings-sidebar h3 {
    text-align: center;
    margin-bottom: 1.5rem !important;
    font-size: 1.5rem;
  }

  .settings-content {
    padding: 2rem !important;
    border-radius: 0 0 1.5rem 1.5rem; /* Bottom rounded corners */
  }

  .settings-content section {
    min-height: unset; /* Remove min-height for mobile */
  }

  .settings-content h4 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem !important;
  }
}

@media (max-width: 575.98px) {
  .settings-card {
    border-radius: 1rem;
  }
  .settings-sidebar {
    padding: 1rem !important;
    border-radius: 1rem 1rem 0 0;
  }
  .settings-content {
    padding: 1.5rem !important;
    border-radius: 0 0 1rem 1rem;
  }
  .form-control-lg, .btn-lg {
    font-size: 0.9rem;
    padding: 0.7rem 1rem;
  }
  .avatar-lg {
    width: 90px;
    height: 90px;
  }
  .settings-sidebar .nav-link {
    font-size: 0.85rem;
  }
  .settings-sidebar .nav-link i {
    font-size: 1.1rem;
  }
  .settings-sidebar .nav-link.active .badge {
    display: none; /* Hide beta badge on very small screens for compact nav */
  }
  .table-responsive .table {
    font-size: 0.85rem;
  }
  .table-responsive .btn-sm {
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
  }
}

/*
 * Dark Mode Compatibility (Requires body.theme-dark class)
 */
body.theme-dark .settings-container {
  background: linear-gradient(135deg, #1f2a3a 0%, #2a2a2a 100%);
}

body.theme-dark .settings-card {
  background-color: #2a2a2a;
  box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.4) !important;
}

body.theme-dark .settings-sidebar {
  background-color: #1e1e1e;
  border-color: #333;
}

body.theme-dark .settings-sidebar h3 {
  color: var(--bs-primary-light);
}

body.theme-dark .settings-sidebar .nav-link {
  color: #b0b0b0;
}

body.theme-dark .settings-sidebar .nav-link:hover {
  background-color: #2c2c2c;
  color: var(--bs-primary-light);
}

body.theme-dark .settings-sidebar .nav-link.active {
  background-color: var(--bs-primary-dark);
  color: #e0e0e0 !important;
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-dark-rgb), 0.2);
}

body.theme-dark .settings-sidebar .nav-link i {
  color: var(--bs-primary-light);
}

body.theme-dark .settings-content {
  background-color: #2a2a2a;
  color: #e0e0e0;
}

body.theme-dark .settings-content h4 {
  color: #f8f9fa;
  border-color: #444 !important;
}

body.theme-dark .form-control-lg,
body.theme-dark .form-select {
  background-color: #3a3a3a;
  border-color: #555;
  color: #e0e0e0;
}

body.theme-dark .form-control-lg::placeholder {
  color: #999;
}

body.theme-dark .form-control-lg:focus,
body.theme-dark .form-select:focus {
  border-color: var(--bs-primary-dark);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-dark-rgb), 0.25);
}

body.theme-dark .form-label,
body.theme-dark small.text-muted {
  color: #b0b0b0 !important;
}

body.theme-dark .text-dark-emphasis {
  color: #f8f9fa !important;
}

body.theme-dark .btn-primary {
  background-color: var(--bs-primary-dark);
  border-color: var(--bs-primary-dark);
}

body.theme-dark .btn-primary:hover:not(:disabled) {
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-primary-dark-rgb), 0.3);
}

body.theme-dark .btn-warning {
  background-color: var(--bs-warning-dark);
  border-color: var(--bs-warning-dark);
}

body.theme-dark .btn-warning:hover:not(:disabled) {
  box-shadow: 0 0.5rem 1rem rgba(var(--bs-warning-dark-rgb), 0.3);
}

body.theme-dark .btn-outline-primary {
  color: var(--bs-primary-light) !important;
  border-color: var(--bs-primary-light) !important;
}

body.theme-dark .btn-outline-primary:hover {
  background-color: var(--bs-primary-light) !important;
  color: #2a2a2a !important;
}

body.theme-dark .btn-outline-info {
  color: var(--bs-info-light) !important;
  border-color: var(--bs-info-light) !important;
}

body.theme-dark .btn-outline-info:hover {
  background-color: var(--bs-info-light) !important;
  color: #2a2a2a !important;
}

body.theme-dark .btn-outline-secondary {
  color: #b0b0b0 !important;
  border-color: #555 !important;
}

body.theme-dark .btn-outline-secondary:hover {
  background-color: #555 !important;
  color: #e0e0e0 !important;
}

body.theme-dark .btn-outline-danger {
  color: var(--bs-danger-light) !important;
  border-color: var(--bs-danger-light) !important;
}

body.theme-dark .btn-outline-danger:hover {
  background-color: var(--bs-danger-light) !important;
  color: #2a2a2a !important;
}

body.theme-dark .alert-success {
  background-color: #2d423a;
  border-color: #4f7d6a;
  color: #a0e0c0;
}

body.theme-dark .alert-danger {
  background-color: #3a2e2e;
  border-color: #6a3e3e;
  color: #ff9999;
}

body.theme-dark .border {
  border-color: #444 !important;
}

body.theme-dark .badge.bg-info-subtle {
  background-color: rgba(var(--bs-info-rgb), 0.2) !important;
  color: var(--bs-info-light) !important;
}
body.theme-dark .badge.bg-warning-subtle {
  background-color: rgba(var(--bs-warning-rgb), 0.2) !important;
  color: var(--bs-warning-light) !important;
}

body.theme-dark .avatar-lg {
  border-color: #3a3a3a;
}

/* Inline forms/confirmations Dark Mode */
body.theme-dark .update-payment-form {
  background-color: rgba(var(--bs-primary-dark-rgb), 0.15);
  border-color: var(--bs-primary-dark) !important;
  color: #e0e0e0;
}
body.theme-dark .cancellation-area {
  background-color: rgba(var(--bs-danger-dark-rgb), 0.15);
  border-color: var(--bs-danger-dark) !important;
  color: #ff9999;
}

</style>