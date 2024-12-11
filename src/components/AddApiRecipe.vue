<template>
  <div class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Recipe Using Existing Recipes</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex mb-3">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control me-2"
              placeholder="Search Recipes"
            />
            <button class="btn btn-primary" @click="fetchRecipes">Search</button>
          </div>
          <div v-if="loading">Loading...</div>
          <ul v-if="!loading && recipes.length" class="list-group">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-for="recipe in recipes"
              :key="recipe.id"
            >
              <span>{{ recipe.title }}</span>
              <button class="btn btn-success btn-sm" @click="selectRecipe(recipe)">Select</button>
            </li>
          </ul>
          <p v-if="!loading && !recipes.length">No recipes found.</p>
          <div class="mt-3 d-flex justify-content-between align-items-center" v-if="totalPages > 1">
            <button
              class="btn btn-secondary"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              Previous
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              class="btn btn-secondary"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Recipe from "@/models/Recipe.js";

export default {
  name: "AddApiRecipe",
  props: {
    apiKey: {
      type: String,
      required: true,
    },
  },
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
          `https://api.spoonacular.com/recipes/complexSearch?query=${this.searchQuery}&apiKey=${this.apiKey}&addRecipeInformation=true&number=${this.resultsPerPage}&offset=${
            (this.currentPage - 1) * this.resultsPerPage
          }`
        );
        const data = await response.json();
        this.recipes = data.results || [];
        this.totalResults = data.totalResults || 0;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        this.loading = false;
      }
    },
    async selectRecipe(recipe) {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${this.apiKey}`
        );
        const detailedRecipe = await response.json();
        const newRecipe = new Recipe(
          detailedRecipe.title || "Unnamed Recipe",
          detailedRecipe.extendedIngredients?.map((ing) => ({
            name: ing.name,
            amount: ing.amount || 0,
            unit: ing.unit || "",
          })) || [],
          detailedRecipe.analyzedInstructions
            ?.flatMap((inst) => inst.steps.map((step) => step.step))
            .join(" ") || "No instructions provided.",
          true
        );
        this.$emit("add-recipe", newRecipe);
        this.closeModal();
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    },
    closeModal() {
      this.$emit("close-modal");
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchRecipes();
    },
  },
};
</script>

