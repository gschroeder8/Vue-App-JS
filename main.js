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
        {
          id: 1,
          name: 'Grocery List',
          items: [
            { name: 'Milk', category: 'Dairy' },
            { name: 'Bread', category: 'Produce' }
          ]
        }
      ],
      recipes: [
        {
          id: 1,
          name: 'Stuffed Peppers',
          ingredients: [
            { name: 'Bell Peppers', category: 'Produce' },
            { name: 'Cheese', category: 'Dairy' }
          ],
          instructions: 'Cut them up and like stuff them :).'
        },
        {
          id: 2,
          name: 'BBQ Pulled Pork',
          ingredients: [
            { name: 'Pork', category: 'Meat' },
            { name: 'BBQ Sauce', category: 'Snacks' }
          ],
          instructions: 'Pull the pork (idk).'
        }
      ],
      currentList: null,
      currentRecipe: null,
      showViewListModal: false,
      showViewRecipeModal: false
    };
  },
  methods: {
    addList(newList) {
      newList.id = Date.now();
      newList.items = newList.items || [];
      this.lists.push(newList);
    },
    deleteList(index) {
      this.lists.splice(index, 1);
    },
    viewList(list) {
      this.currentList = list;
      this.showViewListModal = true;
    },
    addItemToList(item) {
      if (this.currentList) {
        this.currentList.items.push(item);
      }
    },
    deleteItemFromList(index) {
      if (this.currentList) {
        this.currentList.items.splice(index, 1);
      }
    },
    addRecipe(newRecipe) {
      newRecipe.id = Date.now(); 
      newRecipe.ingredients = newRecipe.ingredients || [];
      this.recipes.push(newRecipe);
    },
    deleteRecipe(index) {
      this.recipes.splice(index, 1);
    },
    viewRecipe(recipe) {
      this.currentRecipe = recipe;
      this.showViewRecipeModal = true;
    },
    addIngredientToRecipe(ingredient) {
      if (this.currentRecipe) {
        this.currentRecipe.ingredients.push(ingredient);
      }
    },
    deleteIngredientFromRecipe(index) {
      if (this.currentRecipe) {
        this.currentRecipe.ingredients.splice(index, 1);
      }
    },
    addRecipeToList({ recipe, listId }) {
      const list = this.lists.find((l) => l.id === listId);
      if (list) {
        list.items.push(...recipe.ingredients);
        alert(`Ingredients added to ${list.name}`);
      } else {
        alert('List not found.');
      }
    },
    switchTab(tabId) {
      this.activeTab = tabId;
    }
  }
});