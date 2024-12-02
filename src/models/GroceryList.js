import FoodItem from './FoodItem';

export default class GroceryList {
  constructor(name, items = []) {
    this.name = name ?? 'Unnamed List';
    this.items = items.map(item => new FoodItem(item.name, item.category));
  }

  static type = 'GroceryList';

  addItem(item) {
    this.items.push(new FoodItem(item.name, item.category));
  }

  removeItem(index) {
    this.items.splice(index, 1);
  }
}
