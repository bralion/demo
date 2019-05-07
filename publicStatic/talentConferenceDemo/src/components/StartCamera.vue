<script src="../../../server/app.js"></script>
<template>
    <div>
        <div id="indexPage1">
            <div class="video">
                <video ref="video" id="video" autoplay="autoplay" width="100%">
                </video>
            </div>
            <div class="start">
                <div class="camera" @click="startCamera"></div>
            </div>
        </div>
        <div id="canvas">
            <canvas class="canvas"  width="1920" height="890"
                   ref="canvas"></canvas>
        </div>
    </div>
   
</template>

<script>
	export default {
		name: "start-camera",
		components: {},
		mounted () {
			this.init ();
		},
		data () {
			return {
				stream:null
            }
		},
		methods: {
			init () {
				this.getMedia()
			},
			getMedia () {//调起摄像头
				let constraints = {
					video: {width: 1920, height: 890},
					audio: true
				};
				//获得video摄像头区域
				let video = this.$refs.video;
				//这里介绍新的方法，返回一个 Promise对象
				// 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
				// then()是Promise对象里的方法
				// then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
				// 避免数据没有获取到
				let promise = navigator.mediaDevices.getUserMedia (constraints);
				promise.then (function (MediaStream) {
					video.srcObject = MediaStream;
					this.stream = typeof MediaStream.stop === 'function' ? MediaStream : MediaStream.getTracks()[1];
					video.play ();
				});
			},
			startCamera () {//开始拍照
				var video =  this.$refs.video
				var context =  this.$refs.canvas.getContext('2d');
				context.drawImage(video,0,0,1582,890);
				var base64 = this.$refs.canvas.toDataURL('image/png');
				console.log(base64);
				this.request ({
					url: 'snap',
                    data:{
	                    image_file:base64
                    }
				}, (data) => {
			
					console.log (data);
					if (data) {
						if (data.save_path) {
							console.log ('从开始拍照页跳转到处理页')
							console.log ('从开始拍照页跳转到处理页路径' + data.save_path)
							this.$router.push ({
									name: 'handle',
									params: {
										originalPicturePath: data.save_path,
									}
								}
							)
						}
					}
				})
			},
            stop(){
	        
            }
		}
	}
</script>

<style scoped>
    /*------------拍照页样式-------*/
    #indexPage1 {
        width: 100%;
        height: 100%;
        background-color: #000000;
    }
    
    /*隐藏于背景之下*/
    #canvas{
        position: absolute;
        top:0;
        left:0;
        width: 1920px;
        height: 890px;
        z-index: -99999;
    }
    .canvas{
        width: 1920px;
        height: 890px;
    }
    
    .vodeo {
        width: 100%;
        height: 890px;
        background-color: #000000;
    }
    
    #video {
        width: 100%;
        height: 890px;
        background-color: #000000;
    }
    #video1 {
        width: 100%;
        height: 890px;
        display: none;
        background-color: #000000;
    }
    
    .start {
        width: 100%;
        text-align: center;
        background: #000000;
    }
    
    .camera {
        display: inline-block;
        margin: 43px auto auto auto;
        width: 103px;
        height: 103px;
        background: url("../assets/images/bg-icon.png") no-repeat -260px -193px;
    }

</style>
