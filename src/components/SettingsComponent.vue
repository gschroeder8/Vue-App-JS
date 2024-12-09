<template>
  <div>
    <h2>Settings</h2>
    <div class="accordion" id="settingsAccordion">
      <!-- Account Settings -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingAccount">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accountSettings" aria-expanded="true" aria-controls="accountSettings">
            Account
          </button>
        </h2>
        <div id="accountSettings" class="accordion-collapse collapse show" aria-labelledby="headingAccount" data-bs-parent="#settingsAccordion">
          <div class="accordion-body">
            <p>Create an account to save your lists.</p>
            <button class="btn btn-primary">Create an Account</button>
          </div>
        </div>
      </div>

      <!-- Appearance Settings -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingAppearance">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#appearanceSettings" aria-expanded="false" aria-controls="appearanceSettings">
            Appearance
          </button>
        </h2>
        <div id="appearanceSettings" class="accordion-collapse collapse" aria-labelledby="headingAppearance" data-bs-parent="#settingsAccordion">
          <div class="accordion-body">
            <p>Customize the appearance of the app.</p>
            <!-- Dark Mode Toggle -->
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="darkModeSwitch" :checked="isDarkMode" @change="toggleDarkMode">
              <label class="form-check-label" for="darkModeSwitch">Enable Dark Mode</label>
            </div>
          </div>
        </div>
      </div>

      <!-- About Settings -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingAbout">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#aboutSettings" aria-expanded="false" aria-controls="aboutSettings">
            About
          </button>
        </h2>
        <div id="aboutSettings" class="accordion-collapse collapse" aria-labelledby="headingAbout" data-bs-parent="#settingsAccordion">
          <div class="accordion-body">
            <p>About settings.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsComponent',
  props: {
    isDarkMode: Boolean
  },
  methods: {
    toggleDarkMode() {
      this.$emit('toggle-dark-mode', !this.isDarkMode);
    }
  }
};
</script>

<style scoped>
</style>
