<template>
  <div class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Recipe: {{ editableRecipe.name }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <!-- Ingredients -->
          <div class="mb-3">
            <h6>Ingredients:</h6>
            <ul>
              <li v-for="(ingredient, index) in editableRecipe.ingredients" :key="index">
                {{ ingredient.name }} - {{ ingredient.amount }} {{ ingredient.unit }}
              </li>
            </ul>
          </div>

          <!-- Instructions -->
          <div class="mb-3">
            <h6>Instructions:</h6>
            <p>{{ editableRecipe.instructions }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SeeApiRecipe",
  props: {
    currentRecipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editableRecipe: { ...this.currentRecipe },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>
