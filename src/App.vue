<template>
  <div id="app">
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

      <!-- Recipes Tab -->
      <recipe-component
        v-if="activeTab === 'recipes'"
        :recipes="recipes"
        :lists="lists"
        @add-recipe="addRecipe"
        @delete-recipe="deleteRecipe"
        @view-recipe="viewRecipe"
        @add-recipe-to-list="addRecipeToList"
      ></recipe-component>

      <!-- Settings Tab -->
      <settings-component
        v-if="activeTab === 'settings'"

        
      ></settings-component>

      <!-- View List Modal -->
      <view-list-modal
        v-if="showViewListModal"
        :current-list="currentList"
        @close-modal="closeViewListModal"
        @add-item-to-list="addItemToCurrentList"
        @delete-item-from-list="deleteItemFromCurrentList"
      ></view-list-modal>

      <!-- Add API Recipe Modal -->
      <add-api-recipe
        v-if="showAddApiRecipeModal"
        @add-recipe="addRecipe"
        @close-modal="closeAddApiRecipeModal"
      ></add-api-recipe>

      <!-- View API Recipe Modal -->
      <see-api-recipe
        v-if="showViewApiRecipeModal"
        :current-recipe="currentRecipe"
        @close-modal="closeViewRecipeModal"
      ></see-api-recipe>

      <!-- View Recipe Modal (for manually added recipes) -->
      <view-recipe-modal
        v-if="showViewManualRecipeModal"
        :current-recipe="currentRecipe"
        @close-modal="closeViewManualRecipeModal"
        @add-ingredient-to-recipe="addIngredientToRecipe"
        @delete-ingredient-from-recipe="deleteIngredientFromRecipe"
      ></view-recipe-modal>
    </div>

    <!-- Footer -->
    <footer class="text-center py-3 mt-5" id="footer">
      <p class="mb-0">Vue App v4.0</p>
    </footer>
  </div>
</template>

<script>
import MainNav from '@/components/MainNav.vue';
import ListComponent from '@/components/ListComponent.vue';
import RecipeComponent from '@/components/RecipeComponent.vue';
import SettingsComponent from '@/components/SettingsComponent.vue';
import ViewListModal from '@/components/ViewListModal.vue';
import ViewRecipeModal from '@/components/ViewRecipeModal.vue';
import AddApiRecipe from '@/components/AddApiRecipe.vue';
import SeeApiRecipe from '@/components/SeeApiRecipe.vue';
import GroceryList from '@/models/GroceryList.js';
import FoodItem from '@/models/FoodItem.js';
import Recipe from '@/models/Recipe.js';

export default {
  components: {
    MainNav,
    ListComponent,
    RecipeComponent,
    SettingsComponent,
    ViewListModal,
    ViewRecipeModal,
    AddApiRecipe,
    SeeApiRecipe,
  },
  data() {
    return {
      activeTab: 'lists',
      tabs: [
        { id: 'lists', label: 'Lists' },
        { id: 'recipes', label: 'Recipes' },
        { id: 'settings', label: 'Settings' },
      ],
      lists: [
        new GroceryList('Grocery List', [
          new FoodItem('Milk', 'Dairy'),
          new FoodItem('Bread', 'Bakery'),
        ]),
      ],
      recipes: [
        new Recipe('Stuffed Peppers', [
          new FoodItem('Bell Peppers', 'Produce'),
          new FoodItem('Cheese', 'Dairy'),
        ], 'Cut them up and stuff them.'),
      ],
      currentList: null,
      currentRecipe: null,
      showViewListModal: false,
      showViewApiRecipeModal: false,
      showViewManualRecipeModal: false,
      showAddApiRecipeModal: false,
    };
  },
  methods: {
    switchTab(tabId) {
      this.activeTab = tabId;
    },
    addList(newList) {
      if (newList) {
        this.lists.push(newList);
        this.lists = [...this.lists];
      }
    },
    deleteList(index) {
      if (confirm('Are you sure you want to delete this list?')) {
        this.lists.splice(index, 1);
        this.lists = [...this.lists];
      }
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
        this.currentList = { ...this.currentList };
        this.lists = [...this.lists];
      }
    },
    deleteItemFromCurrentList(index) {
      if (this.currentList) {
        this.currentList.removeItem(index);
        this.currentList = { ...this.currentList };
        this.lists = [...this.lists];
      }
    },
    addRecipe(newRecipe) {
      if (newRecipe) {
        this.recipes.push(newRecipe);
        this.recipes = [...this.recipes];
      }
    },
    deleteRecipe(index) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        this.recipes.splice(index, 1);
        this.recipes = [...this.recipes];
      }
    },
    viewRecipe(recipe) {
      this.currentRecipe = { ...recipe };
      if (recipe.isFromApi) {
        this.showViewApiRecipeModal = true;
      } else {
        this.showViewManualRecipeModal = true;
      }
    },
    closeViewRecipeModal() {
      this.showViewApiRecipeModal = false;
    },
    closeViewManualRecipeModal() {
      this.showViewManualRecipeModal = false;
    },
    addRecipeToList(recipe) {
      const listNames = this.lists.map(list => list.name).join(', ');
      const listName = prompt(`Add ingredients from "${recipe.name}" to which list? (${listNames})`);
      if (listName) {
        const list = this.lists.find(l => l.name.toLowerCase() === listName.toLowerCase());
        if (list) {
          recipe.ingredients.forEach(ingredient => list.addItem(ingredient));
          this.lists = [...this.lists];
          alert(`Ingredients from "${recipe.name}" added to "${list.name}"`);
        } else {
          alert('List not found.');
        }
      }
    },
    openAddApiRecipeModal() {
      this.showAddApiRecipeModal = true;
    },
    closeAddApiRecipeModal() {
      this.showAddApiRecipeModal = false;
    },
    addIngredientToRecipe(ingredient) {
      if (this.currentRecipe) {
        this.currentRecipe.ingredients.push(ingredient);
        this.currentRecipe = { ...this.currentRecipe };
        this.recipes = [...this.recipes];
      }
    },
    deleteIngredientFromRecipe(index) {
      if (this.currentRecipe) {
        this.currentRecipe.ingredients.splice(index, 1);
        this.currentRecipe = { ...this.currentRecipe };
        this.recipes = [...this.recipes];
      }
    },
    // toggleDarkMode() {
    //   document.body.classList.toggle('dark-mode');
    // },
  },
};
</script>

<style scoped>
#footer {
  background-color: var(--bs-secondary);
}
</style>
