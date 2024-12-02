import FoodItem from './FoodItem';

export default class Recipe {
  constructor(name, ingredients = [], instructions = '') {
    this.name = name ?? 'Unnamed Recipe';
    this.ingredients = ingredients.map(ingredient => new FoodItem(ingredient.name, ingredient.category));
    this.instructions = instructions;
  }

  static type = 'Recipe';

  addIngredient(ingredient) {
    this.ingredients.push(new FoodItem(ingredient.name, ingredient.category));
  }

  removeIngredient(index) {
    this.ingredients.splice(index, 1);
  }
}
