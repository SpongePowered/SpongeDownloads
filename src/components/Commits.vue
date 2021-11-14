<template>
  <div class="changelog" :class="{ 'commit-processing': processing }">
    <div class="processing" v-if="processing">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <span v-if="containsCommits">
        We're still generating the changelog for this build, the following may be incomplete.
      </span>
      <span v-else>
        We're still generating the changelog for this build.
      </span>
    </div> 
<!--      <i class="pad-icon bi bi-info-circle"></i>Commit information may be incomplete - it is still being processed. -->
    <ol class="commits" v-if="containsCommits">
      <li class="commit" v-for="commit in commits" :key="commit.commit.sha">
        <a :href="commit.commit.link" target="_blank">{{ commit.commit.message }}</a>
        <ellipsis-button v-if="commit.commit.body || commit.submodules" v-b-toggle="`${commit.commit.sha}-collapse`"/>
        <div>{{ commit.commit.author.name }} - <small><relative-time :t="commit.commit.commitDate"/></small></div>
        <b-collapse :id="`${commit.commit.sha}-collapse`" v-if="commit.commit.body || commit.submodules">
          <pre class="commit-message" v-if="commit.commit.body">{{ commit.commit.body }}</pre>
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
        <a tabindex="0" v-on:click="count *= 2">Show {{ l.commits.length - count }} older commits.</a>
      </li>
    </ol> 
    <div class="changelog-comment" v-else-if="!processing">
      <span>No changelog is available for this build.</span>
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
      processing() {
        return this.l.processing;
      },
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

  .pad-icon {
    margin-right: 5px;
  }

  .commit-processing {
    border-left: solid 3px $commit-processing-color;
  }

  .processing {
    color: $secondary; 

    > i.bi {
      color: $commit-processing-color;
      margin-right: 5px;
    }
  }
</style>
