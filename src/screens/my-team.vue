<template>
  <div>
    <spinner :show="isLoading"></spinner>
    <div v-if="!isLoading" class="container">
      <div class="row mt-2 mb-2">
        <h5 class="col-md-8 col-sm-6"> My Team </h5>
        <div class="btn-group col-md-2 col-sm-6">
          <button class="btn btn-outline-info" @click.stop="$router.go(-1)">
            Back
          </button>
        </div>
        <div class="btn-group col-md-2 col-sm-6">
          <button class="btn btn-outline-danger" @click.stop="cleanTeam()">
            Clean team
          </button>
        </div>
      </div>
      <error :error="error" :error-message="errorMessage"></error>

      <div v-if="!error">
        <div v-if="!teamHasElements">
          <p class="text-danger">User's team has no dogs.</p>
        </div>
        <div v-for="(breedDogs, breed) in team" :key="breed" class="card border-info mb-2">
          <div class="card-header text-white bg-info">
            {{ breed }}
          </div>
          <div class="row ml-1 mr-1 mb-1">
            <div v-for="(dog, idx) in breedDogs" :key="idx" class="col-md-4 col-sm-6 container-image text-center">
              <span  v-html="dog.image"></span>
              <button @click="removeDog(dog.id)" type="button" class="btn btn-outline-danger btn-sm team-img">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Spinner from "../components/spinner.vue";
  import Error from "../components/error.vue";

  export default {
    components: {
      Spinner,
      Error
    },
    computed: {
      teamHasElements() {
        return !!this.$store.state.user.team.length;
      },
      team() {
        if (!this.teamHasElements) {
          return;
        }
        this.isLoading = true;
        const team =  this.$store.state.user.team.reduce((acc, obj) => {
          if (!Object.keys(acc).includes(obj.breedName)) {
            acc[obj.breedName] = [];
          }
          acc[obj.breedName].push(obj);
          return acc;
        }, {});
        this.isLoading = false;
        return team;
      }
    },
    data() {
      return {
        isLoading: false,
        error: false,
        errorMessage: ""
      }
    },
    methods: {
      cleanTeam() {
        if (this.teamHasElements) {
          this.$store.commit("setTeam", []);
          this.$toast.success("Team has ben cleaned successfully");
        } else {
          this.$toast.error("Team is already empty.")
        }
      },
      removeDog(dogId) {
        this.$store.dispatch("removeDog", dogId)
          .then(() => {
            this.$toast.success("Dog has ben removed successfully");
          })
      }
    }
  }
</script>

<style scoped>
  .container-image img {
    max-height: 300px;
  }

  .container-image .btn {
    top: 10%;
    right: 0%;
    background-color: #dc354557;
  }

  .container-image .btn:hover {
    background-color: #dc3545;
  }
</style>