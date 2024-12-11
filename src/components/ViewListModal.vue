<template>
  <div class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">List: {{ currentList ? currentList.name : '' }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addItemToList">
            <div class="mb-3">
              <label for="itemName" class="form-label">Item Name</label>
              <input type="text" v-model="newItemName" class="form-control" id="itemName" placeholder="Enter item name"
                required>
            </div>
            <div class="mb-3">
              <label for="itemCategory" class="form-label">Category</label>
              <select v-model="newItemCategory" class="form-select" required>
                <option value="" disabled selected>Select a category</option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Produce">Produce</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Seafood">Seafood</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Add Item</button>
          </form>
          <hr>
          <ul class="list-group">
            <li class="list-group-item" v-for="(item, index) in currentList.items" :key="index">
              <div class="d-flex justify-content-between">
                <span>{{ item.name }} ({{ item.category }})</span>
                <button class="btn btn-link" @click="deleteItem(index)">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FoodItem from "@/models/FoodItem.js";

export default {
  name: "ViewListModal",
  props: {
    currentList: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newItemName: "",
      newItemCategory: "",
    };
  },
  methods: {
  addItemToList() {
    if (this.newItemName.trim()) {
      const newItem = new FoodItem(this.newItemName, this.newItemCategory || "Miscellaneous");
      this.$emit("add-item-to-list", newItem);
      this.newItemName = "";
      this.newItemCategory = "";
    }
  },
  deleteItem(index) {
    if (confirm("Are you sure you want to delete this item?")) {
      this.$emit("delete-item-from-list", index);
    }
  },
  closeModal() {
    this.$emit("close-modal");
  },
},
};


</script>

<style scoped></style>
