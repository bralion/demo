<template>
    <div  style="height: 100%;width:100%">
        <div class="container">
            <div class="PC"></div>
            <div class="小程序"></div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "home",
		components: {},
		mounted () {
			this.init ();
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
    .container{
        background-color: #42b983;
        width: 800px;
        height: 600px;
        margin: 0 auto;
        position: relative;
    }
    .PC{
    
    }
</style>
