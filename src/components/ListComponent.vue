<template>
  <div>
    <h2>Your Lists</h2>
    <div class="d-flex justify-content-between mb-3">
      <button class="btn btn-primary" @click="showCreateListModal = true">+ Add New List</button>
      <input type="text" v-model="searchQuery" class="form-control w-50" placeholder="Search Lists">
    </div>
    <div class="list-group">
      <div class="list-group-item" v-for="(list, index) in filteredLists" :key="list.name">
        <div class="d-flex justify-content-between">
          <span>{{ list.name }}</span>
          <div>
            <button class="btn btn-link" @click="viewList(list)">See List</button>
            <button class="btn btn-link" @click="deleteList(index)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create List Modal -->
    <div v-if="showCreateListModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New List</h5>
            <button type="button" class="btn-close" @click="showCreateListModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addList">
              <div class="mb-3">
                <label for="listName" class="form-label">List Name</label>
                <input type="text" v-model="newListName" class="form-control" id="listName" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Add Items to List</label>
                <div class="d-flex mb-2">
                  <input type="text" v-model="newItemName" class="form-control me-2" placeholder="Item Name">
                  <select v-model="newItemCategory" class="form-select me-2">
                    <option value="" disabled selected>Select Category</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Produce">Produce</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Seafood">Seafood</option>
                  </select>
                  <button type="button" class="btn btn-secondary" @click="addItemToNewList">Add Item</button>
                </div>
                <ul class="list-group">
                  <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(item, index) in newListItems" :key="index">
                    <span>{{ item.name }} ({{ item.category }})</span>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteItemFromNewList(index)">Delete</button>
                  </li>
                </ul>
              </div>
              <button type="submit" class="btn btn-primary">Create List</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GroceryList from '@/models/GroceryList.js';
import FoodItem from '@/models/FoodItem.js';

export default {
  name: 'ListComponent',
  props: {
    lists: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      searchQuery: '',
      showCreateListModal: false,
      newListName: '',
      newItemName: '',
      newItemCategory: '',
      newListItems: []
    };
  },
  computed: {
    filteredLists() {
      const query = this.searchQuery.trim().toLowerCase();
      return query ? this.lists.filter(list => list.name.toLowerCase().includes(query)) : this.lists;
    }
  },
  methods: {
    addList() {
      if (this.newListName.trim()) {
        const newList = new GroceryList(this.newListName, this.newListItems);
        this.$emit('add-list', newList);
        this.resetListForm();
      }
    },
    addItemToNewList() {
      if (this.newItemName.trim()) {
        this.newListItems.push(new FoodItem(this.newItemName, this.newItemCategory));
        this.newItemName = '';
        this.newItemCategory = '';
      }
    },
    deleteItemFromNewList(index) {
      this.newListItems.splice(index, 1);
    },
    resetListForm() {
      this.newListName = '';
      this.newItemName = '';
      this.newItemCategory = '';
      this.newListItems = [];
      this.showCreateListModal = false;
    },
    deleteList(index) {
      if (confirm("Are you sure you want to delete this list?")) {
        this.$emit('delete-list', index);
      }
    },
    viewList(list) {
      this.$emit('view-list', list);
    }
  }
};
</script>

<style scoped>
</style>
