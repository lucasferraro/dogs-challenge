import Vue from 'vue';
import VueRouter from 'vue-router';

import BreedsScreen from './screens/breeds.vue';
import BreedPageScreen from './screens/breed-page.vue';
import MyTeamScreen from './screens/my-team.vue';

Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/",
    component: BreedsScreen
  },
  {
    name: "breed-page",
    path: "/breed/:id",
    component: BreedPageScreen
  },
  {
    name: "my-team",
    path: "/myteam",
    component: MyTeamScreen
  },

  // otherwise redirect to home
  { path: '*', redirect: '/' }
];

const router = new VueRouter({
  routes
});

export default router;
