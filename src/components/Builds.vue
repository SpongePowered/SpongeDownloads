<template>
  <!-- eslint-disable -->
  <ol class="builds">
    <li v-for="(build, key) in builds" :key="key" class="build" :id="key">

      <h4>{{ key }}
        <span class="build-labels">
          <build-label v-if="build.recommended" :color="recommendedLabel.color" :text="recommendedLabel.name"/>
          <build-label v-if="build.experimental" :color="experimentalLabel.color" :text="experimentalLabel.name"/>
          <build-label v-for="(value, name) in build.displayTags" :tagKey="value.name" :text="value.text" :color="value.color"/>
        </span>
      </h4>

      <div class="artifacts">
      <!-- artifacts -->
      <b-button v-for="artifact in build.assets" :key="artifact.type.legacyClassifier"
               :variant="artifact.type.primary ? 'primary' : ''" :size="btnSize"
               :href="artifact.asset.downloadUrl" :title="artifact.type.title">

          <font-awesome-icon :icon="artifact.type.icon"/>
          <span> {{ artifact.primary ? 'Download' : artifact.type.name }}</span></b-button>
      </div>
      <!-- artifacts -->

      <div class="clearfix"></div>
    </li>
  </ol>
</template>

<script>
  import {BButton} from 'bootstrap-vue';

  import {library as fontawesomeLibrary} from '@fortawesome/fontawesome-svg-core'
  import {faDownload} from '@fortawesome/free-solid-svg-icons'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

  import RelativeTime from './relative-time'
  import BuildLabel from './build-label'
  import Commits from './Commits.vue'
  import {Labels} from "../platforms";

  fontawesomeLibrary.add(faDownload);

  export default {
    name: 'builds',
    props: {
      platform: String,
      builds: Object,
      primary: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      btnSize() {
        return this.primary ? '' : 'sm'
      },
      recommendedLabel() {
        return Labels.recommended;
      },
      experimentalLabel() {
        return Labels.experimental;
      }
    },
    components: {
      'b-button': BButton,
      FontAwesomeIcon,
      RelativeTime,
      BuildLabel,
      Commits,
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  .builds {
    list-style-type: none;
    padding: 0;

    @include media-breakpoint-up(sm) {
      padding-left: 20px;
    }
  }

  .build {
    display: block;
    padding: 10px 20px;
    border-radius: 2px;

    h4 {
      font-size: 1.1em;
      float: left;
    }

    h5 {
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      font-size: 1em;
    }

    &:nth-child(even) {
      background: tint($sponge_grey, 98%);
    }
  }

  .build-labels {
    * {
      vertical-align: middle;

      // Keep some space between multiple build labels
      margin-left: 4px;

      // Reduce font size and add more padding instead
      font-size: 70%;
      padding-top: 0.3em;
      padding-bottom: 0.3em;
    }

    @include media-breakpoint-down(xs) {
      display: block;
      margin-top: 2px;
    }
  }

  .artifacts {
    float: right;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;

    .btn {
      margin-left: 2px;
    }

    @include media-breakpoint-down(sm) {
      float: left;
      clear: left;

      margin-top: 10px;
    }
  }

  .build-time {
    display: none;

    float: right;
    clear: right;

    @include montserrat;

    @include media-breakpoint-up(sm) {
      display: block;
    }
  }

</style>
