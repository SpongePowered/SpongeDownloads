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
                    <p>Show pre-release versions of Minecraft</p>
                    <p>
                      Turning this on will show <em>pre-release</em> versions of Minecraft for which Sponge builds exist in the version selector.
                    </p>
                </b-form-checkbox>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-checkbox
                    id="filter-api-versions"
                    v-model="$root.filterMCVersionsThatDontMatchExpectedAPI"
                    name="filter-api-versions">
                    <p>Only show builds that match the expected SpongeAPI for the given Minecraft version</p>
                    <p>Sometimes, we start development on the next version of an API on a Minecraft version that has already seen a SpongeAPI release (e.g., there are builds of Sponge for Minecraft 1.12.2 that implement a very early version of SpongeAPI 8). 
                      Unchecking this box will show these builds. <strong>It is strongly recommended that you leave this turned on as the hidden builds are snapshots of early API prototypes and are now largely useless.</strong></p>
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

    label.custom-control-label p:first-child {
      font-weight: bold;
      margin-bottom: 0;
    }

    h1 {
      font-size: 5rem;
    }
  }
</style>
