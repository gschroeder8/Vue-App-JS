app.component('view-recipe-modal', {
  props: {
    currentRecipe: Object
  },
  data() {
    return {
      newIngredientName: '',
      newIngredientCategory: ''
    };
  },
  methods: {
    addIngredientToRecipe() {
      if (this.newIngredientName.trim()) {
        this.$emit('add-ingredient-to-recipe', {
          name: this.newIngredientName,
          category: this.newIngredientCategory
        });
        this.newIngredientName = '';
        this.newIngredientCategory = '';
      }
    },
    deleteIngredient(index) {
      if (confirm("Are you sure you want to delete this ingredient?")) {
        this.$emit('delete-ingredient-from-recipe', index);
      }
    },
    closeModal() {
      this.$emit('close-modal');
    }
  },
  template: `
    <div class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Recipe: {{ currentRecipe ? currentRecipe.name : '' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addIngredientToRecipe">
              <div class="mb-3">
                <label for="ingredientName" class="form-label">Ingredient Name</label>
                <input
                  type="text"
                  v-model="newIngredientName"
                  class="form-control"
                  id="ingredientName"
                  placeholder="Enter ingredient name"
                  required
                >
              </div>
              <div class="mb-3">
                <label for="ingredientCategory" class="form-label">Category</label>
                <select v-model="newIngredientCategory" class="form-select" required>
                  <option value="" disabled selected>Select a category</option>
                  <option value="Meat">Meat</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Produce">Produce</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Seafood">Seafood</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Add Ingredient</button>
            </form>
            <hr>
            <h6>Ingredients:</h6>
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(ingredient, index) in currentRecipe.ingredients"
                :key="index"
              >
                <div class="d-flex justify-content-between">
                  <span>{{ ingredient.name }} ({{ ingredient.category }})</span>
                  <button class="btn btn-link" @click="deleteIngredient(index)">Delete</button>
                </div>
              </li>
            </ul>
            <hr>
            <h6>Instructions:</h6>
            <textarea v-model="currentRecipe.instructions" class="form-control" rows="4"></textarea>
          </div>
        </div>
      </div>
    </div>
  `
});
