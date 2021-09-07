<!-- eslint-disable -->
<template>
  <main id="downloads">
    <header>
      <b-container>
        <b-row align-h="center">
          <b-col sm="12" lg="4">
            <div class="logo">
              <h1><platform-logo :platform="platform"/></h1>
            </div>
          </b-col>
          <b-col class="download-category" v-if="platform.loaded" v-for="tag in platform.tags">
            <h3>{{ tag.name }} version</h3>
            <b-button-group id="versions">
              <b-button variant="primary" class="active">{{ tag.current }}</b-button>
              <b-dropdown variant="primary" right>
                <b-dropdown-item v-for="version of tag.versions" :key="version">
                  {{ version }}
                </b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </b-col>
          <!-- Empty column to avoid having platform logo centered -->
          <b-col v-else />
        </b-row>
      </b-container>
    </header>

    <section id="builds" v-if="builds">
      <div id="recommended-build" v-if="recommended">
        <b-container>
          <h3>Latest Recommended Build</h3>
          <builds :platform="platform.name" :builds="recommended.artifacts" primary/>
        </b-container>
      </div>

      <div id="sponsor">
        <b-container class="text-center">
          <a :href="sponsor.link">
            <picture>
              <source v-for="image in sponsor.images" v-bind:key="image.src" :media="image.media"
                      :srcset="withBaseUrl(image.src)">
              <img :src="withBaseUrl(sponsor.images[0].src)" :alt="sponsor.name" />
            </picture>
            <p v-if="sponsor.additionalText" class="additonalText">{{ sponsor.additionalText }}</p>
          </a>
        </b-container>
      </div>

      <b-container>
        <div id="all-builds" v-if="builds">
          <h3>All builds</h3>
          <builds :platform="platform.name" :builds="builds.artifacts"/>
        </div>

        <div id="no-builds" v-else-if="!recommended">
          <h3>No builds available for the current selection</h3>
        </div>

        <div class="navigation" v-if="builds">
          <b-button class="newer" v-if="$route.query.offset" size="sm" active-class="">
            <font-awesome-icon icon="chevron-left"/> Newer
          </b-button>
          <b-button class="older" size="sm" active-class="" v-if="builds.size > 10">
            Older <font-awesome-icon icon="chevron-right"/>
          </b-button>
          <div class="clearfix"></div>
        </div>
      </b-container>
    </section>

    <section id="download-loader" v-if="loading">
      <div class="container">
        <h2>Loading builds...</h2>
      </div>
    </section>
  </main>
</template>

<script>
/* eslint-disable */
  import {BContainer, BRow, BCol, BButton, BButtonGroup, BBadge, BDropdown, BDropdownItem, BImg} from 'bootstrap-vue'

  import {library as fontawesomeLibrary} from '@fortawesome/fontawesome-svg-core'
  import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

  import 'core-js/fn/set';
  import 'core-js/fn/array/from';
  import 'core-js/fn/array/find';
  import 'core-js/fn/array/includes';

  import axios from 'axios';

  import {Platforms, Labels} from '../platforms'
  import Builds from '../components/Builds.vue'
  import PlatformLogo from '../components/PlatformLogo.vue'

  import Sponsors from '../../sponsors.json'

  fontawesomeLibrary.add(faChevronLeft, faChevronRight);

  export default {
    name: 'downloads',
    data() {
      // Required to initialize properties properly
      return {
        loading: false,
        loadingRecommended: false,
        platform: null,
        builds: null,
        recommended: null,
      }
    },
    created() {
      this.updateData()
    },
    watch: {
      $route: {
        handler: 'updateData',
        deep: true,
        immediate: true
      }
    },
    computed: {
      sponsor() {
        return Sponsors[Math.floor(Math.random() * Sponsors.length)];
      }
    },
    methods: {
      withBaseUrl(url) {
        return (process.env.BASE_URL || '/') + url;
      },
      updateData() {
        this.platform = Platforms[this.$route.params.project];

        this.builds = null;
        this.recommended = null;
        this.loading = true;
        this.loadingRecommended = true;

        if (this.platform.loaded) {
          this.redirectToDefaultVersion();
          this.fetchBuilds()
        } else {
          this.fetchPlatform()
        }
      },
      fetchPlatform() {
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}`).then(response => {
          const tags = response.data.tags || [];

          axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/latest?recommended=true`).then(response => {
            const recommended = response.data;

            for (const [index, tag] of Object.entries(this.platform.tags)) {
              tag.versions = tags[index];
            }

            this.$set(this.platform, 'latestRecommended', recommended);
            this.$set(this.platform, 'loaded', true);

            this.redirectToDefaultVersion()
          }, () => console.log(`Error while fetching the latest recommended version for the platform ${this.platform.id}`))
        }, () => console.log(`Error while fetching the platform ${this.platform.id}`))
      },
      fetchBuilds() {
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions?recommended=true&limit=1&tags=${this.buildAPITagsQuery()}`).then(response => {
          this.recommended = response.data;
          this.loadingRecommended = false;
        }, (error) => {
          if (error.response && error.response.status === 404) this.loadingRecommended = false;
          else console.log(`Error while fetching the latest recommended version for the platform ${this.platform.id} and tags ${this.buildAPITagsQuery()}`)
        })

        this.fetchBuildsPage();
      },
      fetchBuildsPage(limit=10, offset=0) {
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions?tags=${this.buildAPITagsQuery()}&offset=${offset}&limit=${limit}`).then(response => {
          this.builds = response.data;
          this.loading = false;
        }, () => console.log(`Error while fetching the versions for the platform ${this.platform.id} and tags ${this.buildAPITagsQuery()}`))
      },
      redirectToDefaultVersion() {
        if (this.platform.loaded) {
          let individual = false;

          for (const [index,] of Object.entries(this.platform.tags)) {
            if (this.$route.query.hasOwnProperty(index)) {
              this.$set(this.platform.tags[index], 'current', this.$route.query[index]);
              individual = true;
            }
          }

          if(individual) {
            this.fetchBuilds();
            return false;
          }

          this.$router.push({
            name: 'downloads',
            params: {project: this.platform.id},
            query: this.platform.latestRecommended.tags
          });
          return true
        }
      },
      buildAPITagsQuery() {
        let currentQuery = "";

        for (const [index,value] of Object.entries(this.platform.tags)) {
          if (value.current != null) {
           currentQuery += index + ":" + value.current + ",";
          }
        }

        return currentQuery;
      }
    },
    components: {
      'b-container': BContainer,
      'b-row': BRow,
      'b-col': BCol,
      'b-button': BButton,
      'b-button-group': BButtonGroup,
      'b-badge': BBadge,
      'b-dropdown': BDropdown,
      'b-dropdown-item': BDropdownItem,
      'b-img': BImg,
      FontAwesomeIcon,
      PlatformLogo,
      Builds,
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  #downloads {
    h1 {
      text-align: center;
    }

    h3 {
      font-size: 1.5rem;
    }
  }

  #download-loader {
    margin-top: 50px;

    @include media-breakpoint-down(sm) {
      text-align: center;
    }
  }

  #builds .container {
    padding-top: 30px;
    padding-bottom: 10px;
  }

  .download-category {
    margin-top: 20px;
    text-align: center;

    // TODO: Remove build types
    ul {
      list-style-type: none;
      padding: 0;

      line-height: 1.3;

      @include montserrat;
      font-size: 1.3rem;

      .badge {
        font-size: 70%;
        padding-top: 0.3em;
        padding-bottom: 0.3em;

        &.active span {
          border-bottom: 1px solid white;
        }
      }
    }

    .dropdown-menu {
      margin-top: -1px;
      min-width: 0;

      .active {
        font-weight: bold;
      }
    }
  }

  #versions {
    .btn.active {
      color: black;
      background-color: $sponge_yellow;

      &:hover {
        background-color: tint($sponge_yellow, 50%);
      }
    }
  }

  #recommended-build {
    font-size: 1.2rem;
    background: tint($sponge_grey, 95%);
  }

  #no-builds h3 {
    margin-bottom: 30px;
  }

  .navigation {
    margin-bottom: 20px;

    .newer {
      float: left;
      margin-left: 30px;
    }

    .older {
      float: right;
      margin-right: 10px;
    }
  }
</style>
