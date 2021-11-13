<template>
  <div>
    <div class="commit-processing" v-if="l.processing">
      <em>Commit information may be incomplete - it is still being processed.</em>
    </div>
    <ol class="commits" v-if="containsCommits">
      <li class="commit" v-for="commit in commits" :key="commit.sha">
        <a :href="commit.link + '/commit/' + commit.sha" target="_blank">{{ commit.message }}</a>
        <ellipsis-button v-if="commit.body || commit.submodules" v-b-toggle="`${commit.sha}-collapse`"/>
        <div>{{ commit.author.name }} - <small><relative-time :t="commit.commitDate"/></small></div>
        <b-collapse :id="`${commit.sha}-collapse`" v-if="commit.body || commit.submodules">
          <pre class="commit-message" v-if="commit.body">{{ commit.body }}</pre>
          <!-- TODO: Subcommits
          <div class="commit-submodules" v-if="commit.submodules">
            <div v-for="(subcommits, submodule) in commit.submodules" :key="submodule">
              <! TODO: Submodule commits should be NEVER null >
              <template v-if="subcommits">
                <h5>{{ submodule }}</h5>
                <commits :project="submodule" :l="subcommits"></commits>
              </template>
            </div>
          </div>
          -->
        </b-collapse>
      </li>

      <li v-if="count < l.length" class="more-commits">
        <a tabindex="0" v-on:click="count *= 2">Show {{ l.length - count }} older commits.</a>
      </li>
    </ol>
    <div class="changelog-comment" v-else>
      <span>No commit information is available.</span>
    </div>
  </div>
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
      containsCommits() {
        return this.l.commits.length > 0;
      },
      commits() {
        if (this.count >= this.l.length) {
          return this.l.commits;
        } else {
          return this.l.commits.slice(0, this.count)
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
