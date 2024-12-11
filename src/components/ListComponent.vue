<template>
  <div>
    <h2>Lists:</h2>
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

    <!-- View List Modal -->
    <view-list-modal v-if="showViewListModal" :current-list="currentList" @close-modal="closeViewListModal"
      @add-item-to-list="addItemToCurrentList" @delete-item-from-list="deleteItemFromCurrentList"></view-list-modal>

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
                  <input type="text" v-model="newItemName" class="form-control me-2" placeholder="Item Name" />
                  <select v-model="newItemCategory" class="form-select me-2">
                    <option value="" disabled>Select Category</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Produce">Produce</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                  <button type="button" class="btn btn-secondary" @click="addItemToNewList">
                    Add Item
                  </button>
                </div>
                <ul class="list-group">
                  <li class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="(item, index) in newListItems" :key="index">
                    <span>{{ item.name }} ({{ item.category }})</span>
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteItemFromNewList(index)">
                      Delete
                    </button>
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
import GroceryList from "@/models/GroceryList.js";
import FoodItem from "@/models/FoodItem.js";
import ViewListModal from "@/components/ViewListModal.vue";

export default {
  name: "ListComponent",
  components: { ViewListModal },
  props: {
    lists: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: "",
      showCreateListModal: false,
      showViewListModal: false,
      currentList: null,
      newListName: "",
      newItemName: "",
      newItemCategory: "",
      newListItems: [],
    };
  },
  computed: {
    filteredLists() {
      const query = this.searchQuery.trim().toLowerCase();
      return query
        ? this.lists.filter((list) => list.name.toLowerCase().includes(query))
        : this.lists;
    },
  },
  methods: {
    viewList(list) {
      this.currentList = { ...list };
      this.showViewListModal = true;
    },
    closeViewListModal() {
      this.showViewListModal = false;
      this.currentList = null;
    },
    addItemToCurrentList(newItem) {
      if (this.currentList && newItem && typeof newItem === 'object') {
        const itemExists = this.currentList.items.some(
          (item) => item.name === newItem.name && item.category === newItem.category
        );

        if (!itemExists) {
          this.currentList.items.push(newItem);
          this.$emit("update-list", { ...this.currentList });
        } else {
          console.warn("Item already exists in the list. Skipping duplicate addition.");
        }
      } else {
        console.error("Invalid item passed to addItemToCurrentList:", newItem);
      }
    },

    methods: {
      deleteItemFromCurrentList(index) {
        if (this.currentList && index >= 0 && index < this.currentList.items.length) {
          this.currentList.items.splice(index, 1);
          this.$emit("update-list", { ...this.currentList });
        } else {
          console.warn("Invalid index or no current list to update.");
        }
      },
    },

    addList() {
      const newList = new GroceryList(this.newListName, this.newListItems);
      this.$emit("add-list", newList);
      this.resetForm();
    },
    addItemToNewList() {
      if (this.newItemName.trim()) {
        this.newListItems.push(
          new FoodItem(this.newItemName, this.newItemCategory)
        );
        this.newItemName = "";
        this.newItemCategory = "";
      }
    },
    deleteItemFromNewList(index) {
      this.newListItems.splice(index, 1);
    },
    resetForm() {
      this.newListName = "";
      this.newItemName = "";
      this.newItemCategory = "";
      this.newListItems = [];
      this.showCreateListModal = false;
    },
    deleteList(index) {
      if (confirm("Are you sure you want to delete this list?")) {
        this.$emit("delete-list", index);
      }
    },
  },
};
</script>

<style scoped></style>
