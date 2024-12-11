<template>
  <div>
    <h2>Recipes:</h2>
    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-primary" @click="showRecipeOptionModal = true">+ Add New Recipe</button>
      <input type="text" v-model="searchRecipesQuery" class="form-control w-50" placeholder="Search Recipes" />
    </div>
    <div class="list-group">
      <div class="list-group-item" v-for="(recipe, index) in filteredRecipes" :key="recipe.id || recipe.name">
        <div class="d-flex justify-content-between">
          <span>{{ recipe.name }}</span>
          <div>
            <button class="btn btn-link" @click="viewRecipe(recipe)">See Recipe</button>
            <button class="btn btn-link" @click="openAddToListModal(recipe)">Add to List</button>
            <button class="btn btn-link" @click="deleteRecipe(index)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <add-to-list-modal v-if="showAddToListModal" :lists="lists" :selected-recipe="selectedRecipe" :user-id="authUser.id"
      @update-lists="lists = $event" @close-modal="showAddToListModal = false" />

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
              <!-- <option value="" disabled>Select Option</option>
              <option value="manual">Add Recipe Manually</option> -->
              <option value="api">Add Recipe Using Existing Recipes</option>
            </select>
            <button class="btn btn-primary mt-3" @click="selectRecipeOption">Continue</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Recipe Modals -->
    <add-manual-recipe v-if="showAddManualRecipeModal" @add-recipe="addRecipe"
      @close-modal="closeAddManualRecipeModal"></add-manual-recipe>
    <add-api-recipe v-if="showApiRecipeModal" @add-recipe="addRecipe"
      @close-modal="closeApiRecipeModal"></add-api-recipe>

    <!-- See Recipe Modals -->
    <see-manual-recipe v-if="showViewManualRecipeModal" :current-recipe="currentRecipe" @update-recipe="updateRecipe"
      @close-modal="closeViewManualRecipeModal"></see-manual-recipe>
    <see-api-recipe v-if="showViewApiRecipeModal" :current-recipe="currentRecipe" @update-recipe="updateRecipe"
      @close-modal="closeViewApiRecipeModal"></see-api-recipe>

    <!-- Add to List Modal -->
    <div v-if="showAddToListModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add to List</h5>
            <button type="button" class="btn-close" @click="closeAddToListModal"></button>
          </div>
          <div class="modal-body">
            <select v-model="selectedList" class="form-select">
              <option value="" disabled>Select a List</option>
              <option v-for="list in lists" :key="list.name" :value="list">{{ list.name }}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="addRecipeToSelectedList">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddManualRecipe from "@/components/AddManualRecipe.vue";
import AddApiRecipe from "@/components/AddApiRecipe.vue";
import SeeManualRecipe from "@/components/SeeManualRecipe.vue";
import SeeApiRecipe from "@/components/SeeApiRecipe.vue";
import AddToListModal from "@/components/AddToListModal.vue";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/models/firebase.js";

export default {
  name: "RecipeComponent",
  components: {
    AddManualRecipe,
    AddApiRecipe,
    SeeManualRecipe,
    SeeApiRecipe,
    AddToListModal,
  },
  props: {
    recipes: {
      type: Array,
      required: true,
    },
    lists: {
      type: Array,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchRecipesQuery: "",
      showRecipeOptionModal: false,
      showAddManualRecipeModal: false,
      showApiRecipeModal: false,
      showViewManualRecipeModal: false,
      showViewApiRecipeModal: false,
      showAddToListModal: false,
      recipeOption: "",
      currentRecipe: null,
      selectedRecipe: null,
      selectedList: null,
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
      if (this.recipeOption === "manual") {
        this.showAddManualRecipeModal = true;
      } else if (this.recipeOption === "api") {
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
    viewRecipe(recipe) {
      this.currentRecipe = { ...recipe };
      if (recipe.isFromApi) {
        this.showViewApiRecipeModal = true;
      } else {
        this.showViewManualRecipeModal = true;
      }
    },
    closeViewManualRecipeModal() {
      this.showViewManualRecipeModal = false;
    },
    closeViewApiRecipeModal() {
      this.showViewApiRecipeModal = false;
    },
    async addRecipe(newRecipe) {
      if (!newRecipe.name || !newRecipe.ingredients) {
        alert("Invalid recipe data. Please check the details and try again.");
        return;
      }

      this.recipes.push(newRecipe);

      const userDocRef = doc(db, "users", this.userId);
      try {
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error("User document does not exist. Initialize it first.");
          return;
        }

        const userData = userDoc.data();
        const updatedRecipes = [...(userData.recipes || []), newRecipe.toObject()];

        await updateDoc(userDocRef, { recipes: updatedRecipes });
        console.log("Recipe added successfully to Firebase.");
      } catch (error) {
        console.error("Error adding recipe to Firebase:", error);
      }
    },
    async deleteRecipe(index) {
      if (confirm("Are you sure you want to delete this recipe?")) {
        const recipeToDelete = this.recipes[index];

        this.recipes.splice(index, 1);

        const userDocRef = doc(db, "users", this.userId);
        await updateDoc(userDocRef, {
          recipes: this.recipes.map((recipe) => recipe.toObject()),
        })
          .then(() => {
            console.log("Recipe deleted successfully from Firebase.");
          })
          .catch((error) => {
            console.error("Error deleting recipe from Firebase:", error);
          });
      }
    },
  },
};
</script>


<style scoped></style>
