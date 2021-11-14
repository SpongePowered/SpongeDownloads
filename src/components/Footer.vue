<template>
  <footer>
    <b-container>
      <p>Copyright &copy; SpongePowered 2014-2021</p>
      <p id="fastly">Accelerated by<br>
        <a href="https://www.fastly.com">
          <img src="https://www.spongepowered.org/assets/img/fastly.png" alt="Fastly" height="45" width="100">
        </a>
      </p>
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

    #fastly {
      margin: 0;
    }
  }
</style>
