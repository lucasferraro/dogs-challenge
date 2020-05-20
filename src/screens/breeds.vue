<template>
  <div class="container">
    <h5>Dogs breeds</h5>

    <spinner :show="isLoading"></spinner>
    
    <div v-if="!isLoading">
      <form @submit.prevent="filter">
        <div class="form-group">
          <input v-model="breedFilter" type="text" class="form-control" placeholder="Filter by breed...">
          <small class="form-text text-muted font-italic ml-1">Enter at least 3 characters to start filtering</small>
        </div>
      </form>
      <br>
      <table v-if="!isLoading" class="table table-hover">
        <thead>
          <tr>
            <th>Breed</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(breed, idx) in breeds" :key="idx">
            <td>
              <router-link class="col-12 text-left btn" :to="{name: 'breed-page', params: {id: breed.id}}" >
                <span>{{ breed.nameDisplay }}</span>
              </router-link>
            </td>
          </tr>
          <tr v-if="!breeds.length">
            <td colspan="2">There are not results to show</td>
          </tr>
        </tbody>
      </table>
      <button v-if="showScrollToTopButton" class="btn btn-warning mt-2 mb-2 back-top-btn" @click.stop="scrollToTop()">Back to top</button>
    </div>
  </div>
</template>

<script>
  import Spinner from "../components/spinner.vue";

  export default {
    components: {
      Spinner
    },
    created() {
      window.onscroll = () => {
        this.showScrollToTopButton = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
      };
      if (this.$store.state.breeds.length) {
        this.breeds = this.$store.state.breeds;
        return;
      }
      return this.loadBreeds()
    },
    data() {
      return {
        isLoading: false,
        breeds: [],
        breedFilter: "",
        showScrollToTopButton: false,
      }
    },
    methods: {
      scrollToTop() {
        document.documentElement.scrollTop = 0;
      },
      loadBreeds() {
        this.isLoading = true;
        return this.$store.dispatch("fetchBreeds")
          .then(() => {
            this.isLoading = false;
            this.breeds = this.$store.state.breeds;
          })
          .catch((err) => {
            console.error(err);
            this.isLoading = false;
          });
      },
      filter(breedFilter) {
        if (breedFilter.length >= 3) {
          const expression = new RegExp(breedFilter, "i");
          this.breeds = this.$store.state.breeds.filter((breed) => {
            return expression.test(breed.nameDisplay);
          })
        } else {
          this.breeds = this.$store.state.breeds;
        }
      }
    },
    watch: {
      breedFilter(newBreed) {
        this.filter(newBreed);
      }
    }
  }
</script>
