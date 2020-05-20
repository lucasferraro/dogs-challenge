import {actions} from "../../src/store/actions";
import {createSandbox} from "sinon";

describe("actions", () => {
  const sandbox = createSandbox();

  it("fetchBreeds", async () => {
    const commit = sandbox.spy();
    const getBreeds = () => {
      return Promise.resolve({
        message: {
          "bulldog": [
            "english",
          ],
          "cockapoo": [],
          "pitbull": []
        }
      })
    };

    const vuexActions = actions({getBreeds});

    await vuexActions.fetchBreeds({ commit });

    expect(commit.args[0][0]).toEqual("setBreeds");
    expect(commit.args[0][1]).toEqual([
      {
        id: 0,
        name: "bulldog",
        subBreed: true,
        subBreedName: "english",
        nameDisplay: "English Bulldog",
        images: []
      },
      {
        id: 1,
        name: "cockapoo",
        subBreed: false,
        subBreedName: "",
        nameDisplay: "Cockapoo",
        images: []
      },
      {
        id: 2,
        name: "pitbull",
        subBreed: false,
        subBreedName: "",
        nameDisplay: "Pitbull",
        images: []
      }
    ]);
  });

  it("#addDogToUser should reject the new dog", async () => {
    const commit = sandbox.spy();
    const state = {
      user: {
        team: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}] // array of then elements
      }
    };
    const action = () => {
      return actions({}).addDogToUser({commit, state}, {});
    };
    await expect(action).rejects.toThrow(Error("CANNOT_ADD_MORE_DOGS"))
  });

  it("#addDogToUser should reject the breed", async () => {
    const commit = sandbox.spy();
    const state = {
      user: {
        team: [{breedId: 1}, {breedId: 1}, {breedId: 1}]
      }
    };
    const action = () => {
      return actions({}).addDogToUser({commit, state}, {breed: {id: 1}});
    };
    await expect(action).rejects.toThrow(Error("CANNOT_ADD_MORE_OF_THIS_BREED"))
  });

  it("#addDogToUser should add the dog", () => {
    const commit = sandbox.spy();
    const state = {
      user: {
        team: [{id: 0, breedId: 1}, {id: 1, breedId: 1}]
      }
    };
    actions({}).addDogToUser({commit, state}, {breed: {id: 2, nameDisplay: "Pitbull"}, dogImage: "pitbull.jpg"});
    expect(commit.args[0][0]).toEqual("addDogToUserTeam");
    expect(commit.args[0][1]).toEqual({
      id: 2,
      breedId: 2,
      breedName: "Pitbull",
      image: "pitbull.jpg"
    });
  });

  it("#removeDog should remove the dog", () => {
    const commit = sandbox.spy();
    const state = {
      user: {
        team: [{id: 0, breedId: 1}, {id: 1, breedId: 1}]
      }
    };
    actions({}).removeDog({commit, state}, 0);
    expect(commit.args[0][0]).toEqual("setTeam");
    expect(commit.args[0][1]).toEqual([{id: 1, breedId: 1}]);
  });

});
