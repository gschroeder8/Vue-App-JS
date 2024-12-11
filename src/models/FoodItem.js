export default class FoodItem {
  constructor(name, category = 'Miscellaneous', amount = null, unit = '') {
    this.name = name || 'Unnamed Item';
    this.category = category;
    this.amount = amount;
    this.unit = unit;
  }

  static type = 'FoodItem';

  toObject() {
    return {
      name: this.name,
      category: this.category,
      amount: this.amount,
      unit: this.unit,
    };
  }

  static fromObject(obj) {
    if (!obj) return null;
    return new FoodItem(obj.name, obj.category, obj.amount, obj.unit);
  }
}
