<template>
    <div>
    <header>
        <div class="container">
            <div class="row">
                <div class="logo">
                    <h1>Sponge <span class="platform-badge downloads">Downloads</span></h1>
                </div>
            </div>
        </div>
    </header>

    <section id="downloads">
        <div class="container">
            <platforms></platforms>
        </div>
    </section></div>
</template>

<script>
    import Platforms from '../components/Platforms.vue'

    export default {
        name: 'main',
        components: {
            platforms: Platforms
        }
    }
</script>
