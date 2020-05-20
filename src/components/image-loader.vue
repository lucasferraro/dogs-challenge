<template>
  <div>
    <div v-if="isLoading" class="text-center rounded mx-auto d-block img-thumbnail mt-2 mw-400">
      <spinner :show="isLoading" type="border" color="secondary"></spinner>
    </div>
    <img v-if="isLoaded" :src="img.src" width="400" class="img-fluid rounded mx-auto d-block img-thumbnail mt-2" alt="...">
  </div>
</template>
<script>
  import Spinner from "../components/spinner.vue";

  export default {
    props: {
      src: {
        type: String,
        required: true
      }
    },
    components: {
      Spinner
    },
    created() {
      this.status = "loading";
      this.img = new Image();
      this.img.onload = this.handleLoad;
      this.img.onerror = this.handleError;
      this.img.src = this.src;
    },
    computed: {
      isLoading() {
        return this.status === "loading";
      },
      isLoaded() {
        return this.status === "loaded";
      }
    },
    data() {
      return {
        status: null,
        img: null
      }
    },
    methods: {
      handleLoad() {
        this.status = "loaded";
      },
      handleError(error) {
        this.status = "failed";
      }
    }
  }
</script>

<style scoped>
  .mw-400 {
    max-width: 400px !important;
  }
</style>