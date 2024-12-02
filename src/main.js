import '/src/assets/app.min.css';
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap/dist/js/bootstrap.bundle';
import '/src/scss/app.scss';

import { createApp } from 'vue';
import App from './App.vue';

import ListComponent from '@/components/ListComponent.vue';
import RecipeComponent from '@/components/RecipeComponent.vue';
import SettingsComponent from '@/components/SettingsComponent.vue';
import AppModal from '@/components/AppModal.vue';
import MainNav from '@/components/MainNav.vue';
import ViewListModal from '@/components/ViewListModal.vue';
import ViewRecipeModal from '@/components/ViewRecipeModal.vue';
import AddApiRecipe from '@/components/AddApiRecipe.vue';
import SeeApiRecipe from '@/components/SeeApiRecipe.vue';
import ListItem from '@/components/ListItem.vue';
import RecipeItem from '@/components/RecipeItem.vue';

const app = createApp(App);

app.component('list-component', ListComponent);
app.component('recipe-component', RecipeComponent);
app.component('settings-component', SettingsComponent);
app.component('app-modal', AppModal);
app.component('main-nav', MainNav);
app.component('view-list-modal', ViewListModal);
app.component('view-recipe-modal', ViewRecipeModal);
app.component('add-api-recipe', AddApiRecipe);
app.component('see-api-recipe', SeeApiRecipe);
app.component('list-item', ListItem);
app.component('recipe-item', RecipeItem);


app.mount('#app');
