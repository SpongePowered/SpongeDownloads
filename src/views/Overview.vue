<template>
  <main id="overview">
    <header>
      <b-container>
        <h1>Sponge</h1>
        <h2>Downloads</h2>
      </b-container>
    </header>

    <platforms/>
  </main>
</template>

<script>
  import {BContainer} from 'bootstrap-vue/esm/components/layout/container';
  import Platforms from '../components/Platforms.vue'

  export default {
    name: 'overview',
    components: {
      'b-container': BContainer,
      Platforms,
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  #overview {
    text-align: center;

    h1, h2 {
      margin: 0;
    }

    h1 {
      font-size: 5rem;
    }

    header {
      margin-bottom: 50px;
    }
  }
</style>
