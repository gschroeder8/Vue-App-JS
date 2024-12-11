import FoodItem from './FoodItem';

export default class Recipe {
  constructor(name, ingredients = [], instructions = '', isFromApi = false, apiId = null) {
    this.name = name ?? 'Unnamed Recipe';
    this.ingredients = ingredients.map(ingredient => 
      ingredient instanceof FoodItem 
        ? ingredient 
        : new FoodItem(ingredient.name, ingredient.category ?? 'Miscellaneous', ingredient.amount, ingredient.unit)
    );
    this.instructions = instructions;
    this.isFromApi = isFromApi; // Indicates if the recipe came from an API
    this.apiId = apiId; // API-specific ID if applicable
  }

  static type = 'Recipe';

  addIngredient(ingredient) {
    this.ingredients.push(
      ingredient instanceof FoodItem 
        ? ingredient 
        : new FoodItem(ingredient.name, ingredient.category ?? 'Miscellaneous', ingredient.amount, ingredient.unit)
    );
  }

  removeIngredient(index) {
    this.ingredients.splice(index, 1);
  }

  // Converts the Recipe object to a plain object for saving to Firebase
  toObject() {
    return {
      name: this.name,
      ingredients: this.ingredients.map(ingredient => ingredient.toObject()),
      instructions: this.instructions,
      isFromApi: this.isFromApi,
      apiId: this.apiId,
    };
  }

  // Reconstructs a Recipe object from a plain object
  static fromObject(obj) {
    if (!obj) return null;
    return new Recipe(
      obj.name,
      obj.ingredients?.map(FoodItem.fromObject) ?? [],
      obj.instructions ?? '',
      obj.isFromApi ?? false,
      obj.apiId ?? null
    );
  }
}
