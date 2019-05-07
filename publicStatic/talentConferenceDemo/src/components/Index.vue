<template>
    <div id="indexPage">
        <div class="index-btn" @click="jumpToPage1"></div>
    </div>
</template>
<script>
    export default {
        name: 'Login',
        mounted () {
        },
        data () {
            return {
            
            }
        },
        methods: {
	        jumpToPage1(){
	        	this.$router.push({path:'/startCamera'})
            }
        }
    }

</script>

<style scoped>
    /*------------首页样式-------*/
    #indexPage{
        width:100%;
        height:100%;
        background: url("../assets/images/index.png") no-repeat 0 0 ;
        background-size: 100% 100%;
    }
    /*立即拍照按钮*/
    .index-btn{
        position: absolute;
        color:#fff;
        top: 752px;
        right: 776px;
        width:379px;
        height:66px;
        background: url("../assets/images/bg-icon.png") no-repeat -131px -697px;
    }
</style>
