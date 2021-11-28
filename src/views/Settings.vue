<template>
  <main id="settings">
    <section class="breadcrumb">
      <b-container>
          <b-row>
              <b-col>
                <div class="inline">
                    <platform-logo :platform="{ id: 'Settings' }"/>
                </div>
              </b-col>
          </b-row>
      </b-container>
    </section>
    <b-container>
        <b-row>
            <b-col>
                <p>
                    These settings control the behavior of this Downloads site on this browser only, using the browser's local storage.
                </p>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-checkbox
                    id="show-pre-release"
                    v-model="$root.showPreReleaseMC"
                    name="show-pre-release">
                    Show pre-release versions of Minecraft
                </b-form-checkbox>
            </b-col>
        </b-row>
    </b-container>
  </main>
</template>

<script>

/* eslint-disable */
  import {BContainer, BRow, BCol, BFormCheckbox} from 'bootstrap-vue'
  import PlatformLogo from '../components/PlatformLogo.vue'

  export default {
    name: 'settings',
    components: {
        "b-container": BContainer,
        "b-row": BRow,
        "b-col": BCol,
        "b-form-checkbox": BFormCheckbox,
        "platform-logo": PlatformLogo
    }
  }
</script>

<style lang="scss">
  @import "../assets/variables";

  #settings {
    text-align: left;


    h1 {
      font-size: 5rem;
    }
  }
</style>
