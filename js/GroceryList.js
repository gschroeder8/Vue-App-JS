class GroceryList {
  constructor(name, items = []) {
    this.name = name;
    this.items = items;
  }

  addItem(foodItem) {
    if (foodItem instanceof FoodItem) {
      this.items.push(foodItem);
    }
  }

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
    }
  }
}