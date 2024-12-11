import FoodItem from './FoodItem.js';

export default class ManualRecipe {
  constructor(name, ingredients = [], instructions = '') {
    this.name = name || 'Unnamed Recipe';
    this.ingredients = ingredients.map(
      (ingredient) =>
        ingredient instanceof FoodItem
          ? ingredient
          : new FoodItem(ingredient.name, ingredient.category || 'Miscellaneous', ingredient.amount, ingredient.unit)
    );
    this.instructions = instructions;
    this.isFromApi = false;
  }

  static type = 'ManualRecipe';

  addIngredient(ingredient) {
    this.ingredients.push(
      ingredient instanceof FoodItem
        ? ingredient
        : new FoodItem(ingredient.name, ingredient.category || 'Miscellaneous', ingredient.amount, ingredient.unit)
    );
  }

  removeIngredient(index) {
    this.ingredients.splice(index, 1);
  }

  toObject() {
    return {
      name: this.name,
      ingredients: this.ingredients.map((ingredient) => ingredient.toObject()),
      instructions: this.instructions,
      isFromApi: this.isFromApi,
    };
  }

  static fromObject(obj) {
    if (!obj) return null;
    return new ManualRecipe(
      obj.name,
      obj.ingredients?.map(FoodItem.fromObject) ?? [],
      obj.instructions || ''
    );
  }
}
