<!-- TODO: Consider moving parts of this to separate project -->
<template>
  <b-navbar id="topbar" toggleable="md" type="dark">
    <b-container>
      <div id="sp-logo-container">
        <a class="logo" href="#top">
          <img src="https://www.spongepowered.org/assets/img/icons/spongie-mark.svg" alt="" style="height: 40px">
          <span>Sponge</span>
          <font-awesome-icon icon="chevron-down" fixed-width/>
        </a>
        <div id="sp-logo-menu">
          <ul id="sp-logo-dropdown">
            <li><a href="https://www.spongepowered.org">
              <font-awesome-icon icon="home" fixed-width/> Homepage</a></li>
            <li><a href="https://forums.spongepowered.org">
              <font-awesome-icon icon="comments" fixed-width/> Forums</a></li>
            <li><a href="https://github.com/SpongePowered">
              <font-awesome-icon icon="code" fixed-width/> Code</a></li>
            <li><a href="https://docs.spongepowered.org">
              <font-awesome-icon icon="book" fixed-width/> Docs</a></li>
            <li><a href="https://jd.spongepowered.org">
              <font-awesome-icon icon="graduation-cap" fixed-width/> Javadocs</a></li>
            <li><a href="https://ore.spongepowered.org/">
               <img src="https://spongepowered.org/assets/img/icons/ore.svg" alt="" class="ore-nav"> Plugins (Ore)</a></li>
            <li class="active"><a :href="baseUrl">
              <font-awesome-icon icon="download" fixed-width/> Downloads</a></li>
            <li><a href="https://www.spongepowered.org/chat">
              <font-awesome-icon icon="comment" fixed-width/> Chat</a></li>
          </ul>
        </div>
      </div>

      <b-navbar-toggle target="main-navbar-collapse"></b-navbar-toggle>

      <b-collapse is-nav id="main-navbar-collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item :key="home" :to="{name: 'overview'}" exact>Downloads</b-nav-item>
          <b-nav-item v-for="platform in platforms" :key="platform.id"
                      :to="{name: 'downloads', params: {project: platform.id}}">{{ platform.name }}</b-nav-item>
          <b-nav-item :to="{name: 'settings'}" exact>Settings</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
  import {BContainer, BNavbar, BNavbarNav, BNavbarToggle, BNavItem, BCollapse} from 'bootstrap-vue'

  import {library as fontawesomeLibrary} from '@fortawesome/fontawesome-svg-core'
  import {faChevronDown, faHome, faComments, faCode, faBook, faGraduationCap, faPlug, faDownload, faComment} from '@fortawesome/free-solid-svg-icons'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

  import {Platforms} from "../platforms";

  fontawesomeLibrary.add(faChevronDown, faHome, faComments, faCode, faBook, faGraduationCap, faPlug, faDownload, faComment);

  export default {
    name: 'navbar',
    data() {
      return {
        platforms: Platforms
      }
    },
    computed: {
      baseUrl: function() {
        return process.env.BASE_URL;
      }
    },
    components: {
      'b-container': BContainer,
      'b-navbar': BNavbar,
      'b-navbar-nav': BNavbarNav,
      'b-navbar-toggle': BNavbarToggle,
      'b-nav-item': BNavItem,
      'b-collapse': BCollapse,
      FontAwesomeIcon,
    }
  }
</script>

