<template>
  <div id="app">
    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <main-nav :tabs="tabs" :active-tab="activeTab" @tab-change="switchTab"></main-nav>
      <h1>Loading...</h1>
      <div class="skeleton-loader">
        <div class="skeleton skeleton-header"></div>
        <div class="skeleton skeleton-paragraph"></div>
        <div class="skeleton skeleton-paragraph"></div>
      </div>
      <footer class="text-center py-3 mt-5" id="footer">
        <p class="mb-0">&copy; 2024 Pantry Pal - Manage Your Recipes and Lists</p>
      </footer>
    </div>

    <!-- Welcome Screen -->
    <div v-else-if="!authUser || !authUser.id" class="text-center my-5">
      <h1>Welcome to Pantry Pal</h1>
      <p>Please log in to access your recipes and grocery lists.</p>
      <button class="btn btn-primary" @click="login">Login with Google</button>
    </div>

    <!-- Main App Content -->
    <div v-else>
      <!-- Main Navigation -->
      <main-nav :tabs="tabs" :active-tab="activeTab" @tab-change="switchTab"></main-nav>

      <!-- Content Container -->
      <div class="container mt-4">
        <!-- Lists Tab -->
        <list-component
          v-if="activeTab === 'lists'"
          :lists="lists"
          @add-list="addList"
          @delete-list="deleteList"
          @view-list="viewList"
        ></list-component>
        <p v-if="activeTab === 'lists' && lists.length === 0" class="text-center text-muted">
          No lists created. Start by adding your first list!
        </p>

        <!-- Recipes Tab -->
        <recipe-component
          v-if="activeTab === 'recipes'"
          :recipes="recipes"
          :lists="lists"
          :api-key="apiKey"
          @add-recipe="addRecipe"
          @delete-recipe="deleteRecipe"
          @view-recipe="viewRecipe"
        ></recipe-component>
        <p v-if="activeTab === 'recipes' && recipes.length === 0" class="text-center text-muted">
          No recipes added. Start by creating your first recipe!
        </p>

        <!-- Settings Tab -->
        <settings-component
          v-if="activeTab === 'settings'"
          :login="login"
          :logout="logout"
          :auth-user="authUser"
        ></settings-component>

        <!-- View List Modal -->
        <view-list-modal
          v-if="showViewListModal"
          :current-list="currentList"
          @close-modal="closeViewListModal"
          @add-item-to-list="addItemToCurrentList"
          @delete-item-from-list="deleteItemFromCurrentList"
        ></view-list-modal>

        <!-- View Recipe Modal -->
        <view-recipe-modal
          v-if="showViewRecipeModal"
          :current-recipe="currentRecipe"
          @close-modal="closeViewRecipeModal"
          @add-ingredient-to-recipe="addIngredientToRecipe"
          @delete-ingredient-from-recipe="deleteIngredientFromRecipe"
        ></view-recipe-modal>
      </div>

      <!-- Footer -->
      <footer class="text-center py-3 mt-5" id="footer">
        <p class="mb-0">&copy; 2024 Pantry Pal - Manage Your Recipes and Lists</p>
      </footer>
    </div>
  </div>
</template>

<script>
import MainNav from "@/components/MainNav.vue";
import ListComponent from "@/components/ListComponent.vue";
import RecipeComponent from "@/components/RecipeComponent.vue";
import SettingsComponent from "@/components/SettingsComponent.vue";
import ViewListModal from "@/components/ViewListModal.vue";
import ViewRecipeModal from "@/components/ViewRecipeModal.vue";
import AddApiRecipe from "@/components/AddApiRecipe.vue";
import AddManualRecipe from "@/components/AddManualRecipe.vue";
import SeeManualRecipe from "@/components/SeeManualRecipe.vue";
import GroceryList from "@/models/GroceryList.js";
import FoodItem from "@/models/FoodItem.js";
import Recipe from "@/models/Recipe.js";
import Auth from "@/models/Auth.js";

export default {
  components: {
    MainNav,
    ListComponent,
    RecipeComponent,
    SettingsComponent,
    ViewListModal,
    ViewRecipeModal,
    AddApiRecipe,
    AddManualRecipe,
    SeeManualRecipe,
  },
  data() {
    return {
      auth: new Auth(),
      authUser: null,
      loading: true,
      activeTab: "lists",
      tabs: [
        { id: "lists", label: "Lists" },
        { id: "recipes", label: "Recipes" },
        { id: "settings", label: "Settings" },
      ],
      apiKey: "1220a6ebd1cf4ccf9c6bd451a882b6ea",
      lists: [],
      recipes: [],
      currentList: null,
      currentRecipe: null,
      showViewListModal: false,
      showViewRecipeModal: false,
    };
  },
  methods: {
    login() {
      this.auth.login().then(() => {
        this.authUser = this.auth.user;
        this.syncUserData();
        window.location.reload();
      });
    },
    logout() {
      this.auth.logout().then(() => {
        this.authUser = null;
        this.lists = [];
        this.recipes = [];
      });
    },
    switchTab(tabId) {
      this.activeTab = tabId;
    },
    syncUserData() {
      this.lists = this.auth.lists.map(
        (list) =>
          new GroceryList(
            list.name,
            list.items.map((item) => ({
              name: item.name,
              unit: item.unit,
            }))
          )
      );

      this.recipes = this.auth.recipes.map(
        (recipe) =>
          new Recipe(
            recipe.name,
            recipe.ingredients.map((ingredient) => ({
              name: ingredient.name,
              unit: ingredient.unit,
            })),
            recipe.instructions
          )
      );
    },
    addList(newList) {
      this.auth.addList(newList);
      this.syncUserData();
    },
    deleteList(index) {
      this.auth.deleteList(index);
      this.syncUserData();
    },
    viewList(list) {
      this.currentList = { ...list };
      this.showViewListModal = true;
    },
    closeViewListModal() {
      this.showViewListModal = false;
    },
    addItemToCurrentList(newItem) {
      if (this.currentList && newItem) {
        this.currentList.addItem(newItem);
        this.syncUserData();
      }
    },
    deleteItemFromCurrentList(index) {
      if (this.currentList) {
        this.currentList.removeItem(index);
        this.syncUserData();
      }
    },
    addRecipe(newRecipe) {
      this.auth.addRecipe(newRecipe);
      this.syncUserData();
    },
    deleteRecipe(index) {
      this.auth.deleteRecipe(index);
      this.syncUserData();
    },
    viewRecipe(recipe) {
      this.currentRecipe = { ...recipe };
      this.showViewRecipeModal = true;
    },
    closeViewRecipeModal() {
      this.showViewRecipeModal = false;
    },
    addIngredientToRecipe(ingredient) {
      if (this.currentRecipe) {
        this.currentRecipe.ingredients.push(ingredient);
        this.syncUserData();
      }
    },
    deleteIngredientFromRecipe(index) {
      if (this.currentRecipe) {
        this.currentRecipe.ingredients.splice(index, 1);
        this.syncUserData();
      }
    },
  },
  created() {
    this.auth._startSession();
    setTimeout(() => {
      this.authUser = this.auth.user;
      this.syncUserData();
      this.loading = false;
    }, 1000);
  },
};
</script>

<style scoped>
#footer {
  background-color: var(--bs-secondary);
}
</style>
