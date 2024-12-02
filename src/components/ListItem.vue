<template>
  <li class="list-group-item d-flex justify-content-between">
    <span>{{ item.name }} ({{ item.category }})</span>
    <button class="btn btn-link" @click="deleteItem">Delete</button>
  </li>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    item: Object,
    index: Number
  },
  methods: {
    deleteItem() {
      this.$emit('delete-item', this.index);
    }
  }
};
</script>

<style scoped>
</style>
