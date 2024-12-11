import FoodItem from './FoodItem.js';

export default class GroceryList {
  constructor(name, items = []) {
    this.name = name || 'Unnamed List';
    this.items = items.map(
      (item) =>
        item instanceof FoodItem
          ? item
          : new FoodItem(item.name, item.category || 'Miscellaneous')
    );
  }

  static type = 'GroceryList';

  addItem(item) {
    this.items.push(
      item instanceof FoodItem
        ? item
        : new FoodItem(item.name, item.category || 'Miscellaneous')
    );
  }

  removeItem(index) {
    this.items.splice(index, 1);
  }

  toObject() {
    return {
      name: this.name,
      items: this.items.map((item) => item.toObject()),
    };
  }

  static fromObject(obj) {
    if (!obj) return null;
    return new GroceryList(
      obj.name,
      obj.items?.map(FoodItem.fromObject) ?? []
    );
  }
}
