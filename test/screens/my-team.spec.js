import Vuex from "vuex";
import { shallowMount, createLocalVue } from '@vue/test-utils';
import MyTeamScreen from '../../src/screens/my-team.vue';
import {createSandbox} from "sinon";

const localVue = createLocalVue();
localVue.use(Vuex);

let store = null;

const $toast = {
  success: () => {}
}

describe("my-team.vue", () => {
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
    store = new Vuex.Store({
      state
    });
  })

  afterEach(function() {
    sandbox.restore();
  });

  it("should load computed properties", async () => {
    const wrapper = await shallowMount(MyTeamScreen, {store, localVue, stubs: ['router-link'] });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.teamHasElements).toBeTruthy();
    expect(wrapper.vm.team).toEqual({
      "Pitbull": [{id:0, breedId:2, breedName:"Pitbull", image: "pitbull.jpg"}]
    });
  });

});
