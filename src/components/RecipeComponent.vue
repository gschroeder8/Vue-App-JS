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
            <button class="btn btn-link" @click="openAddToListModal(recipe)">Add to List</button>
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
              <option value="" disabled>Select Option</option>
              <option value="manual">Add Recipe Manually</option>
              <option value="api">Add Recipe Using Existing Recipes</option>
            </select>
            <button class="btn btn-primary mt-3" @click="selectRecipeOption">Continue</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Recipe Manually Modal -->
    <add-manual-recipe
      v-if="showAddManualRecipeModal"
      @add-recipe="addRecipe"
      @close-modal="closeAddManualRecipeModal"
    ></add-manual-recipe>

    <!-- Add Recipe Using API Modal -->
    <add-api-recipe
      v-if="showApiRecipeModal"
      @add-recipe="addRecipe"
      @close-modal="closeApiRecipeModal"
    ></add-api-recipe>

    <!-- See Manual Recipe Modal -->
    <see-manual-recipe
      v-if="showViewManualRecipeModal"
      :current-recipe="currentRecipe"
      @update-recipe="updateRecipe"
      @close-modal="closeViewManualRecipeModal"
    ></see-manual-recipe>

    <!-- See API Recipe Modal -->
    <see-api-recipe
      v-if="showViewApiRecipeModal"
      :current-recipe="currentRecipe"
      @update-recipe="updateRecipe"
      @close-modal="closeViewApiRecipeModal"
    ></see-api-recipe>

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

export default {
  name: "RecipeComponent",
  components: {
    AddManualRecipe,
    AddApiRecipe,
    SeeManualRecipe,
    SeeApiRecipe,
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
    addRecipe(newRecipe) {
      if (!newRecipe.name || !newRecipe.ingredients) {
        alert("Invalid recipe data. Please check the details and try again.");
        return;
      }
      this.recipes.push(newRecipe);
    },
    updateRecipe(updatedRecipe) {
      const index = this.recipes.findIndex((r) => r.name === updatedRecipe.name);
      if (index !== -1) {
        this.recipes.splice(index, 1, updatedRecipe);
      }
    },
    openAddToListModal(recipe) {
      this.selectedRecipe = recipe;
      this.showAddToListModal = true;
    },
    closeAddToListModal() {
      this.showAddToListModal = false;
      this.selectedRecipe = null;
      this.selectedList = null;
    },
    addRecipeToSelectedList() {
      if (this.selectedList && this.selectedRecipe) {
        const list = this.selectedList;
        this.selectedRecipe.ingredients.forEach((ingredient) => {
          if (!list.items.some((item) => item.name === ingredient.name)) {
            list.items.push({ name: ingredient.name, category: ingredient.category || "Miscellaneous" });
          }
        });
        alert(`"${this.selectedRecipe.name}" has been added to "${list.name}".`);
        this.closeAddToListModal();
      } else {
        alert("Please select a list.");
      }
    },
    deleteRecipe(index) {
      if (confirm("Are you sure you want to delete this recipe?")) {
        this.recipes.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped>
</style>
