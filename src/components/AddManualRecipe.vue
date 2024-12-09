<template>
    <div class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Recipe Manually</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitRecipe">
              <!-- Recipe Name -->
              <div class="mb-3">
                <label for="recipeName" class="form-label">Recipe Name</label>
                <input
                  type="text"
                  v-model="newRecipeName"
                  class="form-control"
                  id="recipeName"
                  placeholder="Enter Recipe Name"
                  required
                />
              </div>
  
              <!-- Recipe Instructions -->
              <div class="mb-3">
                <label for="recipeInstructions" class="form-label">Instructions</label>
                <textarea
                  v-model="newRecipeInstructions"
                  class="form-control"
                  id="recipeInstructions"
                  rows="3"
                  placeholder="Enter Recipe Instructions"
                  required
                ></textarea>
              </div>
  
              <!-- Ingredients -->
              <div class="mb-3">
                <label class="form-label">Ingredients</label>
                <div v-for="(ingredient, index) in newRecipeIngredients" :key="index" class="input-group mb-2">
                  <input
                    type="text"
                    v-model="ingredient.name"
                    class="form-control me-2"
                    placeholder="Ingredient Name"
                    required
                  />
                  <select v-model="ingredient.category" class="form-select me-2">
                    <option value="" disabled>Select Category</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Produce">Produce</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="deleteIngredient(index)"
                  >
                    Delete
                  </button>
                </div>
                <div class="d-flex mb-3">
                  <input
                    type="text"
                    v-model="newIngredientName"
                    class="form-control me-2"
                    placeholder="New Ingredient Name"
                  />
                  <select v-model="newIngredientCategory" class="form-select me-2">
                    <option value="" disabled>Select Category</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Produce">Produce</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="addIngredient"
                  >
                    Add Ingredient
                  </button>
                </div>
              </div>
  
              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary">Create Recipe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Recipe from "@/models/Recipe.js";
  import FoodItem from "@/models/FoodItem.js";
  
  export default {
    name: "AddManualRecipe",
    data() {
      return {
        newRecipeName: "",
        newRecipeInstructions: "",
        newIngredientName: "",
        newIngredientCategory: "",
        newRecipeIngredients: [],
      };
    },
    methods: {
      addIngredient() {
        if (this.newIngredientName.trim()) {
          this.newRecipeIngredients.push(
            new FoodItem(this.newIngredientName, this.newIngredientCategory || "Miscellaneous")
          );
          this.newIngredientName = "";
          this.newIngredientCategory = "";
        }
      },
      deleteIngredient(index) {
        this.newRecipeIngredients.splice(index, 1);
      },
      submitRecipe() {
        if (this.newRecipeName.trim() && this.newRecipeInstructions.trim()) {
          const newRecipe = new Recipe(
            this.newRecipeName,
            this.newRecipeIngredients,
            this.newRecipeInstructions
          );
          this.$emit("add-recipe", newRecipe);
          this.resetForm();
          this.closeModal();
        }
      },
      resetForm() {
        this.newRecipeName = "";
        this.newRecipeInstructions = "";
        this.newIngredientName = "";
        this.newIngredientCategory = "";
        this.newRecipeIngredients = [];
      },
      closeModal() {
        this.$emit("close-modal");
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  