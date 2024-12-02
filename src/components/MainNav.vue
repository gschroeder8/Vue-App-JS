<template>
  <div class="d-flex align-items-center justify-content-between mb-5 p-1" id="mainNav">
    <img src="/lists3.png" alt="List Icon" id="listImg" class="me-3">
    <ul class="nav nav-pills me-auto navbar-text">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <a class="nav-link" :class="{ active: activeTab === tab.id }" @click.prevent="selectTab(tab.id)" href="#">{{ tab.label }}</a>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'MainNav',
  props: {
    tabs: Array,
    activeTab: String
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
  width: 10%;
  height: auto;
}
</style>
