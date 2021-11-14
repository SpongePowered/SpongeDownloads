<template>
  <b-container class="platforms" v-once>
    <b-row v-for="platform in featuredPlatforms" :key="platform.id" class="platform-row">
      <b-col>
        <b-container class="platform-entry" @click="switchToDownloadPage(platform.id)">
          <b-row>
            <b-col>
              <h3><platform-logo :platform="platform"/></h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="float-right buttons">
               <!-- <b-button variant="info" :to="{name: 'downloads', params: {project: platform.id}}">
                  <font-awesome-icon icon="download"/> Download Latest Recommended Build <br/>
                  <small>Version: version</small>
                </b-button>
                &nbsp; -->
                <b-button variant="secondary" :to="{name: 'downloads', params: {project: platform.id}}">
                  <font-awesome-icon icon="download"/> View Builds
                </b-button>
              </div>
              <p class="description">{{ platform.description }}</p>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-row v-if="hasOtherPlatforms">
      <b-col class="center">
        <h2>Other Dowonloads</h2>
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
    methods: {
      switchToDownloadPage(id) {
        this.$router.push({name: 'downloads', params: {project: id}});
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
