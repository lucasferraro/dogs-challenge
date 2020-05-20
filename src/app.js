import Vue from 'vue';

import app from './app.vue';
import router from './router';
import store from "./store";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/custom.css';

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

Vue.use(VueToast, {
  position: "top-right"
});

new Vue({
  router,
  store,
  render: createElement => createElement(app)
}).$mount("#app")
