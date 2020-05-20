function capitalizeFirstChar(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function createBreed(id, name, subBreed=false, subBreedName="") {
  return {
    id,
    name,
    subBreed,
    subBreedName,
    nameDisplay: !subBreed ? capitalizeFirstChar(name) : `${capitalizeFirstChar(subBreedName)} ${capitalizeFirstChar(name)}`,
    images: []
  }
}

function parseBreeds(json) {
  let index = 0;
  return Object.keys(json)
    .map((masterBreed) => {
      if (!json[masterBreed].length) {
        return createBreed(index++, masterBreed);
      }
      return json[masterBreed].map((subBreed) => {
        return createBreed(index++, masterBreed, true, subBreed);
      })
    })
    .flat();
}

function userCanAddADog(user) {
  // user's team can have a maximum of 10 dogs
  return user.team.length < 10;
}

function userCanAddBreed(user, breed) {
  // user cannot have more than 3 dogs of the same breed
  const dogsOfBreed = user.team.filter((dog) => {
    return dog.breedId === breed.id;
  });
  return dogsOfBreed.length < 3;
}

function createDog({id, nameDisplay}, dogImage, teamSize) {
  return {
    id: teamSize,
    breedId: id,
    breedName: nameDisplay,
    image: dogImage
  }
}

export const actions = ({getBreeds, getBreed}) => {
  return {
    async fetchBreeds({commit}) {
      const result = await getBreeds();
      const breeds = parseBreeds(result.message);
      commit("setBreeds", breeds);
    },
    async selectBreed({commit, state}, id) {
      const breed = state.breeds.find((breed) => {
        return breed.id === Number(id);
      });
      if (!breed) {
        throw Error("NO_BREED");
      }
      const result = await getBreed(breed.name, breed.subBreedName);
      commit("setSelectedBreed", {...breed, images: result.message});
    },
    async addDogToUser({commit, state}, {breed, dogImage}) {
      const canAddDog = userCanAddADog(state.user);
      const canBeAdded = canAddDog && userCanAddBreed(state.user, breed);
      if (canBeAdded) {
        const dog = createDog(breed, dogImage, state.user.team.length);
        commit("addDogToUserTeam", dog);
      } else {
        const err = !canAddDog ? "CANNOT_ADD_MORE_DOGS" : "CANNOT_ADD_MORE_OF_THIS_BREED";
        throw Error(err);
      }
    },
    removeDog({commit, state}, id) {
      const newTeam = state.user.team.filter(dog => dog.id !== id);
      commit("setTeam", newTeam);
    }
  }
};
