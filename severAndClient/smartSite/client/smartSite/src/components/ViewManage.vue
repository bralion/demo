<template>
    <div style="height: 100%;">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'view-manage-home',
        components: {},
        mounted () {
            this.init()
        },
        data () {
            return {}
        },
        methods: {
            init () {
            }
        }
    }
</script>

<style scoped>

</style>
