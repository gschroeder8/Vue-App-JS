<template>
    <div class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add to List</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <select v-model="selectedList" class="form-select mb-3">
              <option value="" disabled>Select a List</option>
              <option v-for="list in lists" :key="list.name" :value="list">{{ list.name }}</option>
            </select>
            <div v-if="selectedList">
              <h6>Adding to: {{ selectedList.name }}</h6>
              <button class="btn btn-primary" @click="addRecipeToList">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "@/models/firebase.js";
  
  export default {
    name: "AddToListModal",
    props: {
      lists: {
        type: Array,
        required: true,
      },
      selectedRecipe: {
        type: Object,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        selectedList: null,
      };
    },
    methods: {
      async addRecipeToList() {
        if (!this.selectedList) {
          alert("Please select a list first.");
          return;
        }
  
        try {
          // Ensure the selected list exists in Firebase
          const userDocRef = doc(db, "users", this.userId);
          const userDoc = await getDoc(userDocRef);
  
          if (!userDoc.exists()) {
            alert("User data not found. Please ensure the user document is initialized.");
            return;
          }
  
          const userData = userDoc.data();
          const lists = userData.lists || [];
          const targetList = lists.find((list) => list.name === this.selectedList.name);
  
          if (!targetList) {
            alert("The selected list does not exist. Please refresh your data.");
            return;
          }
  
          // Add the recipe to the selected list
          targetList.items.push(this.selectedRecipe);
  
          // Update Firebase
          await updateDoc(userDocRef, { lists });
          this.$emit("update-lists", lists); // Notify parent to refresh data
          alert("Recipe added to the list successfully!");
          this.closeModal();
        } catch (error) {
          console.error("Error adding recipe to list:", error);
          alert("An error occurred while adding the recipe. Please try again.");
        }
      },
      closeModal() {
        this.$emit("close-modal");
      },
    },
  };
  </script>
  