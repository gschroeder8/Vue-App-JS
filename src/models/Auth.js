import { auth, authProvider, signInWithPopup, db } from "@/models/firebase";
import GroceryList from "@/models/GroceryList";
import Recipe from "@/models/Recipe";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default class Auth {
  constructor() {
    this.user = null;
    this.lists = [];
    this.recipes = [];
  }

  async login() {
    try {
      const result = await signInWithPopup(auth, authProvider);
      this.user = result.user;
      await this._startSession();
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  async logout() {
    try {
      await auth.signOut();
      this.user = null;
      this.lists = [];
      this.recipes = [];
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async _startSession() {
    if (!this.user) return;

    const userDoc = doc(db, "users", this.user.uid);
    const docSnap = await getDoc(userDoc);

    if (!docSnap.exists()) {
      await setDoc(userDoc, { lists: [], recipes: [] });
    } else {
      const data = docSnap.data();
      this.lists = data.lists.map((list) => GroceryList.fromObject(list));
      this.recipes = data.recipes.map((recipe) => Recipe.fromObject(recipe));
    }
  }

  async saveData(key, data) {
    const userDoc = doc(db, "users", this.user.uid);
    const payload = { [key]: data.map((item) => item.toObject()) };
    await updateDoc(userDoc, payload);
  }

  addList(list) {
    this.lists.push(list);
    this.saveData("lists", this.lists);
  }

  addRecipe(recipe) {
    this.recipes.push(recipe);
    this.saveData("recipes", this.recipes);
  }

  deleteList(index) {
    this.lists.splice(index, 1);
    this.saveData("lists", this.lists);
  }

  deleteRecipe(index) {
    this.recipes.splice(index, 1);
    this.saveData("recipes", this.recipes);
  }
}
