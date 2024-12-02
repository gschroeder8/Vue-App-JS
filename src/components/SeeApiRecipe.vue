<template>
    <div class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Recipe: {{ currentRecipe.name }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveChanges">
              <!-- Recipe Name -->
              <div class="mb-3">
                <label for="recipeName" class="form-label">Recipe Name</label>
                <input type="text" v-model="editableRecipe.name" class="form-control" id="recipeName" required>
              </div>
  
              <!-- Ingredients List -->
              <div class="mb-3">
                <label class="form-label">Ingredients</label>
                <div v-for="(ingredient, index) in editableRecipe.ingredients" :key="index" class="input-group mb-2">
                  <input type="text" v-model="ingredient.name" class="form-control me-2" placeholder="Ingredient Name" required>
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
                  <button type="button" class="btn btn-danger" @click="deleteIngredient(index)">Delete</button>
                </div>
                <div class="d-flex mb-3">
                  <input type="text" v-model="newIngredientName" class="form-control me-2" placeholder="New Ingredient Name">
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
                  <button type="button" class="btn btn-secondary" @click="addIngredient">Add Ingredient</button>
                </div>
              </div>
  
              <!-- Instructions -->
              <div class="mb-3">
                <label for="recipeInstructions" class="form-label">Instructions</label>
                <textarea v-model="editableRecipe.instructions" class="form-control" id="recipeInstructions" rows="4" required></textarea>
              </div>
  
              <!-- Save Changes -->
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
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
        newIngredientName: '',
        newIngredientCategory: '',
      };
    },
    methods: {
      addIngredient() {
        if (this.newIngredientName.trim()) {
          this.editableRecipe.ingredients.push({
            name: this.newIngredientName,
            category: this.newIngredientCategory || 'Miscellaneous',
          });
          this.newIngredientName = '';
          this.newIngredientCategory = '';
        }
      },
      deleteIngredient(index) {
        this.editableRecipe.ingredients.splice(index, 1);
      },
      saveChanges() {
        this.$emit('update-recipe', { ...this.editableRecipe });
        this.closeModal();
      },
      closeModal() {
        this.$emit('close-modal');
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  