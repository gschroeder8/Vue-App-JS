class Recipe {
  constructor(name, ingredients = [], instructions = '') {
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
  }

  addIngredient(ingredient) {
    if (ingredient instanceof FoodItem) {
      this.ingredients.push(ingredient);
    }
  }

  removeIngredient(index) {
    if (index >= 0 && index < this.ingredients.length) {
      this.ingredients.splice(index, 1);
    }
  }
}
