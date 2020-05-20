import { mutations } from "../../src/store/mutations";

describe('mutations', () => {

  it('setBreeds', () => {
    const state = { breeds: [] };
    mutations.setBreeds(state, ["english bulldog", "cockapoo", "pitbull"]);
    expect(state.breeds).toHaveLength(3);
  });

  it('addDogToUserTeam', () => {
    const state = { user: {team: []} };
    const dog = {
      breedId: 1,
      breedName: "Pitbull",
      image: "pitbull1.jpg"
    }
    mutations.addDogToUserTeam(state, dog);
    expect(state.user.team).toHaveLength(1);
    expect(state.user.team[0]).toEqual(dog);
  });

});