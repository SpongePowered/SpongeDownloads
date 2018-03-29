<template>
  <ol class="builds">
    <li v-for="build in builds" :key="build.version" class="build" :id="build.version">
      <h4>{{ build.version }}
        <build-label v-for="label in build.labels" :key="label.name" :l="label"></build-label>
      </h4>

      <div class="artifacts">
        <a v-for="artifact in build.artifacts" :key="artifact.classifier"
           :href="artifact.url" :title="artifact.type.title"
           :class="['btn', btnClass, artifact.primary ? 'btn-primary' : 'btn-default']">
          <i :class="['fa', artifact.type.icon]"></i>
          <span>{{ artifact.primary ? 'Download' : artifact.type.name }}</span></a>
      </div>

      <relative-time class="build-time" :t="build.published"></relative-time>

      <div class="changelog" v-if="!primary || build.changelog">
        <commits :project="platform" :l="build.changelog"
                 v-if="build.changelog && build.changelog.length > 0"></commits>
        <div class="changelog-comment" v-else>
          <span v-if="build.changelog">No changes.</span>
          <span v-else>No changelog available.</span>
        </div>
      </div>

      <div class="clearfix"></div>
    </li>
  </ol>
</template>

<script>
  import RelativeTime from './relative-time'
  import BuildLabel from './build-label'
  import Commits from './Commits.vue'

  export default {
    name: 'builds',
    props: {
      platform: String,
      builds: Array,
      primary: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      btnClass() {
        return this.primary ? 'btn' : 'btn-sm'
      }
    },
    components: {
      'relative-time': RelativeTime,
      'build-label': BuildLabel,
      commits: Commits
    }
  }
</script>
