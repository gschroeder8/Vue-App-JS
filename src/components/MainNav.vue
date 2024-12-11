<template>
  <div class="d-flex align-items-center mb-5 p-1" id="mainNav">
    <!-- Logo and Navigation Tabs -->
    <div class="d-flex align-items-center">
      <h3 class="text-center text-secondary mx-4 p-1">Pantry Pal</h3>
      
    </div>    
<!-- Navigation Tabs -->
<div class="d-flex align-items-center">
      <ul class="nav me-auto nav-underline">
        <li class="nav-item" v-for="tab in tabs" :key="tab.id">
          <a
            class="nav-link text-dark"
            :class="{ active: activeTab === tab.id }"
            @click.prevent="selectTab(tab.id)"
          >
            {{ tab.label }}
          </a>
        </li>
      </ul>      

    </div>       
    <img src="/lists3.png" alt="List Icon" id="listImg" class="ms-auto">

  </div>
  
</template>

<script>
export default {
  name: 'MainNav',
  props: {
    tabs: { type: Array, required: true },
    activeTab: { type: String, required: true },
    authUser: { type: Object, default: null }, // To check if user is logged in
    logout: { type: Function, default: null } // Logout function
  },
  data() {
    return {
      listImgUrl: new URL('@/assets/images/lists3.png', import.meta.url).href
    };
  },
  methods: {
    selectTab(tabId) {
      this.$emit('tab-change', tabId);
    }
  }
};
</script>

<style scoped>
#mainNav {
  background-color: var(--bs-primary);
}

#listImg {
  width: 7%;
  height: auto;
}
</style>
