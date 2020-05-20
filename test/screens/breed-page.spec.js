import Vuex from "vuex";
import { shallowMount, createLocalVue } from '@vue/test-utils';
import BreedPageScreen from '../../src/screens/breed-page.vue';
import {createSandbox} from "sinon";
import assert from "assert";

const localVue = createLocalVue();
localVue.use(Vuex);

const $route = {
  params: {id: 0}
};

let store = null;

describe("breed-page.vue", () => {
  const sandbox = createSandbox();

  beforeEach(function() {
    const state = {
      selectedBreed: {
        id: 0,
        name: "bulldog",
        subBreed: true,
        subBreedName: "english",
        nameDisplay: "English Bulldog",
        images: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", 
          "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg"]
      }
    };
    const actions = {
      selectBreed: () => Promise.resolve()
    };
    store = new Vuex.Store({
      state,
      actions
    });
  })

  afterEach(function() {
    sandbox.restore();
  });

  it("created hook should load breed and call loadImages", async () => {
    const loadImagesSpy = sandbox.spy(BreedPageScreen.methods, "loadImages");
    const wrapper = await shallowMount(BreedPageScreen, { store, localVue, stubs: ['router-link'], mocks: {$route} });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.breed).toEqual(store.state.selectedBreed);
    assert(loadImagesSpy.calledOnce);
  });

  it("should show no breed error message when breed is not found", async () => {
    const actions = {
      selectBreed: () => Promise.reject(new Error("NO_BREED"))
    };
    const newStore = new Vuex.Store({
      actions
    });
    const wrapper = await shallowMount(BreedPageScreen, { store: newStore, localVue, stubs: ['router-link'], mocks: {$route} });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.errorMessage).toEqual("Breed not found");
    expect(wrapper.vm.$data.error).toBeTruthy();
  });

  it("should show generic error message when unknown error happens", async () => {
    const actions = {
      selectBreed: () => Promise.reject(new Error("unknown error"))
    };
    const newStore = new Vuex.Store({
      actions
    });
    const wrapper = await shallowMount(BreedPageScreen, { store: newStore, localVue, stubs: ['router-link'], mocks: {$route} });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.errorMessage).toEqual("There has been an error. Try later.");
    expect(wrapper.vm.$data.error).toBeTruthy();
  });

  it("#loadImages should call loadAsyncImages for first 5 images", async () => {
    const loadAsyncImagesSpy = sandbox.spy(BreedPageScreen.methods, "loadAsyncImages");
    const wrapper = await shallowMount(BreedPageScreen, { store, localVue, stubs: ['router-link'], mocks: {$route} });
    await wrapper.vm.$nextTick();
    const images = wrapper.vm.$data.breed.images.slice(0, 5);
    assert(loadAsyncImagesSpy.calledOnce);
    assert(loadAsyncImagesSpy.calledWith(images));
  });

  it("#loadImages should call loadAsyncImages for next 5 images", async () => {
    const loadAsyncImagesSpy = sandbox.spy(BreedPageScreen.methods, "loadAsyncImages");
    const wrapper = await shallowMount(BreedPageScreen, { store, localVue, stubs: ['router-link'], mocks: {$route} });
    wrapper.vm.$data.images = wrapper.vm.$store.state.selectedBreed.images.slice(0, 5);
    await wrapper.vm.$nextTick();
    const nextImages = wrapper.vm.$store.state.selectedBreed.images.slice(5, 10);
    assert(loadAsyncImagesSpy.calledOnce);
    assert(loadAsyncImagesSpy.calledWith(nextImages));
  });

  it("#loadImages should call loadAsyncImages last images (less than offset)", async () => {
    const loadAsyncImagesSpy = sandbox.spy(BreedPageScreen.methods, "loadAsyncImages");
    const wrapper = await shallowMount(BreedPageScreen, { store, localVue, stubs: ['router-link'], mocks: {$route} });
    wrapper.vm.$data.images = wrapper.vm.$store.state.selectedBreed.images.slice(0, 10);
    await wrapper.vm.$nextTick();
    const nextImages = wrapper.vm.$store.state.selectedBreed.images.slice(10, 13);
    assert(loadAsyncImagesSpy.calledOnce);
    assert(loadAsyncImagesSpy.calledWith(nextImages));
  });

  it("#loadImages should not call loadAsyncImages when all images were already loaded", async () => {
    const loadAsyncImagesSpy = sandbox.spy(BreedPageScreen.methods, "loadAsyncImages");
    const wrapper = await shallowMount(BreedPageScreen, { store, localVue, stubs: ['router-link'], mocks: {$route} });
    wrapper.vm.$data.images = store.state.selectedBreed.images;
    await wrapper.vm.$nextTick();
    assert(loadAsyncImagesSpy.notCalled);
  });

  it("#loadAsyncImages should concat new images to breed", async () => {
    const fakeImages = ["img","img","img","img","img"]
    sandbox.stub(BreedPageScreen.methods, "loadImages").callsFake(() => {
      return Promise.resolve();
    })
    sandbox.stub(BreedPageScreen.methods, "loadImage").callsFake(() => {
      return Promise.resolve("img");
    })
    const wrapper = await shallowMount(BreedPageScreen, { store, localVue, stubs: ['router-link'], mocks: {$route} });
    await wrapper.vm.$nextTick();
    const images = wrapper.vm.$data.breed.images.slice(0, 5);
    await wrapper.vm.loadAsyncImages(images);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.images).toEqual(fakeImages);
  });

});
