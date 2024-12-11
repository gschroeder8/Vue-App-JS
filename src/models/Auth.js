import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, authProvider, db } from "@/models/firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import GroceryList from "@/models/GroceryList.js";
import ManualRecipe from "@/models/ManualRecipe.js";
import APIRecipe from "@/models/APIRecipe.js";
import FoodItem from "@/models/FoodItem.js";

export default class Auth {
  static _instance;
  user = null;
  lists = [];
  recipes = [];

  constructor() {
    if (!Auth._instance) {
      Auth._instance = this;
      this._startSession();
    }
    return Auth._instance;
  }

  login() {
    return signInWithPopup(auth, authProvider)
      .then((result) => {
        this.user = {
          id: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
        };
        console.log("User logged in:", this.user);
        this._initializeUserData();
        this._syncUserData();
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  }

  async logout() {
    try {
      await signOut(auth);
      this.authUser = null; // Clear the user from the app state
      this.lists = []; // Reset any user-specific data
      this.recipes = [];
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  _startSession() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        this.user = {
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        };
        console.log("Session started for:", this.user);
        this._initializeUserData();
        this._syncUserData();
      } else {
        console.log("No user signed in.");
        this.user = null;
      }
    });
  }

  _initializeUserData() {
    if (!this.user) return;

    const userDocRef = doc(db, "users", this.user.id);
    getDoc(userDocRef).then((docSnapshot) => {
      if (!docSnapshot.exists()) {
        console.log("Initializing new user document.");
        setDoc(userDocRef, { lists: [], recipes: [] })
          .then(() => console.log("User document initialized."))
          .catch((error) => console.error("Failed to initialize user document:", error));
      }
    });
  }

  _syncUserData() {
    if (!this.user) return;

    const userDocRef = doc(db, "users", this.user.id);

    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          this.lists = data.lists.map(
            (list) =>
              new GroceryList(
                list.name,
                list.items.map((item) => new FoodItem(item.name, item.category))
              )
          );
          this.recipes = data.recipes.map((recipe) =>
            recipe.isFromApi
              ? new APIRecipe(
                  recipe.name,
                  recipe.ingredients.map((ingredient) => new FoodItem(ingredient.name, ingredient.category)),
                  recipe.instructions,
                  recipe.apiId
                )
              : new ManualRecipe(
                  recipe.name,
                  recipe.ingredients.map((ingredient) => new FoodItem(ingredient.name, ingredient.category)),
                  recipe.instructions
                )
          );
          console.log("User data synced:", data);
        } else {
          console.log("No user data found.");
          this.lists = [];
          this.recipes = [];
        }
      })
      .catch((error) => {
        console.error("Failed to sync user data:", error);
      });
  }

  saveData() {
    if (!this.user) return;

    const userDocRef = doc(db, "users", this.user.id);
    const userData = {
      lists: this.lists.map((list) => ({
        name: list.name,
        items: list.items.map((item) => ({
          name: item.name,
          category: item.category,
        })),
      })),
      recipes: this.recipes.map((recipe) => recipe.toObject()),
    };

    setDoc(userDocRef, userData, { merge: true })
      .then(() => console.log("User data saved successfully."))
      .catch((error) => {
        console.error("Failed to save user data:", error);
      });
  }

  addList(newList) {
    this.lists.push(newList);
    this.saveData();
  }

  deleteList(index) {
    this.lists.splice(index, 1);
    this.saveData();
  }

  addRecipe(newRecipe) {
    this.recipes.push(newRecipe);
    this.saveData();
  }

  deleteRecipe(index) {
    this.recipes.splice(index, 1);
    this.saveData();
  }
}
