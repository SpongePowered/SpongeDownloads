<template>
  <footer>
    <b-container>
      <span>Copyright &copy; SpongePowered 2014-{{ new Date().getFullYear() }}</span>
    </b-container>
  </footer>
</template>

<script>
  import {BContainer} from 'bootstrap-vue';

  export default {
    name: 'the-footer',
    components: {
      'b-container': BContainer
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  footer {
    background: $sponge_dark_grey;
    color: white;
    text-align: center;
    font-size: 75%;

    padding: 10px;
  }
</style>
