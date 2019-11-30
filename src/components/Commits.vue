<template>
  <ol class="commits">
    <li class="commit" v-for="commit in commits" :key="commit.id">
      <a :href="'https://github.com/SpongePowered/' + project + '/commit/' + commit.id" target="_blank">{{ commit.title }}</a>
      <ellipsis-button v-if="commit.description || commit.submodules" v-b-toggle="`${commit.id}-collapse`"/>
      <div>{{ commit.author }} - <small><relative-time :t="commit.date"/></small></div>
      <b-collapse :id="`${commit.id}-collapse`" v-if="commit.description || commit.submodules">
        <pre class="commit-message" v-if="commit.description">{{ commit.description }}</pre>
        <div class="commit-submodules" v-if="commit.submodules">
          <div v-for="(subcommits, submodule) in commit.submodules" :key="submodule">
            <!-- TODO: Submodule commits should be NEVER null -->
            <template v-if="subcommits">
              <h5>{{ submodule }}</h5>
              <commits :project="submodule" :l="subcommits"></commits>
            </template>
          </div>
        </div>
      </b-collapse>
    </li>

    <li v-if="count < l.length" class="more-commits">
      <a tabindex="0" v-on:click="count *= 2">Show {{ l.length - count }} older commits.</a>
    </li>
  </ol>
</template>

<script>
  import {BCollapse, VBToggle} from 'bootstrap-vue'

  import EllipsisButton from './EllipsisButton'
  import RelativeTime from './relative-time'

  export default {
    name: 'commits',
    props: ['project', 'l'],
    data() {
      return {
        count: 5
      }
    },
    computed: {
      commits() {
        if (this.count >= this.l.length) {
          return this.l
        } else {
          return this.l.slice(0, this.count)
        }
      }
    },
    components: {
      'b-collapse': BCollapse,
      EllipsisButton,
      RelativeTime,
    },
    directives: {
      'b-toggle': VBToggle,
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  .changelog {
    clear: left;
    padding-left: 20px;

    // Use the same font size for recommended and other builds
    font-size: 1rem;

    @include media-breakpoint-down(md) {
      padding-left: 20px;
    }

    @media (max-width: 767px) {
      padding-left: 0;
      padding-top: 10px;
    }
  }

  .commits {
    list-style-type: none;
  }

  .commit {
    margin-bottom: 5px;

    & > a {
      color: $sponge_dark_grey;
      font-weight: bold;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  }

  .more-commits {
    cursor: pointer;
  }
</style>
