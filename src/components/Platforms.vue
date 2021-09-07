<template>
  <b-container class="platforms" v-once>
    <b-row>
      <b-col v-for="platform in platforms" :key="platform.id">
        <h3><platform-logo :platform="platform"/></h3>
        <p class="description">{{ platform.description }}</p>
        <b-button variant="primary" :to="{name: 'downloads', params: {project: platform.id}}">
          <font-awesome-icon icon="download"/> Download
        </b-button>
        <p class="recommendation">{{ platform.recommendation }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import {BContainer, BRow, BCol, BButton} from 'bootstrap-vue'

  import {library as fontawesomeLibrary} from '@fortawesome/fontawesome-svg-core'
  import {faDownload} from '@fortawesome/free-solid-svg-icons'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

  import {Platforms} from '../platforms'
  import PlatformLogo from './PlatformLogo.vue'

  fontawesomeLibrary.add(faDownload);

  export default {
    name: 'platforms',
    data() {
      return {
        platforms: Platforms
      }
    },
    components: {
      'b-container': BContainer,
      'b-row': BRow,
      'b-col': BCol,
      'b-button': BButton,
      FontAwesomeIcon,
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
