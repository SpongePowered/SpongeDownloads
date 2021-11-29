<template>
  <div id="app">
    <navbar/>
    <the-header />
    <router-view/>
    <the-footer/>
  </div>
</template>

<script>
  import Navbar from './components/Navbar.vue'
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'

  export default {
    components: {
      Navbar, 'the-header': Header, 'the-footer': Footer
    }
  }
</script>

<style lang="scss">
  html, body, #app {
    height: 100%;
  }

  #app {
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1 0 auto;
  }
</style>
