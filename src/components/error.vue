<template>
  <div v-if="error" class="text-light bg-danger d-sm-flex p-2 mb-2 mt-2 rounded h6">
    <div class="col-11">
      <span class="ml-3" v-html="errorMessage"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    error: {
      type: Boolean,
      required: true
    },
    errorMessage: {
      type: String,
      required: true
    }
  }
}
</script>