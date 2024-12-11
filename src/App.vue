<template>
  <div id="app">
    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <main-nav :tabs="tabs" :active-tab="activeTab" @tab-change="switchTab"></main-nav>
      <h1>Loading...</h1>
      <div class="skeleton-loader">
        <div class="skeleton skeleton-header"></div>
        <div class="skeleton skeleton-paragraph"></div>
        <div class="skeleton skeleton-paragraph"></div>
      </div>
      <footer class="text-center py-3 mt-5" id="footer">
        <p class="mb-0">&copy; 2024 Pantry Pal - Manage Your Recipes and Lists</p>
      </footer>
    </div>

    <!-- Welcome Screen -->
    <div v-else-if="!authUser || !authUser.id" class="text-center my-5">
      <h1>Welcome to Pantry Pal!</h1>
      <p>Please log in to access your recipes and grocery lists.</p>
      <button class="btn btn-primary" @click="login">Login with Google</button>
    </div>

    <!-- Main App Content -->
    <div v-else>
      <!-- Main Navigation -->
      <main-nav :tabs="tabs" :active-tab="activeTab" @tab-change="switchTab"></main-nav>

      <!-- Content Container -->
      <div class="container mt-4">
        <!-- Lists Tab -->
        <list-component v-if="activeTab === 'lists'" :lists="lists" @add-list="addList" @delete-list="deleteList"
          @view-list="viewList">
        </list-component>
        <p v-if="activeTab === 'lists' && lists.length === 0" class="text-center text-muted">
          No lists created. Start by adding your first list!
        </p>

        <!-- Recipes Tab -->
        <recipe-component v-if="activeTab === 'recipes'" :recipes="recipes" :lists="lists" :user-id="authUser?.id"
          :apiKey="apiKey" @add-recipe="addRecipe" @refresh-data="fetchUserData">
        </recipe-component>
        <p v-if="activeTab === 'recipes' && recipes.length === 0" class="text-center text-muted">
          No recipes added. Start by creating your first recipe!
        </p>

        <!-- Settings Tab -->
        <settings-component v-if="activeTab === 'settings'" :login="login" :logout="logout" :auth-user="authUser">
        </settings-component>
      </div>

      <!-- Footer -->
      <footer class="text-center py-3 mt-5" id="footer">
        <p class="mb-0">&copy;Pantry Pal 2024</p>
      </footer>
    </div>
  </div>
</template>

<script>
import MainNav from "@/components/MainNav.vue";
import ListComponent from "@/components/ListComponent.vue";
import RecipeComponent from "@/components/RecipeComponent.vue";
import SettingsComponent from "@/components/SettingsComponent.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/models/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default {
  components: {
    MainNav,
    ListComponent,
    RecipeComponent,
    SettingsComponent,
  },
  data() {
    return {
      authUser: null,
      recipes: [],
      lists: [],
      apiKey: "1220a6ebd1cf4ccf9c6bd451a882b6ea", // API key for Spoonacular
      loading: true,
      activeTab: "lists",
      tabs: [
        { id: "lists", label: "Lists" },
        { id: "recipes", label: "Recipes" },
        { id: "settings", label: "Settings" },
      ],
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.authUser = {
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
        };
        this.fetchUserData();
      } else {
        this.authUser = null;
        this.recipes = [];
        this.lists = [];
        this.loading = false;
      }
    });
  },
  methods: {
    login() {
      // Implement login logic (e.g., Google Auth)
    },
    logout() {
      // Implement logout logic
    },
    async fetchUserData() {
      if (!this.authUser?.id) return;

      const userDocRef = doc(db, "users", this.authUser.id);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        this.recipes = data.recipes || [];
        this.lists = data.lists || [];
      } else {
        await setDoc(userDocRef, { recipes: [], lists: [] });
        this.recipes = [];
        this.lists = [];
      }
      this.loading = false;
    },
    switchTab(tabId) {
      this.activeTab = tabId;
    },
    addList(newList) {
      this.lists.push(newList);
    },
    deleteList(index) {
      this.lists.splice(index, 1);
    },
    addRecipe(newRecipe) {
      this.recipes.push(newRecipe);
    },
    viewList(list) {
      console.log("Viewing list: ", list); // Adjust as per your requirement
    },
  },
};
</script>

<style scoped>
#footer {
  background-color: var(--bs-secondary);
}

.skeleton-loader {
  margin: 20px auto;
  width: 60%;
}

.skeleton {
  background-color: #e0e0e0;
  height: 20px;
  margin-bottom: 15px;
  border-radius: 5px;
  animation: pulse 1.5s infinite;
}

.skeleton-header {
  height: 30px;
  width: 50%;
}

.skeleton-paragraph {
  height: 20px;
  width: 100%;
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }

  50% {
    background-color: #f0f0f0;
  }

  100% {
    background-color: #e0e0e0;
  }
}
</style>
