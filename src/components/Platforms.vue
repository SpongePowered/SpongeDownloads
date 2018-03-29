<template>
  <div class="container" v-once>
    <div class="row">
      <div class="col-sm-4 platform" v-for="platform in platforms" :key="platform.id">
        <h3><span>Sponge<span :class="['platform-badge', platform.id]">{{ platform.suffix }}</span></span></h3>
        <p class="description">{{ platform.description }}</p>
        <router-link class="btn btn-primary styled-btn"
                     :to="{name: 'downloads-project', params: {project: platform.id}}">
          <i class="fa fa-download"></i>Download
        </router-link>
        <p class="recommendation">{{ platform.recommendation }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {Platforms} from '../platforms'

  export default {
    name: 'platforms',
    data() {
      return {
        platforms: Platforms
      }
    }
  }
</script>
