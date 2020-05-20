import Vuex from "vuex";
import { shallowMount, createLocalVue } from '@vue/test-utils';
import BreedsScreen from '../../src/screens/breeds.vue';
import {createSandbox} from "sinon";
import assert from "assert";

const localVue = createLocalVue();
localVue.use(Vuex);

let store = null;

describe("breeds.vue", () => {
  const sandbox = createSandbox();

  beforeEach(function() {
    const state = {
      breeds: [
        {
          id: 0,
          name: "bulldog",
          subBreed: true,
          subBreedName: "english",
          nameDisplay: "English Bulldog"
        },
        {
          id: 1,
          name: "cockapoo",
          subBreed: false,
          subBreedName: "",
          nameDisplay: "Cockapoo"
        },
        {
          id: 2,
          name: "pitbull",
          subBreed: false,
          subBreedName: "",
          nameDisplay: "Pitbull"
        }
      ]
    };
    const actions = {
      fetchBreeds: () => Promise.resolve()
    };
    store = new Vuex.Store({
      state,
      actions
    });
  })

  afterEach(function() {
    sandbox.restore();
  });

  it("should call 'filter' method when input value changed fires watcher", async () => {
    const wrapper = shallowMount(BreedsScreen, {store, localVue, stubs: ['router-link'] });

    const filterInput = wrapper.find('input[type="text"]');
    filterInput.setValue("b");

    const filterSpy = sandbox.spy(wrapper.vm, "filter");

    await wrapper.vm.$nextTick();
    assert(filterSpy.calledOnce);
  });

  it("should not filter breeds when filter is less than 3 chars", async () => {
    const wrapper = shallowMount(BreedsScreen, {store, localVue, stubs: ['router-link'] })

    wrapper.vm.filter("bu");

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.breeds).toHaveLength(store.state.breeds.length);
  });

  it("should filter breeds when filter is at least 3 chars", async () => {
    const wrapper = shallowMount(BreedsScreen, { store, localVue, stubs: ['router-link'] });

    wrapper.vm.filter("bul");

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.breeds).toHaveLength(2);
  });

  it("if state does not have breeds created hook should call loadBreeds method", () => {
    store.state.breeds = [];
    const loadBreedsSpy = sandbox.spy(BreedsScreen.methods, "loadBreeds");
    shallowMount(BreedsScreen, { store, localVue, stubs: ['router-link'] });
    assert(loadBreedsSpy.calledOnce);
  });

  it("if state has breeds created hook should not call loadBreeds method", () => {
    const loadBreedsSpy = sandbox.spy(BreedsScreen.methods, "loadBreeds");
    shallowMount(BreedsScreen, { store, localVue, stubs: ['router-link'] });
    assert(loadBreedsSpy.notCalled);
  });

});
