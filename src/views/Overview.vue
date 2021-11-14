<template>
  <main id="overview">
    <platforms/>
  </main>
</template>

<script>
  import Platforms from '../components/Platforms.vue'

  export default {
    name: 'overview',
    components: {
      Platforms,
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  #overview {
    text-align: left;

    h1, h2 {
      margin: 0;
    }

    h1 {
      font-size: 5rem;
    }
  }
</style>
