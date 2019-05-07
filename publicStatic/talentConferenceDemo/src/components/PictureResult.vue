<template>
<div class="indexPage3">
    <div style="width:1920px;height:887px;">
        <img :src="currentShowPath" wdith="100% " height="100%" alt="">
    </div>
    <div class="btns">
        <div class="index-btn2" @click="jumpToPage2">
        </div>
        <div class="index-btn" @click="jumpToPage1">
        </div>
        <div class="index-btn1" @click="jumpToIndex">
        </div>
    </div>
</div>
</template>

<script>
	export default {
		name: "picture-result",
		components: {},
		mounted () {
			this.init ();
		},
		data () {
			return {
				currentShowPath:'',
				originalPicturePath:'',//原始图片地址
				originalStylePath:'',//原始风格地址
				originalStylePage:''//原始风格第几页地址
            }
		},
		methods: {
			init () {
				if(this.$route.params&&this.$route.params.originalPicturePath){
					this.currentShowPath=this.$route.params.path
					this.originalPicturePath=this.$route.params.originalPicturePath
					this.originalStylePath=this.$route.params.originalStylePath
					this.originalStylePage=this.$route.params.originalStylePage
					console.log('跳转过来了原始图片的path'+this.originalPicturePath)
					console.log('当前展示的图片'+this.currentShowPath)
					console.log('当前风格的图片'+this.originalStylePath)
					console.log('当前风格的第几页'+this.originalStylePage)
				}
			},
			jumpToIndex(){
				this.$router.push('/index');
			},
			jumpToPage1(){
				this.$router.push('/startCamera');
			},
            jumpToPage2(){
				this.$router.push({
					name: 'handle',
					params: {
						originalPicturePath: this.originalPicturePath,
						originalStylePath: this.originalStylePath,
						originalStylePage: this.originalStylePage
					}
				});
			},
		}
	}
</script>

<style scoped>
.indexPage3{
    width: 100%;
    height: 100%;
    background: url("../assets/images/index.png") no-repeat 0 0;
    /*background-color: #02030B;*/
    background-size: 100% 100%;
}
.index-btn{
    display: inline-block;
    color:#fff;
    width:247px;
    height:65px;
    background: url("../assets/images/bg-icon.png") no-repeat -197px -456px;
    margin-left: 24px;
}
.index-btn:hover{
    background: url("../assets/images/bg-icon.png") no-repeat -680px -456px;
    cursor: pointer;
}
.index-btn1{
    display: inline-block;
    color:#fff;
    width:247px;
    height:65px;
    background: url("../assets/images/bg-icon.png") no-repeat -195px -562px;
    margin-left: 24px;
}
.index-btn1:hover{
    background: url("../assets/images/bg-icon.png") no-repeat -678px -562px;
    cursor: pointer;
}
.index-btn2{
    display: inline-block;
    color:#fff;
    width:247px;
    height:65px;
    background: url("../assets/images/bg-icon.png") no-repeat -196px -335px;
    margin-left: 24px;
}
.index-btn2:hover{
    background: url("../assets/images/bg-icon.png") no-repeat -679px -335px;/*变大*/
    cursor: pointer;
}
.btns{
margin-top: 50px;
}
</style>
