import Vuex from "vuex";
import { shallowMount, createLocalVue } from '@vue/test-utils';
import MyTeamScreen from '../../src/screens/my-team.vue';
import {createSandbox} from "sinon";
import {mutations} from '../../src/store/mutations';
import {actions} from '../../src/store/actions';

const localVue = createLocalVue();
localVue.use(Vuex);

let store = null;

const $toast = {
  success: () => {}
}

describe("my-team.integration", () => {
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
        },
        {
          id: 3,
          name: "bulldog",
          subBreed: true,
          subBreedName: "boston",
          nameDisplay: "Bnglish Bulldog"
        }
      ],
      user: {
        team: [
          {
            id: 0,
            breedId: 2,
            breedName: "Pitbull",
            image: "pitbull.jpg"
          }
        ]
      }
    };
    const testActions = actions({});
    store = new Vuex.Store({
      state,
      actions: testActions,
      mutations
    });
  })

  afterEach(function() {
    sandbox.restore();
  });

  it("should clean team", async () => {
    const wrapper = await shallowMount(MyTeamScreen, {store, localVue, stubs: ['router-link'], mocks: {$toast} });
    await wrapper.vm.$nextTick();

    wrapper.vm.cleanTeam();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.teamHasElements).toBeFalsy();
    expect(wrapper.vm.$store.state.user.team).toEqual([]);
  });

  it("should remove a dog", async () => {
    const wrapper = await shallowMount(MyTeamScreen, {store, localVue, stubs: ['router-link'], mocks: {$toast} });
    await wrapper.vm.$nextTick();

    wrapper.vm.removeDog(0);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.teamHasElements).toBeFalsy();
    expect(wrapper.vm.$store.state.user.team).toEqual([]);
  });

});
