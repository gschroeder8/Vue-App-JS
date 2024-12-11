<template>
  <div>
    <h2 class="text-center my-4">Settings</h2>
    <div class="accordion" id="settingsAccordion">
      <!-- Account Settings -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingAccount">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#accountSettings"
            aria-expanded="true"
            aria-controls="accountSettings"
          >
            Account
          </button>
        </h2>
        <div
          id="accountSettings"
          class="accordion-collapse collapse show"
          aria-labelledby="headingAccount"
          data-bs-parent="#settingsAccordion"
        >
          <div class="accordion-body d-block">
            <p><strong>Logged in as:</strong> {{ authUser?.email || "Guest" }}</p>
            <p v-if="authUser" class="text-muted">You are logged in.</p>
            <p v-else class="text-muted">No user is currently logged in.</p>
            <form @submit.prevent="logout">
              <button
                v-if="authUser"
                type="submit"
                class="btn btn-danger d-block"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Contact Us Section -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingContact">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#contactSettings"
            aria-expanded="false"
            aria-controls="contactSettings"
          >
            Contact Us
          </button>
        </h2>
        <div
          id="contactSettings"
          class="accordion-collapse collapse"
          aria-labelledby="headingContact"
          data-bs-parent="#settingsAccordion"
        >
          <div class="accordion-body">
            <p>If you have any questions or need support, reach out to us:</p>
            <ul>
              <li>
                Email:
                <a href="mailto:gschroeder8@my.wctc.edu"
                  >gschroeder8@my.wctc.edu</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingAbout">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#aboutSettings"
            aria-expanded="false"
            aria-controls="aboutSettings"
          >
            About
          </button>
        </h2>
        <div
          id="aboutSettings"
          class="accordion-collapse collapse"
          aria-labelledby="headingAbout"
          data-bs-parent="#settingsAccordion"
        >
          <div class="accordion-body">
            <p>
              <strong>Pantry Pal</strong> helps you manage your recipes and grocery
              lists with ease. This application is currently in testing phases.
              If there are any bugs or suggestions, please send a message to the
              email listed in the "Contact Us" tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsComponent",
  props: {
  login: { type: Function, required: true },
  logout: { type: Function, required: true },
  authUser: { type: Object, default: null },
},
created() {
  console.log("Logout function:", this.logout);
}
};
</script>

<style scoped>
.accordion-button {
  font-weight: bold;
}
.accordion-body ul {
  padding-left: 1.5rem;
}
.accordion-body a {
  text-decoration: none;
  color: var(--bs-primary);
}
.accordion-body a:hover {
  text-decoration: underline;
}
</style>
