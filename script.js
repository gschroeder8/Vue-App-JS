const app = Vue.createApp({
    // data for the app (must return object)
    data() {
        return {
            newListName: '',
            newItemName: '',
            newItemCategory: '',
            searchQuery: '',
            searchRecipesQuery: '',
            newRecipeName: '',
            newRecipeIngredients: '',
            newIngredientName: '',
            newIngredientCategory: '',
            currentList: null,
            currentRecipe: null,
            showCreateListModal: false,
            showViewListModal: false,
            showCreateRecipeModal: false,
            showViewRecipeModal: false,
            lists: [
                { name: 'Grocery List', items: [{ name: 'Milk', category: 'Dairy' }, { name: 'Bread', category: 'Produce' }] },
            ],
            recipes: [
                { name: 'Stuffed Peppers', ingredients: [{ name: 'Bell Peppers', category: 'Produce' }, { name: 'Cheese', category: 'Dairy' }], instructions: 'Cut them up and like stuff them :).' },
                { name: 'BBQ Pulled Pork', ingredients: [{ name: 'Pork', category: 'Meat' }, { name: 'BBQ Sauce', category: 'Snacks' }], instructions: 'Pull the pork (idk).' }
            ],
        };
    },

    // all methods (events) " v-on " to call method within html
    computed: {
        filteredLists() {
            return this.searchQuery.trim()
                ? this.lists.filter(list => list.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
                : this.lists;
        },
        filteredRecipes() {
            return this.searchRecipesQuery.trim()
                ? this.recipes.filter(recipe => recipe.name.toLowerCase().includes(this.searchRecipesQuery.toLowerCase()))
                : this.recipes;
        }
    },

    // values being updated in the app (updated and chached if dependancies change)
    methods: {
        addList() {
            if (this.newListName.trim()) {
                this.lists.push({ name: this.newListName, items: [] });
                this.newListName = '';
                this.showCreateListModal = false;
            }
        },
        deleteList(index) {
            this.lists.splice(index, 1);
        },
        viewList(list) {
            this.currentList = list;
            this.showViewListModal = true;
        },
        addItemToList() {
            if (this.newItemName.trim() && this.currentList) {
                this.currentList.items.push({ name: this.newItemName, category: this.newItemCategory });
                this.newItemName = '';
                this.newItemCategory = '';
            }
        },
        deleteItemFromList(index) {
            if (this.currentList) {
                this.currentList.items.splice(index, 1);
            }
        },
        viewRecipe(recipe) {
            this.currentRecipe = recipe;
            this.showViewRecipeModal = true;
        },
        addIngredientToRecipe() {
            if (this.newIngredientName.trim() && this.currentRecipe) {
                this.currentRecipe.ingredients.push({ name: this.newIngredientName, category: this.newIngredientCategory });
                this.newIngredientName = '';
                this.newIngredientCategory = '';
            }
        },
        addRecipe() {
            if (this.newRecipeName.trim()) {
                const ingredients = this.newRecipeIngredients.split('\n').map(ingredient => ({ name: ingredient, category: 'Unknown' }));
                this.recipes.push({ name: this.newRecipeName, ingredients, instructions: '' });
                this.newRecipeName = '';
                this.newRecipeIngredients = '';
                this.showCreateRecipeModal = false;
            }
        },
        deleteRecipe(index) {
            this.recipes.splice(index, 1);
        },
        deleteIngredientFromRecipe(index) {
            if (this.currentRecipe) {
                this.currentRecipe.ingredients.splice(index, 1);
            }
        },
        addRecipeToList(recipe) {
            const selectedListName = prompt("Enter the name of the list to add ingredients to:");
            const list = this.lists.find(l => l.name === selectedListName);
            if (list) {
                recipe.ingredients.forEach(ingredient => {
                    list.items.push({ name: ingredient.name, category: ingredient.category });
                });
                alert(`Ingredients added to ${list.name}`);
            } else {
                alert("List not found.");
            }
        },
    },
    // TODO: implement local storage and watch for changes when attempting to implement this it kept slowing down or breaking the app I believe I was just
    // overloading it but I will have to rework this and read more of the documentation regarding these two on the next increment
    // // called after instance has been mounted
    // mounted() {
    // },
    // // calls function if the value changes
    // watch: {
    //     // watch for changes in the lists and recipes arrays and automatically save to local storage
    // }
});

app.mount('#app');
