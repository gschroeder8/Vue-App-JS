export default class FoodItem {
  constructor(name, category) {
    this.name = name ?? 'Unnamed Item';
    this.category = category ?? 'Uncategorized';
  }

  static type = 'FoodItem';
}
