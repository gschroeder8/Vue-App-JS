<template>
    <div class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Recipe Using Spoonacular API</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="fetchRecipes">
              <div class="input-group mb-3">
                <input
                  type="text"
                  v-model="searchQuery"
                  class="form-control"
                  placeholder="Search Recipes"
                >
                <button class="btn btn-primary" type="submit">Search</button>
              </div>
            </form>
  
            <div class="text-center my-3">
              <button v-if="!loading && !searchQuery" class="btn btn-link" @click="browseAllRecipes">Browse All Recipes</button>
            </div>
  
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
  
            <div v-if="recipes.length > 0">
              <h6>Results:</h6>
              <div class="list-group">
                <div
                  class="list-group-item"
                  v-for="recipe in recipes"
                  :key="recipe.id"
                >
                  <div class="d-flex justify-content-between">
                    <span>{{ recipe.title }}</span>
                    <button
                      class="btn btn-primary"
                      @click="selectRecipe(recipe)"
                    >
                      Add Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Pagination Controls -->
            <div v-if="totalResults > 0" class="d-flex justify-content-between mt-3">
              <button class="btn btn-secondary" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Previous</button>
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AddApiRecipe",
    data() {
      return {
        searchQuery: "",
        recipes: [],
        loading: false,
        currentPage: 1,
        totalResults: 0,
        resultsPerPage: 10,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalResults / this.resultsPerPage);
      },
    },
    methods: {
      async fetchRecipes() {
        this.loading = true;
  
        try {
          const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?query=${this.searchQuery}&apiKey=1220a6ebd1cf4ccf9c6bd451a882b6ea&addRecipeInformation=true&number=${this.resultsPerPage}&offset=${(this.currentPage - 1) * this.resultsPerPage}`
          );
          const data = await response.json();
  
          if (data && data.results) {
            this.recipes = data.results;
            this.totalResults = data.totalResults;
          } else {
            this.recipes = [];
            this.totalResults = 0;
          }
        } catch (error) {
          console.error("Error fetching recipes from Spoonacular API:", error);
          this.recipes = [];
          this.totalResults = 0;
        } finally {
          this.loading = false;
        }
      },
      browseAllRecipes() {
        this.searchQuery = ""; // Setting search query to empty to browse all recipes
        this.currentPage = 1;  // Resetting to the first page
        this.fetchRecipes();
      },
      changePage(page) {
        this.currentPage = page;
        this.fetchRecipes();
      },
      selectRecipe(recipe) {
        if (!recipe) {
          console.error("Invalid recipe data", recipe);
          return;
        }
  
        // Handle missing ingredients
        const ingredients = recipe.extendedIngredients
          ? recipe.extendedIngredients.map((ingredient) => ({
              name: ingredient.name,
              category: "Miscellaneous",
            }))
          : [{ name: "No ingredients provided", category: "Miscellaneous" }];
  
        // Handle missing instructions
        const instructions = recipe.instructions
          ? recipe.instructions
          : "Instructions not provided.";
  
        const selectedRecipe = {
          name: recipe.title || "Unnamed Recipe",
          ingredients: ingredients,
          instructions: instructions,
          isFromApi: true,
        };
  
        // Emit the recipe data
        this.$emit("add-recipe", selectedRecipe);
        this.closeModal();
      },
      closeModal() {
        this.$emit("close-modal");
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  