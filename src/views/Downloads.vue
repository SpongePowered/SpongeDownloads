<!-- eslint-disable -->
<template>
  <main id="downloads">
    <section class="breadcrumb">
      <b-container>
          <b-row>
              <b-col>
                <div class="inline">
                    <platform-logo :platform="platform"/>
                </div>
                <div class="download-category" v-if="minecraftTag && !errored">
                    <h3>for {{ platform.tags.minecraft.name }} version</h3>
                    <b-button-group class="versions " :key="platform.tags.minecraft.name">
                      <b-button variant="primary" class="active sponge"><h3>{{ platform.tags.minecraft.current }}</h3></b-button>
                      <b-dropdown variant="primary" right :popper-opts="{ 
                          modifiers: {
                            flip: { enabled: false }, 
                            preventOverflow: { enabled: false } 
                          }
                        }">
                        <b-dropdown-item v-for="version of versions" :key="version" @click="platform.tags.minecraft.current=version; changeVersion()">
                          {{ version }}
                        </b-dropdown-item>
                      </b-dropdown>
                    </b-button-group>
                </div>
              </b-col>
          </b-row>
      </b-container>
    </section>

    <section id="download-loader" v-if="init || loading">
      <div class="container">
        <h2>Loading builds...</h2>
      </div>
    </section>

    <section id="builds" v-if="errored">
      <b-container>
        <div class="alert alert-danger">
          <h3>Oh no! An error occurred while loading this page!</h3>
          <p>We're sorry, but we seem to be having trouble getting the requested download links for you. Please try again in a few minutes, <a @click="updateData()" class="link">which you can do by clicking here.</a></p>
          <p>If this error persists, please let us know <a href="https://discord.gg/sponge">in our Discord channels</a> so that we can investigate further.</p>
          <hr>
          <p><small><em>Reported error: {{ errorMessage }}</em></small></p>
        </div>
      </b-container>
    </section>
    <section id="builds" v-else-if="builds">
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
          <b-pagination-nav
            v-model="currentPage"
            :number-of-pages="pages"
            :link-gen="generatePaginationLink"
            first-number
            last-number
            use-router
          >
              <template #prev-text><font-awesome-icon icon="chevron-left"/> Newer</template>
              <template #next-text>Older <font-awesome-icon icon="chevron-right"/></template>
          </b-pagination-nav>
        </div>
      </b-container>
    </section>
  </main>
</template>

<script>
/* eslint-disable */
  import {BContainer, BRow, BCol, BButton, BButtonGroup, BBadge, BDropdown, BDropdownItem, BImg, BPaginationNav} from 'bootstrap-vue'

  import {library as fontawesomeLibrary} from '@fortawesome/fontawesome-svg-core'
  import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

  import 'core-js/features/set';
  import 'core-js/features/array/from';
  import 'core-js/features/array/find';
  import 'core-js/features/array/includes';

  import axios from 'axios';

  import {Platforms} from '../platforms';
  import Builds from '../components/Builds.vue';
  import PlatformLogo from '../components/PlatformLogo.vue';

  import Sponsors from '../../sponsors.json';

  fontawesomeLibrary.add(faChevronLeft, faChevronRight);

  export default {
    name: 'downloads',
    data() {

      // Required to initialize properties properly
      return {
        init: true,
        cancelSource: axios.CancelToken.source(),
        loading: false,
        loadingRecommended: false,
        platform: Platforms[this.$route.params.project],
        displayTags: null,
        builds: null,
        recommended: null,
        displayPreRelease: this.$root.showPreReleaseMC,
        offset: null,
        errorMessage: null
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
        if (this.platform.tags.minecraft.versions === undefined) {
          return [];
        }
        if (this.displayPreRelease) {
          return this.platform.tags.minecraft.versions;
        }
        return this.platform.tags.minecraft.versions.filter(x => !x.includes("-"));
      },
      errored() {
        return this.errorMessage !== null;
      },
      minecraftTag() {
        return this.platform?.tags?.minecraft !== undefined;
      },
      currentPage() {
        const offset = this.offset || 0;
        return ((offset - (offset % 10)) / 10) + 1;
      },
      pages() {
        return (parseInt(this.builds.size) - parseInt(this.builds.size % 10)) / 10 + 1;
      }
    },
    methods: {
      withBaseUrl(url) {
        return (process.env.BASE_URL || '/') + url;
      },
      updateData() {
        // guard against multiple requests.
        if (!this.loading) {
          this.displayPreRelease = this.$root.showPreReleaseMC;
          this.errorMessage = null;
          this.platform = Platforms[this.$route.params.project];
          this.determineDisplayTags();

          this.builds = null;
          this.recommended = null;
          this.loading = true;
          this.init = false;
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
        if (this.errored) {
          return;
        }
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}`, {
          cancelToken: this.cancelSource.token
        }).then(response => {
          const tags = response.data.tags || [];

          axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/latest?recommended=true`, {
            cancelToken: this.cancelSource.token
          }).then(response => {
            const recommended = response.data;
            this.$set(this.platform, 'latestRecommended', recommended);
          }, (error) => {
            if (error.response && error.response.status === 404) {
              this.loadingRecommended = false;
            }
            else {
              this.teeError(`Error while fetching the latest recommended version for the platform ${this.platform.id}`);
            }
          }).finally(() => {
            for (const [index, tag] of Object.entries(this.platform.tags)) {
              tag.versions = (tag.sort || (i => i))(tags[index]); // sorts the tags if the platform demands it.
            }

            this.$set(this.platform, 'loaded', true);
            this.redirectToDefaultVersion()
          })
        }, () => this.teeError(`Error while fetching the platform ${this.platform.id}`))
      },
      teeError(error) {
        console.error(error);
        if (this.errorMessage === null) {
          this.errorMessage = error;
          this.cancelSource.cancel("Cancelling requests due to an error");
          this.cancelSource = axios.CancelToken.source();
          this.loading = false;
          this.loadingRecommended = false;
        }
      },
      fetchVersions(response, completeCallback, failureCallback) {
          if (this.errored) {
            return;
          }
          const keys = Object.keys(response.data.artifacts);
          // For each key, we need to make an AJAX call...
          let futures = new Array(); // AxiosPromises
          keys.forEach(element => 
            futures.push(axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions/${element}`, {
              cancelToken: this.cancelSource.token
            })));

          const dt = this.displayTags;
          const platform = this.platform;
          const processCommits = (commits) => {
            if (commits === undefined) {
              return [];
            }
            return commits.map(commit => {
              let commitObject = Object.assign({}, commit.commit);
              const headline = commitObject.message.trim();
              const body = commitObject.body.trim();
              if (headline === "") {
                return null;
              }
              if (body === headline) {
                delete commitObject.body; // we don't need to duplicate this.
              } else if (body.startsWith(headline)) {
                commitObject.body = body.substring(headline.length).trim(); // we don't want to duplicate the message
              }
              return {
                commit: commitObject,
                submoduleCommits: commit.submoduleCommits
              }
            }).filter(x => x !== null);
          };

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
              if (r1.data.commit) {
                value.changelog = {
                  processing: r1.data.commit.processing,
                  commits: processCommits(r1.data.commit.commits)
                }
              } else {
                value.changelog = {
                  processing: false,
                  commits:  []
                }
              }
              result.builds[r1.data.coordinates.version] = value;
            });
            completeCallback(result);
          }, failureCallback)
      },
      changeVersion() {
        this.errorMessage = null;
        this.builds = null;
        this.recommended = null;
        this.loading = true;
        this.loadingRecommended = true;
        this.offset = 0;
        this.fetchBuilds();
      },
      changePageAbs(offset = 0, limit = 10) {
        this.builds = null;
        this.loading = true;
        this.fetchBuildsPage(limit, offset);
      },
      changePage(offsetChange = 10) {
        this.builds = null;
        this.loading = true;
        this.fetchBuildsPage(offsetChange, parseInt(this.offset) + parseInt(offsetChange));
      },
      fetchBuilds() {
        const errorCallback = (error) => {
          if (error.response && error.response.status === 404) {
            this.loadingRecommended = false;
          } else {
            this.teeError(`Error while fetching the latest recommended version for the platform ${this.platform.id} and tags ${this.buildAPITagsQuery()}`);
          } 
        };
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions?recommended=true&limit=1&tags=${this.buildAPITagsQuery()}`, {
          cancelToken: this.cancelSource.token
        }).then(result => this.fetchVersions(result, this.updateBuilds, errorCallback), errorCallback);
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
        const errorCallback = () => this.teeError(`Error while fetching the versions for the platform ${this.platform.id} and tags ${this.buildAPITagsQuery()}`);
        axios.get(`/groups/${this.platform.group}/artifacts/${this.platform.id}/versions?tags=${this.buildAPITagsQuery()}&offset=${offset}&limit=${limit}`, {
          cancelToken: this.cancelSource.token
        })
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
            if (this.platform.latestRecommended) {
              this.$set(this.platform.tags[index], 'current', this.platform.latestRecommended.tags.minecraft);
              this.updateRouter(this.platform.latestRecommended.tags.minecraft);
            } else {
              this.$set(this.platform.tags[index], 'current', this.versions[0]);
              this.updateRouter(this.versions[0]);
            }
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
          offsetParam = "0"
        }
        let hasChanged = (this.$route.query["minecraft"] || this.platform.latestRecommended?.tags?.minecraft) !== value || 
          ((offsetParam.toString() || "0") !== (this.offset.toString() || "0")) || this.$route.params["project"] !== this.platform.id;
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

        if (this.$root.filterMCVersionsThatDontMatchExpectedAPI) {
          let modifier = Object.keys(this.platform.queryModifiers).find(x => value.current === x);
          if (modifier !== undefined) {
            this.platform.queryModifiers[modifier](currentQuery);
          }
        }

        return this.stringifyQuery(currentQuery);
      },
      stringifyQuery(q) {
        return Object.keys(q).reduce((previous, key) => `${previous},${key}:${q[key]}`, "")
      },
      generatePaginationLink(pageNum) {
        if (pageNum === 1 && this.$route.query.offset === undefined) {
          return this.$route.query; // so that page 1 remains active in the pagination.
        }
        const offset = (pageNum - 1) * 10;
        return {
          query: { ...this.$route.query, offset }
        }
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
      'b-pagination-nav': BPaginationNav,
      FontAwesomeIcon,
      PlatformLogo,
      Builds,
    },
    directives: {
      visible: function(el, binding) {
        if (binding.value) {
          el.style.visibility = "visible";
        } else {
          el.style.visibility = "hidden";
        }
      }
    }
  }
</script>

