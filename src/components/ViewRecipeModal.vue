<template>
  <div class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Recipe: {{ currentRecipe.name }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <h6>Ingredients:</h6>
          <div v-for="(ingredient, index) in currentRecipe.ingredients" :key="index"
            class="d-flex align-items-center mb-2">
            <input type="text" v-model="ingredient.name" class="form-control me-2" placeholder="Ingredient Name">
            <select v-model="ingredient.category" class="form-select me-2">
              <option value="" disabled>Select Category</option>
              <option value="Meat">Meat</option>
              <option value="Dairy">Dairy</option>
              <option value="Produce">Produce</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
              <option value="Seafood">Seafood</option>
            </select>
            <button class="btn btn-sm btn-danger" @click="deleteIngredient(index)">Delete</button>
          </div>
          <button type="button" class="btn btn-secondary mb-3" @click="addIngredient">Add Ingredient</button>

          <h6>Instructions:</h6>
          <textarea v-model="currentRecipe.instructions" class="form-control" rows="4"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FoodItem from "@/models/FoodItem.js";

export default {
  name: "ViewRecipeModal",
  props: {
    currentRecipe: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addIngredient() {
      this.currentRecipe.ingredients.push(new FoodItem("", ""));
    },
    deleteIngredient(index) {
      this.currentRecipe.ingredients.splice(index, 1);
    },
    closeModal() {
      this.$emit("close-modal");
    },
  },
};

</script>

<style scoped></style>
