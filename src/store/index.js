import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import {state} from "./state";
import {mutations} from "./mutations";
import {actions} from "./actions";
import {getters} from "./getters";

import {getBreeds, getBreed} from "../services/api-service";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  state,
  actions: actions({getBreeds, getBreed}),
  mutations,
  getters,
  strict: debug,
  plugins: [createPersistedState()]
});