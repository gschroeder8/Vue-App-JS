app.component('recipe-component', {
  props: {
    recipes: Array,
    lists: Array
  },
  data() {
    return {
      searchRecipesQuery: '',
      showCreateRecipeModal: false,
      showSelectListModal: false,
      newRecipeName: '',
      newRecipeDirections: '',
      newIngredientName: '',
      newIngredientCategory: '',
      newRecipeIngredients: [],
      selectedRecipe: null,
      selectedListId: null,
      categories: ['Meat', 'Dairy', 'Produce', 'Snacks', 'Beverages', 'Seafood', 'Bakery', 'Frozen', 'Baking', 'Miscellaneous'] // <-- Added predefined categories
    };
  },
  computed: {
    filteredRecipes() {
      const query = this.searchRecipesQuery.trim().toLowerCase();
      return query
        ? this.recipes.filter((recipe) => recipe.name.toLowerCase().includes(query))
        : this.recipes;
    }
  },
  methods: {
    addRecipe() {
      if (this.newRecipeName.trim()) {
        const newRecipe = {
          name: this.newRecipeName,
          ingredients: this.newRecipeIngredients,
          instructions: this.newRecipeDirections
        };
        this.$emit('add-recipe', newRecipe);
        this.newRecipeName = '';
        this.newRecipeDirections = '';
        this.newIngredientName = '';
        this.newIngredientCategory = '';
        this.newRecipeIngredients = [];
        this.showCreateRecipeModal = false;
      }
    },
    deleteRecipe(index) {
      if (confirm("Are you sure you want to delete this recipe?")) {
        this.$emit('delete-recipe', index);
      }
    },
    viewRecipe(recipe) {
      this.$emit('view-recipe', recipe);
    },
    addRecipeToList(recipe) {
      this.selectedRecipe = recipe;
      this.showSelectListModal = true;
    },
    confirmAddRecipeToList() {
      if (this.selectedListId) {
        this.$emit('add-recipe-to-list', {
          recipe: this.selectedRecipe,
          listId: this.selectedListId
        });
        this.selectedRecipe = null;
        this.selectedListId = null;
        this.showSelectListModal = false;
      }
    },
    addIngredientToNewRecipe() {
      if (this.newIngredientName.trim()) {
        this.newRecipeIngredients.push({
          name: this.newIngredientName,
          category: this.newIngredientCategory || 'Uncategorized'
        });
        this.newIngredientName = '';
        this.newIngredientCategory = '';
      }
    },
    deleteIngredientFromNewRecipe(index) {
      this.newRecipeIngredients.splice(index, 1);
    }
  },
  template: `
    <div>
      <h2>Your Recipes</h2>
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-primary" @click="showCreateRecipeModal = true">+ Add New Recipe</button>
        <input
          type="text"
          v-model="searchRecipesQuery"
          class="form-control w-50"
          placeholder="Search Recipes"
        >
      </div>

      <!-- Recipe Items -->
      <div class="list-group">
        <div class="list-group-item" v-for="(recipe, index) in filteredRecipes" :key="recipe.id">
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

      <!-- Modal for Creating New Recipe -->
      <div v-if="showCreateRecipeModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create New Recipe</h5>
              <button type="button" class="btn-close" @click="showCreateRecipeModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addRecipe">
                <div class="mb-3">
                  <label for="recipeName" class="form-label">Recipe Name</label>
                  <input type="text" v-model="newRecipeName" class="form-control" id="recipeName" required>
                </div>

                <!-- Section to add ingredients -->
                <div class="mb-3">
                  <label class="form-label">Add Ingredients</label>
                  <div class="d-flex mb-2">
                    <input type="text" v-model="newIngredientName" class="form-control me-2" placeholder="Ingredient Name">
                    <!-- Category Dropdown -->
                    <select v-model="newIngredientCategory" class="form-select me-2">
                      <option value="" disabled selected>Select Category</option>
                      <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                    </select>
                    <button type="button" class="btn btn-secondary" @click="addIngredientToNewRecipe">Add Ingredient</button>
                  </div>
                  <!-- Display added ingredients -->
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(ingredient, index) in newRecipeIngredients" :key="index">
                      <span>{{ ingredient.name }} ({{ ingredient.category }})</span>
                      <button type="button" class="btn btn-sm btn-danger" @click="deleteIngredientFromNewRecipe(index)">Delete</button>
                    </li>
                  </ul>
                </div>

                <div class="mb-3">
                  <label for="recipeDirections" class="form-label">Directions</label>
                  <textarea v-model="newRecipeDirections" class="form-control" id="recipeDirections" rows="3"></textarea>
                </div>

                <button type="submit" class="btn btn-primary">Create Recipe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal for Selecting List -->
      <div v-if="showSelectListModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Recipe to List</h5>
              <button type="button" class="btn-close" @click="showSelectListModal = false"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="confirmAddRecipeToList">
                <div class="mb-3">
                  <label class="form-label">Select a List</label>
                  <select v-model="selectedListId" class="form-select" required>
                    <option value="" disabled>Select a list</option>
                    <option
                      v-for="list in lists"
                      :key="list.id"
                      :value="list.id"
                    >{{ list.name }}</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Add to List</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
});
