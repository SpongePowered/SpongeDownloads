<template>
  <main id="overview">
    <header>
      <b-container>
        <h1>Downloads</h1>
      </b-container>
    </header>

    <platforms/>
  </main>
</template>

<script>
  import bContainer from 'bootstrap-vue/es/components/layout/container';
  import Platforms from '../components/Platforms.vue'

  export default {
    name: 'overview',
    components: {
      bContainer,
      Platforms,
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  #overview {
    h1 {
      @include media-breakpoint-down(sm) {
        text-align: center;
        font-size: 10vw;
      }
    }

    header {
      margin-bottom: 50px;
    }
  }
</style>
