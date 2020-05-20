import Vuex from "vuex";
import { shallowMount, createLocalVue } from '@vue/test-utils';
import BreedsScreen from '../../src/screens/breeds.vue';
import {createSandbox} from "sinon";

import {state} from "../../src/store/state";
import {mutations} from "../../src/store/mutations";
import {actions} from "../../src/store/actions";
import {getters} from "../../src/store/getters";

const localVue = createLocalVue();
localVue.use(Vuex);

let store = null;

describe("breeds.integration", () => {
  const sandbox = createSandbox();
  const getBreeds = sandbox.stub().resolves({
    message: {
      "bulldog": [
        "english",
      ],
      "cockapoo": [],
      "pitbull": []
    }
  });
  const getBreed = sandbox.spy();

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      actions: actions({getBreeds, getBreed}),
      mutations,
      getters
    });
  })

  afterEach(() => {
    sandbox.restore();
  });

  it("should load breeds", async () => {
    const wrapper = await shallowMount(BreedsScreen, { store, localVue, stubs: ['router-link'] });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.breeds).toHaveLength(3);
  });

  it("should filter breeds when filter is at least 3 chars", async () => {
    const wrapper = await shallowMount(BreedsScreen, { store, localVue, stubs: ['router-link'] });

    await wrapper.vm.$nextTick();
    wrapper.vm.filter("bul");

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.breeds).toHaveLength(2);
  });

});
