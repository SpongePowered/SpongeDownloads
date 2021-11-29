<template>
    <b-container class="platform-entry" @click="switchToDownloadPage()">
        <b-row>
        <b-col>
            <h3><platform-logo :platform="platform"/></h3>
        </b-col>
        </b-row>
        <b-row>
        <b-col>
            <div class="float-right buttons">
            <!-- <b-button variant="info" :to="{name: 'downloads', params: {project: platform.id}}">
                <font-awesome-icon icon="download"/> Download Latest Recommended Build <br/>
                <small>Version: version</small>
            </b-button>
            &nbsp; -->
            <b-button variant="secondary" :to="{name: 'downloads', params: {project: platform.id}}">
                <font-awesome-icon icon="download"/> View Builds
            </b-button>
            </div>
            <p class="description">{{ platform.description }}</p>
        </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import {BContainer, BRow, BCol, BButton} from 'bootstrap-vue'

    import {library as fontawesomeLibrary} from '@fortawesome/fontawesome-svg-core'
    import {faDownload} from '@fortawesome/free-solid-svg-icons'
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

    import PlatformLogo from './PlatformLogo.vue'

  fontawesomeLibrary.add(faDownload);

  export default {
    name: 'platform',
    props: [
        "platform"
    ],
    methods: {
      switchToDownloadPage() {
        this.$router.push({name: 'downloads', params: {project: this.platform.id}});
      }
    },
    components: {
      'b-container': BContainer,
      'b-row': BRow,
      'b-col': BCol,
      'b-button': BButton,
      FontAwesomeIcon,
      PlatformLogo,
    }
  }
</script>
