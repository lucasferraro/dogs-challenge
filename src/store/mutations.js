export const mutations = {
  setBreeds(state, breeds) {
    state.breeds = breeds;
  },
  setSelectedBreed(state, breed) {
    state.selectedBreed = breed;
  },
  addDogToUserTeam(state, dog) {
    state.user.team.push(dog);
  },
  setTeam(state, team) {
    state.user.team = team;
  }
};