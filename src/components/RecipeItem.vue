<template>
  <div class="list-group-item d-flex justify-content-between">
    <span>{{ recipe.name }}</span>
    <div>
      <button class="btn btn-link" @click="viewRecipe">See Recipe</button>
      <button class="btn btn-link" @click="addRecipeToList">Add to List</button>
      <button class="btn btn-link" @click="deleteRecipe">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeItem',
  props: {
    recipe: Object,
    index: Number
  },
  methods: {
    viewRecipe() {
      this.$emit('view-recipe', this.recipe);
    },
    addRecipeToList() {
      this.$emit('add-recipe-to-list', this.recipe);
    },
    deleteRecipe() {
      this.$emit('delete-recipe', this.index);
    }
  }
};
</script>

<style scoped>
</style>
