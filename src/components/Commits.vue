<template>
    <ol class="commits">
        <li class="commit" v-for="commit in commits" :key="commit.id">
            <a :href="'https://github.com/SpongePowered/' + project + '/commit/' + commit.id" target="_blank">{{ commit.title }}</a>
            <button class="ellipsis-expander" data-toggle="collapse-next" v-if="commit.description || commit.submodules">…</button>
            <div>{{ commit.author }} - <small><relative-time :t="commit.date"></relative-time></small></div>
            <div class="collapse" v-if="commit.description || commit.submodules">
                <pre class="commit-message" v-if="commit.description">{{ commit.description }}</pre>
                <div class="commit-submodules" v-if="commit.submodules">
                    <div v-for="(subcommits, submodule) in commit.submodules" :key="submodule">
                        <!-- TODO: Submodule commits should be NEVER null -->
                        <template v-if="subcommits">
                            <h5>{{ submodule }}</h5>
                            <commits :project="submodule" :l="subcommits"></commits>
                        </template>
                    </div>
                </div>
            </div>
        </li>

        <li v-if="count < l.length" class="more-commits">
            <a v-on:click="count *= 2">Show {{ l.length - count }} older commits.</a>
        </li>
    </ol>
</template>

<script>
    import RelativeTime from './relative-time'

    export default {
        name: 'commits',
        props: ['project', 'l'],
        data() {
            return {
                count: 5
            }
        },
        computed: {
            commits() {
                if (this.count >= this.l.length) {
                    return this.l
                } else {
                    return this.l.slice(0, this.count)
                }
            }
        },
        components: {
            'relative-time': RelativeTime
        }
    }
</script>
