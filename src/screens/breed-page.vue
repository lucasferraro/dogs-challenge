<template>
  <div>
    <spinner :show="isLoading"></spinner>
    <div v-if="!isLoading" class="container" >
      <error :error="error" :error-message="errorMessage"></error>
      <button v-if="error" class="col-2 btn btn-outline-danger btn-sm" @click.stop="$router.go(-1)">
        Back to list
      </button>

      <div v-if="!error">
        <div class="row mt-2">
          <h5 class="col-md-10 col-sm-6">{{ breed.nameDisplay }}</h5>
          <button class="col-md-2 col-sm-6 btn btn-outline-info" @click.stop="$router.go(-1)">
            Back to list
          </button>
        </div>
        <div v-for="(image, idx) in images" :key="idx" class="container-image text-center">
          <span  v-html="image"></span>
          <button @click="addDog(breed, image)" type="button" class="btn btn-outline-success btn-sm breed-img">Add to team</button>
        </div>
        <spinner :show="loadingMoreImages" color="warning" class="mt-2 mb-2"></spinner>
        <button v-if="showScrollToTopButton" class="btn btn-warning mt-2 mb-2 back-top-btn" @click.stop="scrollToTop()">Back to top</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Error from "../components/error.vue";
  import Spinner from "../components/spinner.vue";
  import ImageLoader from "../components/image-loader.vue";

  const offset = 5;

  export default {
    components: {
      Error,
      Spinner,
      ImageLoader
    },
    created() {
      return this.loadBreed()
        .then(() => {
          this.handleScroll();
        });
    },
    data() {
      return {
        isLoading: false,
        loadingMoreImages: false,
        showScrollToTopButton: false,
        breed: null,
        error: false,
        errorMessage: "",
        images: []
      }
    },
    methods: {
      handleScroll() {
        window.onscroll = () => {
          if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            this.showScrollToTopButton = true;
          } else {
            this.showScrollToTopButton = false;
          }
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
          if (bottomOfWindow) {
            this.loadingMoreImages = true;
            this.showScrollToTopButton = true;
            return this.loadImages()
              .then(() => {
                this.loadingMoreImages = false;
              });
          }
        };
      },
      scrollToTop() {
        document.documentElement.scrollTop = 0;
      },
      addDog(breed, dogImage) {
        this.$store.dispatch("addDogToUser", {breed, dogImage})
          .then(() => {
            this.$toast.success(`A new dog of ${breed.nameDisplay} was added.`);
          })
          .catch((err) => {
            const messages = {
              "CANNOT_ADD_MORE_DOGS": "Can not add more dogs.",
              "CANNOT_ADD_MORE_OF_THIS_BREED": `Can not add more dogs of breed ${breed.nameDisplay}`
            };
            const message = messages[err.message] || "An error occurs adding the dog."
            this.$toast.error(message);
          })
      },
      loadBreed() {
        this.isLoading = true;
        return this.$store.dispatch("selectBreed", this.$route.params.id)
          .then(() => {
            this.breed = this.$store.state.selectedBreed;
            return this.loadImages();
          })
          .catch((err) => {
            this.isLoading = false;
            if (err.message === "NO_BREED") {
              this.errorMessage = "Breed not found";
            } else {
              this.errorMessage = "There has been an error. Try later.";
            }
            this.error = true;
          })
      },
      loadImages() {
        const currentSize = this.images.length;
        let nextOffset = currentSize + offset;
        if (currentSize === this.breed.images.length) {
          return Promise.resolve();
        }
        if (nextOffset >= this.breed.images.length) {
          nextOffset = this.breed.images.length;
        }
        const newImages = this.breed.images.slice(currentSize, nextOffset);
        return this.loadAsyncImages(newImages);
      },
      loadAsyncImages(images) {
        const promises = images.map((image) => {
          return this.loadImage(image);
        });
        return Promise.all(promises)
          .then((allImages) => {
            this.images = this.images.concat(allImages);
            this.isLoading = false;
          })
          .catch((err) => {
            this.isLoading = false;
            this.errorMessage = "There has been an error. Try later.";
            this.error = true;
          })
      },
      loadImage(srcToLoad) {
        return new Promise((resolve, reject) => {
          let img = new Image();
          img.onload = () => {
            img.width = "400";
            img.classList.add("img-fluid", "rounded", "mx-auto", "d-block", "img-thumbnail", "mt-2", "breed-img");
            resolve(img.outerHTML);
          }
          img.onerror = reject;
          img.src = srcToLoad;
        })
      }
    }
  }
</script>

<style scoped>
  .container-image .btn {
    bottom: 0%;
    right: 29%;
    background-color: #28a74530;
  }

  .container-image .btn:hover {
    background-color: #28a745;
  }
</style>