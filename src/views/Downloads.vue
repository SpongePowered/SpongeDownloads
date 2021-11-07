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
          <b-col class="download-category" v-if="platform.loaded">
            <h3>{{ platform.tags.minecraft.name }} version</h3>
            <b-button-group class="versions" :key="platform.tags.minecraft.name">
              <b-button variant="primary" class="active sponge">{{ platform.tags.minecraft.current }}</b-button>
              <b-dropdown variant="primary" right>
                <b-dropdown-item v-for="version of versions" :key="version" @click="platform.tags.minecraft.current=version; changeVersion()">
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
          <builds :platform="platform.name" :builds="recommended.builds" primary/>
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
          <builds :platform="platform.name" :builds="builds.builds"/>
        </div>

        <div id="no-builds" v-else-if="!recommended">
          <h3>No builds available for the current selection</h3>
        </div>

        <div class="navigation" v-if="builds">
          <b-button class="newer" v-if="offset > 0" size="sm" active-class="" @click="changePage(-10)">
            <font-awesome-icon icon="chevron-left"/> Newer
          </b-button>
          <b-button class="older" size="sm" active-class="" v-if="builds.size > 10 && builds.size - 10 > offset" @click="changePage(10)">
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

  import {Platforms, Labels} from '../platforms';
  import Builds from '../components/Builds.vue';
  import PlatformLogo from '../components/PlatformLogo.vue';

  import Sponsors from '../../sponsors.json';

  fontawesomeLibrary.add(faChevronLeft, faChevronRight);

  export default {
    name: 'downloads',
    data() {
      // Required to initialize properties properly
      return {
        loading: false,
        loadingRecommended: false,
        platform: null,
        displayTags: null,
        builds: null,
        recommended: null,
        offset: null,
        displayPreRelease: false
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
      },
      versions() {
        if (this.displayPreRelease) {
          return this.platform.tags.minecraft.versions;
        }
        return this.platform.tags.minecraft.versions.filter(x => !x.includes("-"));
      }
    },
    methods: {
      withBaseUrl(url) {
        return (process.env.BASE_URL || '/') + url;
      },
      updateData() {
        // guard against multiple requests.
        if (!this.loading) {
          this.platform = Platforms[this.$route.params.project];
          this.determineDisplayTags();

          this.builds = null;
          this.recommended = null;
          this.loading = true;
          this.loadingRecommended = true;
          this.offset = this.$route.query.offset || 0

          if (this.platform.loaded) {
            this.redirectToDefaultVersion();
          } else {
            this.fetchPlatform()
          }
        }
      },
      determineDisplayTags() {
        let t = {};
        Object.keys(this.platform.tags).filter(key => this.platform.tags[key].display).forEach(key => {
          t[key] = this.platform.tags[key];
          if (!t[key].hasOwnProperty("transform")) {
            t[key].transform = e => e;
          }
        });
        this.displayTags = t;
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
      fetchVersions(response, completeCallback, failureCallback) {
          const keys = Object.keys(response.data.artifacts);
          // For each key, we need to make an AJAX call...
          let futures = new Array(); // AxiosPromises
          keys.forEach(element => futures.push(axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions/${element}`)));
          const dt = this.displayTags;
          const platform = this.platform;

          const generateAssetsBlock = (tags, assets) => {
            let classifier;
            if ((platform.checkIsLegacy || (t => false))(tags)) {
              classifier = "legacyClassifier";
            } else {
              classifier = "classifier";
            }

            let toReturn = [];
            for (const asset of assets.filter(x => x.extension === "jar")) {
              const a = platform.artifactTypes.find(x => x[classifier] === asset.classifier);
              if (a !== undefined) {
                const res = { 
                  type: a,
                  asset: asset
                };
                if (a.primary) {
                  toReturn.unshift(res);
                } else {
                  toReturn.push(res);
                }
              }
            }
            return toReturn;
          }

          Promise.all(futures).then(r => {
            // My JS is terrible, but this should do...
            let result = {
              builds: {},
              size: response.data.size
            };
            r.forEach(r1 => {
              let value = {};
              value.recommended = r1.data.recommended;
              value.experimental = (platform.checkExperimental || (t => false))(r1.data.coordinates.version || "unknown")
              value.assets = generateAssetsBlock(r1.data.tags, r1.data.assets);
              value.displayTags = {};
              if (r1.data.tags !== undefined) {
                for (const key of Object.keys(r1.data.tags).filter(k => dt.hasOwnProperty(k))) {
                  value.displayTags[key] = {
                    name: dt[key].name || key,
                    text: dt[key].transform(r1.data.tags[key]),
                    color: dt[key].color || "success"
                  };
                }
              }
              result.builds[r1.data.coordinates.version] = value;
            });
            completeCallback(result);
          }, failureCallback)
      },
      changeVersion() {
        this.builds = null;
        this.recommended = null;
        this.loading = true;
        this.loadingRecommended = true;
        this.offset = 0;
        this.fetchBuilds();
      },
      changePage(offsetChange = 10) {
        this.builds = null;
        this.loading = true;
        this.fetchBuildsPage(offsetChange, parseInt(this.offset) + parseInt(offsetChange));
      },
      fetchBuilds() {
        const errorCallback = (error) => {
          if (error.response && error.response.status === 404) this.loadingRecommended = false;
          else console.log(`Error while fetching the latest recommended version for the platform ${this.platform.id} and tags ${this.buildAPITagsQuery()}`)
        };
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions?recommended=true&limit=1&tags=${this.buildAPITagsQuery()}`)
          .then(result => this.fetchVersions(result, this.updateBuilds, errorCallback), errorCallback);
        this.fetchBuildsPage();
      },
      updateBuilds(result) {
          this.recommended = result;
          this.loadingRecommended = false;
      },
      fetchBuildsPage(limit=10, offset=null) {
        if (offset == null) {
          offset = this.offset;
        }
        offset = Math.max(0, offset);
        const errorCallback = () => console.log(`Error while fetching the versions for the platform ${this.platform.id} and tags ${this.buildAPITagsQuery()}`);
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions?tags=${this.buildAPITagsQuery()}&offset=${offset}&limit=${limit}`)
          .then(result => this.fetchVersions(result, r => this.updateBuildsPage(r, offset), errorCallback), errorCallback);
      },
      updateBuildsPage(result, offset) {
        this.builds = result;
        this.offset = offset;
        this.updateRouter(this.platform.tags.minecraft.current);
        this.loading = false;
      },
      redirectToDefaultVersion() {
        if (this.platform.loaded) {
          let individual = false;

          let index = "minecraft";
          if (this.$route.query.hasOwnProperty(index)) {
            this.$set(this.platform.tags[index], 'current', this.$route.query[index]);
            individual = true;
          } else {
            this.$set(this.platform.tags[index], 'current', this.platform.latestRecommended.tags.minecraft);
            this.updateRouter(this.platform.latestRecommended.tags.minecraft);
          }

          this.fetchBuilds();
          return individual;
        }
      },
      updateRouter(value) {
        // don't push when we don't need to
        // The second parameter is written as such as the pushed parameter might be a number or a string...
        // 
        // We can't use || as a null coalesing operator because 0 means something
        // We can't use ?? as a null coalesing operator because it fails to compile (both node 14 and 16, which should support it...)
        let offsetParam = this.$route.query["offset"];
        if (offsetParam === undefined || offsetParam === null) {
          offsetParam = ""
        }
        let hasChanged = this.$route.query["minecraft"] !== value || offsetParam.toString() !== this.offset.toString() || this.$route.params["project"] !== this.platform.id;
        if (hasChanged) {
          this.$router.push({
            name: 'downloads',
            params: {project: this.platform.id},
            query: {minecraft: value, offset: this.offset}
          });
        }
      },
      buildAPITagsQuery() {
        let currentQuery = {};

        // We're just doing Minecraft version for this download page, no point mixing API/Forge/MC version
        let value = this.platform.tags.minecraft;
        if (value.current != null) {
          currentQuery["minecraft"] = value.current;
        }

        let modifier = Object.keys(this.platform.queryModifiers).find(x => value.current === x);
        if (modifier !== undefined) {
          this.platform.queryModifiers[modifier](currentQuery);
        }

        return this.stringifyQuery(currentQuery);
      },
      stringifyQuery(q) {
        return Object.keys(q).reduce((previous, key) => `${previous},${key}:${q[key]}`, "")
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

