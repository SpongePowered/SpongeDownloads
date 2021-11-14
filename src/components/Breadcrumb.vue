<template>
    <section class="breadcrumb">
        <b-container>
            <b-row>
                <b-col>
                    <div class="inline">
                        <h2><router-link :to="{name: 'overview'}" >Downloads</router-link></h2>
                    </div>
                    <div class="inline">
                        <h2>/</h2>
                    </div>
                    <div class="inline">
                        <platform-logo :platform="platform"/>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script>
import {BContainer, BRow, BCol} from 'bootstrap-vue';
import PlatformLogo from './PlatformLogo.vue'

export default {
    props: ['platform'],
    name: 'breadcrump',
    components: {
        'b-container': BContainer,
        'b-row': BRow,
        'b-col': BCol,
        'platform-logo': PlatformLogo
    }
}
</script>

<style lang="scss">
.breadcrumb {

    h2 {
        font-size: 1.5em;
    }

    div.inline {
        display: inline-block;
        padding: 0 5px;

        a {
            color: #999;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>