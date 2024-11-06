window.app = Vue.createApp({
  data() {
    return {
      activeTab: 'lists',
      tabs: [
        { id: 'lists', label: 'Lists' },
        { id: 'recipes', label: 'Recipes' },
        { id: 'settings', label: 'Settings' }
      ],
      lists: [
        new GroceryList('Grocery List', [
          new FoodItem('Milk', 'Dairy'),
          new FoodItem('Bread', 'Produce')
        ])
      ],
      recipes: [
        new Recipe('Stuffed Peppers', [
          new FoodItem('Bell Peppers', 'Produce'),
          new FoodItem('Cheese', 'Dairy')
        ], 'Cut them up and stuff them.'),
        new Recipe('BBQ Pulled Pork', [
          new FoodItem('Pork', 'Meat'),
          new FoodItem('BBQ Sauce', 'Snacks')
        ], 'Pull the pork and mix with BBQ sauce.')
      ],
      currentList: null,
      currentRecipe: null,
      showViewListModal: false,
      showViewRecipeModal: false,
      showCreateListModal: false,
      showCreateRecipeModal: false
    };
  },
  methods: {
    switchTab(tabId) {
      this.activeTab = tabId;
    },

    addList(newListName) {
      if (newListName) {
        this.lists.push(new GroceryList(newListName));
        this.lists = [...this.lists];
      }
    },
    deleteList(index) {
      this.lists.splice(index, 1);
      this.lists = [...this.lists];
    },
    viewList(list) {
      this.currentList = { ...list };
      this.showViewListModal = true;
    },
    addItemToList(itemName, category) {
      if (this.currentList && itemName && category) {
        const newItem = new FoodItem(itemName, category);
        this.currentList.addItem(newItem);
        this.currentList = { ...this.currentList };
        this.lists = [...this.lists]; 
      }
    },
    deleteItemFromList(index) {
      if (this.currentList) {
        this.currentList.removeItem(index);
        this.currentList = { ...this.currentList }; 
        this.lists = [...this.lists]; 
      }
    },

    addRecipe(newRecipeName, ingredients = [], instructions = '') {
      if (newRecipeName) {
        const newRecipe = new Recipe(newRecipeName, ingredients, instructions);
        this.recipes.push(newRecipe);
        this.recipes = [...this.recipes];
      }
    },
    deleteRecipe(index) {
      this.recipes.splice(index, 1);
      this.recipes = [...this.recipes]; 
    },
    viewRecipe(recipe) {
      this.currentRecipe = { ...recipe }; 
      this.showViewRecipeModal = true;
    },
    addIngredientToRecipe(ingredientName, category) {
      if (this.currentRecipe && ingredientName && category) {
        const newIngredient = new FoodItem(ingredientName, category);
        this.currentRecipe.addIngredient(newIngredient);
        this.currentRecipe = { ...this.currentRecipe }; 
        this.recipes = [...this.recipes]; 
      }
    },
    deleteIngredientFromRecipe(index) {
      if (this.currentRecipe) {
        this.currentRecipe.removeIngredient(index);
        this.currentRecipe = { ...this.currentRecipe };
        this.recipes = [...this.recipes];
      }
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

    openCreateListModal() {
      this.showCreateListModal = true;
    },
    closeCreateListModal() {
      this.showCreateListModal = false;
    },
    openCreateRecipeModal() {
      this.showCreateRecipeModal = true;
    },
    closeCreateRecipeModal() {
      this.showCreateRecipeModal = false;
    }
  }
});