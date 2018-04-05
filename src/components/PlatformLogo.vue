<template>
  <span class="platform-logo">
    Sponge<span :class="platform.id">{{ platform.suffix }}</span>
  </span>
</template>

<script>
  export default {
    props: ['platform'],
  };
</script>

<style lang="scss">
  @import "../assets/variables";

  .platform-logo span {
    display: block;

    width: 6em;
    padding: 0.2em;

    margin: auto; // Center

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

    &.spongeapi {
      background-color: $spongeapi_color;
    }
  }
</style>
