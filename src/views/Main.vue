<template>
    <div>
    <header>
        <div class="container">
            <div class="row">
                <div class="col-lg-5 col-md-6">
                    <div class="logo">
                        <img src="https://www.spongepowered.org/assets/img/icons/spongie-mark-reverse-dark.svg" alt="">
                        <h1>Sponge</h1>
                    </div>
                    <h2>Downloads</h2>
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
