<template>
  <div v-if="show" class="text-center">
    <div :class="classes" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      },
      type: {
        type: String,
        default: "grow"
      },
      color: {
        type: String,
        default: "info"
      }
    },
    computed: {
      classes() {
        const type = `spinner-${this.type}`;
        const color = `text-${this.color}`;
        return `${type} ${color}`
      }
    }
  }
</script>