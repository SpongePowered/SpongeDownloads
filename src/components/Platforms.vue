<template>
  <b-container class="platforms" v-once>
    <b-row v-if="hasFeaturedPlatforms">
      <b-col class="center">
        <h2 class="category">Sponge Server Downloads</h2>
      </b-col>
    </b-row>
    <b-row v-for="platform in featuredPlatforms" :key="platform.id" class="platform-row">
      <b-col>
        <platform-render :platform="platform"></platform-render>
      </b-col>
    </b-row>
    <b-row v-if="hasOtherPlatforms">
      <b-col class="center">
        <h2 class="category">Other Downloads</h2>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import {BContainer, BRow, BCol} from 'bootstrap-vue'

  import {Platforms} from '../platforms'
  import PlatformRender from './Platform.vue'

  export default {
    name: 'platforms',
    data() {
      return {
        platforms: Platforms
      }
    },
    computed: {
      featuredPlatforms() {
        return Object.fromEntries(Object.entries(this.platforms).filter(x => x[1].featured));
      },
      otherPlatforms() {
        return Object.fromEntries(Object.entries(this.platforms).filter(x => !x[1].featured));
      },
      hasFeaturedPlatforms() {
        return Object.keys(this.featuredPlatforms).length !== 0;
      },
      hasOtherPlatforms() {
        return Object.keys(this.otherPlatforms).length !== 0;
      }
    },
    components: {
      'b-container': BContainer,
      'b-row': BRow,
      'b-col': BCol,
      'platform-render': PlatformRender
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  h2.category {
    margin-bottom: 10px !important;
  }

  .platforms {

    margin-top: 20px;

   // text-align: center;
    font-size: 1.2rem;

    .platform-row {

      .platform-entry {
        cursor: pointer;
        background-color: $sponge_light_grey;

        &:hover {
          background-color: $sponge_lightish_grey;
        }
      }

      &:nth-child(odd) .platform-entry {
        background-color: $sponge_lighter_grey;

        &:hover {
          background-color: $sponge_lightish_grey;
        }
      }

    }

    h3 {
      font-size: 3rem;
    }

    .buttons {
      text-align: center;
      margin-bottom: 0.2em;
    }

    .recommendation {
      font-weight: bold;
      margin-top: 10px;
    }
  }
</style>
