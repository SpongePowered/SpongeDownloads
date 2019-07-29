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
          <b-col class="download-category" v-if="platform.buildTypes">
            <h3>Build type</h3>
            <ul id="build-types">
              <li v-for="type in platform.buildTypes" :key="type.id">
                <b-badge :variant="type.color" :to="routeForBuildType(type)">
                  <span>{{ type.name }}</span></b-badge>
              </li>
            </ul>
          </b-col>
          <b-col class="download-category" v-if="platform.category.versions">
            <h3>{{ platform.category.name }} version</h3>
            <b-button-group id="versions">
              <b-button variant="primary"
                     v-for="version of platform.category.versions.current" :key="version"
                     :to="routeForCategory(version)">{{ version }}</b-button>
              <b-dropdown variant="primary" right v-if="platform.category.versions.unsupported.length > 0">
                <b-dropdown-item v-for="version of platform.category.versions.unsupported" :key="version"
                                 :to="routeForCategory(version)">{{ version }}</b-dropdown-item>
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
          <h3>{{ recommended.label.title }}</h3>
          <builds :platform="platform.name" :builds="[recommended]" primary/>
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
          </a>
        </b-container>
      </div>

      <b-container>
        <div id="all-builds" v-if="builds.length > 0">
          <h3>All builds</h3>
          <builds :platform="platform.name" :builds="builds"/>
        </div>

        <div id="no-builds" v-else-if="!recommended">
          <h3>No builds available for the current selection</h3>
          <strong>Possible solutions:</strong>
          <ul>
            <li v-for="type in getAlternativeBuildTypes()" :key="type.id">
              <router-link :to="adaptRouteForBuildType(type)"
              >Search for <span :class="['label', 'label-' + type.color]">{{ type.name }}</span> builds.
              </router-link>
            </li>
            <li v-if="$route.query.until">
              <router-link :to="{query: {since: $route.query.until}}"
              >Search for newer builds.
              </router-link>
            </li>
            <li v-if="$route.query.since">
              <router-link :to="{query: {until: $route.query.since}}"
              >Search for older builds.
              </router-link>
            </li>
          </ul>
        </div>

        <div class="navigation" v-if="builds.length > 0">
          <b-button class="newer" size="sm" active-class=""
                 v-if="$route.query.until || $route.query.since" :to="{query: {since: builds[0].published}}">
            <font-awesome-icon icon="chevron-left"/> Newer
          </b-button>
          <b-button class="older" size="sm" active-class=""
                 v-if="builds.length >= 9" :to="{query: {until: builds[builds.length-1].published}}">
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
  import bContainer from 'bootstrap-vue/es/components/layout/container';
  import bRow from 'bootstrap-vue/es/components/layout/row';
  import bCol from 'bootstrap-vue/es/components/layout/col';
  import bButton from 'bootstrap-vue/es/components/button/button';
  import bButtonGroup from 'bootstrap-vue/es/components/button-group/button-group';
  import bBadge from 'bootstrap-vue/es/components/badge/badge';
  import bDropdown from 'bootstrap-vue/es/components/dropdown/dropdown';
  import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item';
  import bImg from 'bootstrap-vue/es/components/image/img'

  import {library as fontawesomeLibrary} from '@fortawesome/fontawesome-svg-core'
  import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

  import 'core-js/fn/set';
  import 'core-js/fn/array/from';
  import 'core-js/fn/array/find';
  import 'core-js/fn/array/includes';

  import axios from 'axios';

  import {Platforms, BuildTypes, Labels} from '../platforms'
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
        recommended: null
      }
    },
    created() {
      this.updateData()
    },
    watch: {
      $route: 'updateData'
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

        // Redirect to default build type and category if not explicitly specified
        if (this.redirectToDefaultVersion()) {
          return
        }

        this.builds = null;
        this.recommended = null;
        this.loading = true;
        this.loadingRecommended = false;

        if (this.platform.loaded) {
          this.fetchBuilds()
        } else {
          this.fetchPlatform()
        }
      },
      fetchPlatform() {
        axios.get(`/${this.platform.group}/${this.platform.id}`).then(response => {
          const project = response.data;

          const buildTypes = [], buildTypesData = {};

          const currentCategoryVersions = new Set(this.platform.category.forProject(project));
          const unsupportedCategoryVersions = new Set(currentCategoryVersions);

          for (const type of BuildTypes) {
            if (!(type.id in project.buildTypes)) {
              continue
            }

            buildTypes.push(type);

            const data = project.buildTypes[type.id];
            const buildTypeData = {
              type: type,
            };

            if (data.recommended) {
              buildTypeData.recommended = {}
            }

            buildTypesData[type.id] = buildTypeData;

            const category = this.platform.category.forBuild(data.latest);
            if (category) {
              buildTypeData.categoryVersion = category;
              unsupportedCategoryVersions.delete(category);
            }
          }

          const unsupportedCategoryVersionsArray = Array.from(unsupportedCategoryVersions);

          for (const version of unsupportedCategoryVersionsArray) {
            currentCategoryVersions.delete(version)
          }

          this.platform.buildTypes = buildTypes;

          // Vue does not support iterating over sets currently, https://github.com/vuejs/vue/issues/2410
          this.platform.category.versions = {
            current: Array.from(currentCategoryVersions),
            unsupported: unsupportedCategoryVersionsArray
          };

          this.platform.buildTypesData = buildTypesData;
          this.platform.loaded = true;

          if (!this.redirectToDefaultVersion()) {
            this.fetchBuilds()
          }
        }, () => console.log("ERROR"))
      },
      fetchBuilds() {
        const params = {
          type: this.$route.params.buildType,
        };

        params[this.platform.category.id] = this.$route.params.category;

        const buildTypeData = this.platform.buildTypesData[this.$route.params.buildType];

        // Load recommended build (if necessary)
        const showRecommended = !this.$route.query.until && !this.$route.query.since;
        if (showRecommended && buildTypeData.recommended) {
          const recommendedBuild = buildTypeData.recommended[this.$route.params.category];

          if (recommendedBuild == null) {
            this.loadingRecommended = true;
            axios.get(`/${this.platform.group}/${this.platform.id}/downloads/recommended`, {params: params}).then(response => {
              const recommendedBuild = response.data;

              recommendedBuild.label = Labels.recommended;
              recommendedBuild.labels = [buildTypeData.type, Labels.recommended];
              this.platform.addLabels && this.platform.addLabels(recommendedBuild);
              this.readArtifacts(recommendedBuild);

              buildTypeData.recommended[this.$route.params.category] = recommendedBuild;
              this.recommended = recommendedBuild;
              this.loadingRecommended = false;
            }, response => {
              if (response.status == 404) {
                // No recommended build available
                buildTypeData.recommended[this.$route.params.category] = false;
                this.loadingRecommended = false;
                this.markLatestBuild(this.builds)
              }

              console.log("ERROR")
            })
          } else if (recommendedBuild) {
            this.recommended = recommendedBuild
          }
        }

        params.changelog = true;
        params.until = this.$route.query.until;
        params.since = this.$route.query.since;

        axios.get(`/${this.platform.group}/${this.platform.id}/downloads`, {params: params}).then(response => {
          const unsupported = this.platform.category.versions.unsupported.includes(this.$route.params.category)
              && Labels.unsupported;

          const builds = response.data;
          for (const build of builds) {
            build.labels = [buildTypeData.type];

            if (unsupported) {
              build.labels.push(unsupported)
            } else if (build.label) {
              if (build.label in Labels) {
                build.labels.push(Labels[build.label])
              } else {
                console.log(`Unknown label: ${build.label}`)
              }
            }

            this.platform.addLabels && this.platform.addLabels(build);
            this.readArtifacts(build)
          }

          if (showRecommended) {
            this.markLatestBuild(builds)
          }

          this.loading = false;
          this.builds = builds
        }, () => console.log("ERROR"))
      },
      readArtifacts(build) {
        const artifacts = [];

        let first = true;
        for (const type of this.platform.artifactTypes) {
          if (type.classifier in build.artifacts) {
            const artifact = build.artifacts[type.classifier];
            artifact.type = type;
            artifact.primary = first;
            artifacts.push(artifact)
          }

          first = false
        }

        build.artifacts = artifacts
      },
      markLatestBuild(builds) {
        if (this.loadingRecommended || this.recommended || !builds || builds.length == 0) {
          return
        }

        if (builds[0].label) {
          // Don't mark builds with a label
          return
        }

        const latestBuild = builds.shift();

        latestBuild.label = Labels.latest;
        latestBuild.labels.push(Labels.latest);

        this.recommended = latestBuild;
      },
      routeForBuildType(buildType) {
        return {
          name: 'downloads-build-type', params: {
            project: this.platform.id,
            buildType: buildType.id
          }
        }
      },
      adaptRouteForBuildType(buildType) {
        return {
          name: 'downloads', params: {
            project: this.platform.id,
            buildType: buildType.id,
            category: this.$route.params.category
          }, query: this.$route.query
        }
      },
      routeForCategory(category) {
        return {
          name: 'downloads', params: {
            project: this.platform.id,
            buildType: this.$route.params.buildType,
            category: category
          }
        }
      },
      redirectToDefaultVersion() {
        if (this.platform.loaded && (!this.$route.params.buildType || !this.$route.params.category)) {
          const buildType = this.$route.params.buildType || this.platform.buildTypes[0].id;
          this.$router.replace({
            name: 'downloads', params: {
              project: this.platform.id,
              buildType: buildType,
              category: this.$route.params.category || this.platform.buildTypesData[buildType].categoryVersion
            }
          });
          return true
        } else {
          return false
        }
      },
      getAlternativeBuildTypes() {
        return this.platform.buildTypes.filter(type => type.id != this.$route.params.buildType);
      }
    },
    components: {
      bContainer, bRow, bCol, bButton, bButtonGroup, bBadge, bDropdown, bDropdownItem, bImg,
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
