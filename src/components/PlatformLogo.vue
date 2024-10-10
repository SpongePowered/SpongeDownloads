<template>
  <div class="platform-logo">
    <h2>
      <div v-if="isBadged"><span class="sponge-platform">Sponge </span><span class="subplatform" :class="platform.id">{{ platform.suffix }}</span></div>
      <div v-else>{{ platform.name || platform.id }}</div>
    </h2>
  </div>
</template>

<script>
  export default {
    props: ['platform'],
    computed: {
      isBadged: function () {
         return ["spongevanilla", "spongeforge", "spongeneo", "spongeapi"].indexOf(this.platform.id) !== -1
      }
    }
  };
</script>

<style lang="scss">
  @import "../assets/variables";

  .platform-logo {
    h2 {
      margin-bottom: 0;
    
      > div {
        display: inline-flex;
        align-items: center;

        .sponge-platform {
          margin-right: 0.2em;
        }
        
        .subplatform {
          display: inline-block;

          width: 6em;
          padding: 0.2em;

        // margin: auto; // Center

          border-radius: 2px;

          color: white;
          font-size: 0.5em;
          font-weight: 500;
          text-align: center;

          &.spongevanilla {
            background-color: $spongevanilla_color;
          }

          &.spongeforge {
            background-color: $spongeforge_color;
          }

          &.spongeneo {
            background-color: $spongeneo_color;
          }

          &.spongeapi {
            background-color: $spongeapi_color;
          }

          ::before {
            margin-left: 0.1em;
          }
        }
      }
    }
  }
</style>
