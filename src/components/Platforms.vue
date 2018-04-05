<template>
  <b-container class="platforms" v-once>
    <b-row>
      <b-col v-for="platform in platforms" :key="platform.id">
        <h3><platform-logo :platform="platform"/></h3>
        <p class="description">{{ platform.description }}</p>
        <b-button variant="primary" :to="{name: 'downloads-project', params: {project: platform.id}}">
          <font-awesome-icon icon="download"/> Download
        </b-button>
        <p class="recommendation">{{ platform.recommendation }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import bContainer from 'bootstrap-vue/es/components/layout/container';
  import bRow from 'bootstrap-vue/es/components/layout/row';
  import bCol from 'bootstrap-vue/es/components/layout/col';
  import bButton from 'bootstrap-vue/es/components/button/button';

  import {Platforms} from '../platforms'
  import PlatformLogo from './PlatformLogo.vue'

  export default {
    name: 'platforms',
    data() {
      return {
        platforms: Platforms
      }
    },
    components: {
      bContainer, bRow, bCol, bButton,
      PlatformLogo,
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  .platforms {
    text-align: center;
    font-size: 1.2rem;

    h3 {
      font-size: 3rem;
    }

    .description {
      @include media-breakpoint-up(md) {
        height: 4.5em;
      }
    }

    .recommendation {
      font-weight: bold;
      margin-top: 10px;
    }
  }
</style>
