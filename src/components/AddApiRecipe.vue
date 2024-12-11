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
            <input type="text" v-model="searchQuery" class="form-control me-2" placeholder="Search Recipes" />
            <button class="btn btn-primary" @click="fetchRecipes">Search</button>
          </div>
          <div v-if="loading" class="text-center">Loading...</div>
          <ul v-if="!loading && recipes.length" class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center" v-for="recipe in recipes" :key="recipe.id">
              <span>{{ recipe.title }}</span>
              <button class="btn btn-success btn-sm" @click="selectRecipe(recipe);">Select</button>
            </li>
          </ul>
          <p v-if="!loading && !recipes.length" class="text-center">No recipes found.</p>
          <div class="mt-3 d-flex justify-content-between align-items-center" v-if="totalPages > 1">
            <button class="btn btn-secondary" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
              Previous
            </button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import APIRecipe from "@/models/APIRecipe.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/models/firebase.js";

export default {
  name: "AddApiRecipe",
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      apiKey: "1220a6ebd1cf4ccf9c6bd451a882b6ea", // Hardcoded API Key
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
          `https://api.spoonacular.com/recipes/complexSearch?query=${this.searchQuery}&apiKey=${this.apiKey}&addRecipeInformation=true&number=${this.resultsPerPage}&offset=${(this.currentPage - 1) * this.resultsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
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
        const newRecipe = new APIRecipe(
          detailedRecipe.title || "Unnamed Recipe",
          detailedRecipe.extendedIngredients?.map((ing) => ({
            name: ing.name,
            amount: ing.amount || 0,
            unit: ing.unit || "",
          })) || [],
          detailedRecipe.analyzedInstructions
            ?.flatMap((inst) => inst.steps.map((step) => step.step))
            .join(" ") || "No instructions provided.",
          true,
          detailedRecipe.id
        );

        await this.addRecipeToFirebase(newRecipe);
        this.$emit("add-recipe", newRecipe);
        this.closeModal();
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    },
    async addRecipeToFirebase(recipe) {
      if (!this.userId) {
        console.error("User ID is required to add a recipe.");
        return;
      }

      try {
        const userDocRef = doc(db, "users", this.userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error("User document does not exist. Initializing new document.");
          await setDoc(userDocRef, { recipes: [] });
        }

        const userData = (await getDoc(userDocRef)).data();
        const updatedRecipes = [...(userData.recipes || []), recipe.toObject()];

        await setDoc(userDocRef, { recipes: updatedRecipes }, { merge: true });
        console.log("Recipe added to Firebase successfully.");
      } catch (error) {
        console.error("Error adding recipe to Firebase:", error);
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
