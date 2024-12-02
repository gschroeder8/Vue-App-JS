<template>
  <div>
    <h2>Your Recipes</h2>
    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-primary" @click="showRecipeOptionModal = true">+ Add New Recipe</button>
      <input type="text" v-model="searchRecipesQuery" class="form-control w-50" placeholder="Search Recipes">
    </div>
    <div class="list-group">
      <div class="list-group-item" v-for="(recipe, index) in filteredRecipes" :key="recipe.id || recipe.name">
        <div class="d-flex justify-content-between">
          <span>{{ recipe.name }}</span>
          <div>
            <button class="btn btn-link" @click="viewRecipe(recipe)">See Recipe</button>
            <button class="btn btn-link" @click="addRecipeToList(recipe)">Add to List</button>
            <button class="btn btn-link" @click="deleteRecipe(index)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Option Modal -->
    <div v-if="showRecipeOptionModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Recipe</h5>
            <button type="button" class="btn-close" @click="closeRecipeOptionModal"></button>
          </div>
          <div class="modal-body">
            <select v-model="recipeOption" class="form-select">
              <option value="" disabled selected>Select Option</option>
              <option value="manual">Add Recipe Manually</option>
              <option value="api">Add Recipe Using Existing Recipes</option>
            </select>
            <button class="btn btn-primary mt-3" @click="selectRecipeOption">Continue</button>
          </div>
        </div>
      </div>
    </div>

<!-- Add Recipe Manually Modal -->
<div v-if="showAddManualRecipeModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Recipe Manually</h5>
            <button type="button" class="btn-close" @click="closeAddManualRecipeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitManualRecipe">
              <div class="mb-3">
                <label for="recipeName" class="form-label">Recipe Name</label>
                <input type="text" v-model="newRecipeName" class="form-control" id="recipeName" required>
              </div>
              <div class="mb-3">
                <label for="recipeDirections" class="form-label">Directions</label>
                <textarea v-model="newRecipeDirections" class="form-control" id="recipeDirections" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Add Ingredients</label>
                <div class="d-flex mb-2">
                  <input type="text" v-model="newIngredientName" class="form-control me-2" placeholder="Ingredient Name">
                  <select v-model="newIngredientCategory" class="form-select me-2">
                    <option value="" disabled selected>Select Category</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Produce">Produce</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  <button type="button" class="btn btn-secondary" @click="addIngredientToNewRecipe">Add Ingredient</button>
                </div>
                <ul class="list-group">
                  <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(ingredient, index) in newRecipeIngredients" :key="index">
                    <span>{{ ingredient.name }} ({{ ingredient.category }})</span>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteIngredientFromNewRecipe(index)">Delete</button>
                  </li>
                </ul>
              </div>
              <button type="submit" class="btn btn-primary">Create Recipe</button>
            </form>
          </div>
        </div>
      </div>
    </div>


    <!-- Add API Recipe Modal -->
    <add-api-recipe v-if="showApiRecipeModal" @add-recipe="addRecipe" @close-modal="closeApiRecipeModal"></add-api-recipe>

    <!-- View API Recipe Modal -->
    <see-api-recipe v-if="showViewApiRecipeModal" :current-recipe="currentRecipe" @update-recipe="updateRecipe" @close-modal="closeViewApiRecipeModal"></see-api-recipe>
  </div>
</template>

<script>
import AddApiRecipe from '@/components/AddApiRecipe.vue';
import SeeApiRecipe from '@/components/SeeApiRecipe.vue';
import FoodItem from '@/models/FoodItem.js';
import Recipe from '@/models/Recipe.js';

export default {
  name: 'RecipeComponent',
  components: {
    AddApiRecipe,
    SeeApiRecipe,
  },
  props: {
    recipes: {
      type: Array,
      required: true,
      default: () => [],
    },
    lists: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      searchRecipesQuery: '',
      showRecipeOptionModal: false,
      showAddManualRecipeModal: false,
      showApiRecipeModal: false,
      showViewApiRecipeModal: false,
      recipeOption: '',
      newRecipeName: '',
      newRecipeDirections: '',
      newIngredientName: '',
      newIngredientCategory: '',
      newRecipeIngredients: [],
      currentRecipe: null,
    };
  },
  computed: {
    filteredRecipes() {
      const query = this.searchRecipesQuery.trim().toLowerCase();
      return query ? this.recipes.filter((recipe) => recipe.name.toLowerCase().includes(query)) : this.recipes;
    },
  },
  methods: {
    selectRecipeOption() {
      if (this.recipeOption === 'manual') {
        this.showAddManualRecipeModal = true;
      } else if (this.recipeOption === 'api') {
        this.showApiRecipeModal = true;
      }
      this.showRecipeOptionModal = false;
    },
    closeRecipeOptionModal() {
      this.showRecipeOptionModal = false;
    },
    closeAddManualRecipeModal() {
      this.showAddManualRecipeModal = false;
    },
    closeApiRecipeModal() {
      this.showApiRecipeModal = false;
    },
    closeViewApiRecipeModal() {
      this.showViewApiRecipeModal = false;
    },
    addRecipe(newRecipe) {
      if (newRecipe) {
        this.$emit('add-recipe', newRecipe);
        this.showApiRecipeModal = false; // Close the API modal if it was an API-added recipe
      }
    },
    submitManualRecipe() {
      if (this.newRecipeName.trim() && this.newRecipeDirections.trim()) {
        const newRecipe = new Recipe(
          this.newRecipeName,
          this.newRecipeIngredients,
          this.newRecipeDirections
        );
        this.$emit('add-recipe', newRecipe);
        this.resetManualRecipeForm();
        this.closeAddManualRecipeModal();
      }
    },
    resetManualRecipeForm() {
      this.newRecipeName = '';
      this.newRecipeDirections = '';
      this.newIngredientName = '';
      this.newIngredientCategory = '';
      this.newRecipeIngredients = [];
    },
    viewRecipe(recipe) {
      this.currentRecipe = { ...recipe };
      if (recipe.isFromApi) {
        this.showViewApiRecipeModal = true;
      } else {
        // handle other recipe viewing if necessary
      }
    },
    updateRecipe(updatedRecipe) {
      const index = this.recipes.findIndex((recipe) => recipe.name === updatedRecipe.name);
      if (index !== -1) {
        this.$emit('update-recipe', index, updatedRecipe);
        this.showViewApiRecipeModal = false;
      }
    },
    addRecipeToList(recipe) {
      this.$emit('add-recipe-to-list', recipe);
    },
    deleteRecipe(index) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        this.$emit('delete-recipe', index);
      }
    },
  },
};
</script>

<style scoped>
</style>
