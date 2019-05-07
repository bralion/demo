<template>
    <div id="indexPage2">
        <div class="head">
            <div class="currentPic">
                <img  class="img" :src="currentShowPath" alt="" width="384px" height="209px;">
            </div>
            <div class="index-btn" @click="jumpToPage1">
            </div>
            <div class="index-btn1" @click="jumpToIndex">
            </div>
        </div>
        <div class="content">
            <ul>
                <li v-for="(item,index) in currentData" @click="checkStyle(item,index)" :class="{picActive:currentPath===item}">
                    <img class="styleImg" :src="item" width="83px" height="110px" alt="">
                </li>
            </ul>
            <div class="hangdlePicturePagination">
                <el-pagination
                        layout="prev, pager, next,total"
                        :page-size="pageSize"
                        @current-change="handleCurrentChange"
                        :total="listData.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "handle-picture",
		components: {},
		mounted () {
			this.init ();
		},
		data () {
			return {
				currentPath:null,//当前的选中的风格图片路径
				currentShowPath:null,//当前的拍照获取的图片
				currentData:[],//当前分页的data
                currentPage:1,//当前页
                pageSize:100,
				//列表显示项
				listData:
					["../static/style_images/15766.jpg", "../static/style_images/16379.jpg", "../static/style_images/lined_0077.jpg",  "../static/style_images/15505.jpg", "../static/style_images/16286.jpg", "../static/style_images/16333.jpg", "../static/style_images/15430.jpg", "../static/style_images/15802.jpg", "../static/style_images/15814.jpg", "../static/style_images/15728.jpg", "../static/style_images/15738.jpg", "../static/style_images/15534.jpg", "../static/style_images/16171.jpg", "../static/style_images/15322.jpg", "../static/style_images/16178.jpg",  "../static/style_images/15828.jpg", "../static/style_images/15757.jpg", "../static/style_images/16413.jpg", "../static/style_images/15292.jpg", "../static/style_images/15856.jpg", "../static/style_images/cobwebbed_0076.jpg", "../static/style_images/16604.jpg", "../static/style_images/15897.jpg", "../static/style_images/15516.jpg", "../static/style_images/16165.jpg", "../static/style_images/15946.jpg", "../static/style_images/15997.jpg", "../static/style_images/16045.jpg", "../static/style_images/16189.jpg",  "../static/style_images/15952.jpg", "../static/style_images/16442.jpg", "../static/style_images/16616.jpg", "../static/style_images/16447.jpg", "../static/style_images/16619.jpg", "../static/style_images/flecked_0095.jpg", "../static/style_images/16580.jpg", "../static/style_images/16637.jpg", "../static/style_images/16381.jpg", "../static/style_images/15353.jpg", "../static/style_images/15965.jpg", "../static/style_images/16128.jpg", "../static/style_images/16095.jpg", "../static/style_images/16169.jpg", "../static/style_images/16693.jpg", "../static/style_images/15862.jpg", "../static/style_images/15428.jpg", "../static/style_images/15742.jpg", "../static/style_images/15916.jpg", "../static/style_images/15293.jpg", "../static/style_images/16737.jpg", "../static/style_images/chequered_0179.jpg", "../static/style_images/15676.jpg", "../static/style_images/16748.jpg", "../static/style_images/16182.jpg", "../static/style_images/15307.jpg", "../static/style_images/15699.jpg", "../static/style_images/15499.jpg", "../static/style_images/16201.jpg", "../static/style_images/lined_0061.jpg", "../static/style_images/15816.jpg", "../static/style_images/16172.jpg", "../static/style_images/16112.jpg", "../static/style_images/15701.jpg", "../static/style_images/16153.jpg", "../static/style_images/16600.jpg", "../static/style_images/15721.jpg", "../static/style_images/15266.jpg", "../static/style_images/16179.jpg", "../static/style_images/16018.jpg", "../static/style_images/veined_0111.jpg", "../static/style_images/16577.jpg", "../static/style_images/16559.jpg", "../static/style_images/16550.jpg", "../static/style_images/15620.jpg", "../static/style_images/15685.jpg", "../static/style_images/15549.jpg", "../static/style_images/16513.jpg", "../static/style_images/zigzagged_0120.jpg", "../static/style_images/15903.jpg", "../static/style_images/15706.jpg", "../static/style_images/15410.jpg", "../static/style_images/16549.jpg", "../static/style_images/15294.jpg", "../static/style_images/15858.jpg", "../static/style_images/16323.jpg", "../static/style_images/zigzagged_0047.jpg", "../static/style_images/15837.jpg", "../static/style_images/16368.jpg", "../static/style_images/16666.jpg", "../static/style_images/15896.jpg", "../static/style_images/woven_0038.jpg", "../static/style_images/15501.jpg", "../static/style_images/15733.jpg", "../static/style_images/15813.jpg", "../static/style_images/15325.jpg", "../static/style_images/16681.jpg", "../static/style_images/15752.jpg", "../static/style_images/15650.jpg", "../static/style_images/16170.jpg", "../static/style_images/15705.jpg", "../static/style_images/15729.jpg", "../static/style_images/16679.jpg", "../static/style_images/16728.jpg", "../static/style_images/grid_0003.jpg", "../static/style_images/15503.jpg", "../static/style_images/15716.jpg", "../static/style_images/16004.jpg", "../static/style_images/16526.jpg", "../static/style_images/16530.jpg", "../static/style_images/16529.jpg", "../static/style_images/16512.jpg", "../static/style_images/16339.jpg", "../static/style_images/16655.jpg", "../static/style_images/16216.jpg", "../static/style_images/16072.jpg", "../static/style_images/16207.jpg", "../static/style_images/16020.jpg", "../static/style_images/15870.jpg", "../static/style_images/15519.jpg", "../static/style_images/15784.jpg", "../static/style_images/15695.jpg", "../static/style_images/15821.jpg", "../static/style_images/16571.jpg", "../static/style_images/15852.jpg", "../static/style_images/15432.jpg", "../static/style_images/16751.jpg", "../static/style_images/16202.jpg", "../static/style_images/15339.jpg", "../static/style_images/smeared_0146.jpg", "../static/style_images/15495.jpg", "../static/style_images/15618.jpg", "../static/style_images/16316.jpg", "../static/style_images/16070.jpg", "../static/style_images/15492.jpg", "../static/style_images/15336.jpg", "../static/style_images/16659.jpg", "../static/style_images/15850.jpg", "../static/style_images/15400.jpg", "../static/style_images/15421.jpg", "../static/style_images/15374.jpg", "../static/style_images/15960.jpg", "../static/style_images/15435.jpg", "../static/style_images/woven_0114.jpg", "../static/style_images/16375.jpg", "../static/style_images/15306.jpg", "../static/style_images/16556.jpg", "../static/style_images/16060.jpg", "../static/style_images/16695.jpg", "../static/style_images/16116.jpg", "../static/style_images/16074.jpg", "../static/style_images/16635.jpg", "../static/style_images/15708.jpg", "../static/style_images/16708.jpg", "../static/style_images/15478.jpg", "../static/style_images/15512.jpg", "../static/style_images/16574.jpg", "../static/style_images/15673.jpg", "../static/style_images/16348.jpg", "../static/style_images/16620.jpg", "../static/style_images/15457.jpg", "../static/style_images/15969.jpg", "../static/style_images/16331.jpg", "../static/style_images/15415.jpg", "../static/style_images/15936.jpg", "../static/style_images/16441.jpg", "../static/style_images/16042.jpg", "../static/style_images/15749.jpg", "../static/style_images/15590.jpg", "../static/style_images/15576.jpg", "../static/style_images/16750.jpg", "../static/style_images/16514.jpg", "../static/style_images/16575.jpg", "../static/style_images/16107.jpg", "../static/style_images/16025.jpg", "../static/style_images/16086.jpg", "../static/style_images/15383.jpg", "../static/style_images/16498.jpg", "../static/style_images/15715.jpg", "../static/style_images/16353.jpg", "../static/style_images/scaly_0200.jpg", "../static/style_images/16754.jpg", "../static/style_images/16053.jpg", "../static/style_images/15974.jpg", "../static/style_images/15444.jpg", "../static/style_images/16056.jpg", "../static/style_images/15320.jpg", "../static/style_images/15317.jpg", "../static/style_images/15754.jpg", "../static/style_images/interlaced_0105.jpg", "../static/style_images/16041.jpg", "../static/style_images/16007.jpg", "../static/style_images/16146.jpg", "../static/style_images/15901.jpg", "../static/style_images/15649.jpg", "../static/style_images/bubbly_0101.jpg", "../static/style_images/16412.jpg", "../static/style_images/15452.jpg", "../static/style_images/16535.jpg", "../static/style_images/16151.jpg", "../static/style_images/15972.jpg", "../static/style_images/16120.jpg", "../static/style_images/16662.jpg", "../static/style_images/15603.jpg", "../static/style_images/15671.jpg", "../static/style_images/15864.jpg", "../static/style_images/16715.jpg", "../static/style_images/15416.jpg", "../static/style_images/16437.jpg", "../static/style_images/15647.jpg", "../static/style_images/16409.jpg", "../static/style_images/16200.jpg", "../static/style_images/16240.jpg", "../static/style_images/15340.jpg", "../static/style_images/16657.jpg", "../static/style_images/16211.jpg", "../static/style_images/16299.jpg", "../static/style_images/15556.jpg", "../static/style_images/16198.jpg", "../static/style_images/16012.jpg", "../static/style_images/15951.jpg", "../static/style_images/15607.jpg", "../static/style_images/15405.jpg", "../static/style_images/16396.jpg", "../static/style_images/16654.jpg", "../static/style_images/dotted_0182.jpg", "../static/style_images/15625.jpg", "../static/style_images/16390.jpg", "../static/style_images/16752.jpg", "../static/style_images/16746.jpg", "../static/style_images/swirly_0149.jpg", "../static/style_images/16102.jpg", "../static/style_images/15373.jpg", "../static/style_images/15362.jpg", "../static/style_images/16147.jpg", "../static/style_images/15985.jpg", "../static/style_images/15691.jpg", "../static/style_images/15878.jpg", "../static/style_images/16603.jpg",  "../static/style_images/16760.jpg", "../static/style_images/15840.jpg", "../static/style_images/16763.jpg", "../static/style_images/cracked_0071.jpg", "../static/style_images/15829.jpg", "../static/style_images/16225.jpg", "../static/style_images/16265.jpg", "../static/style_images/16560.jpg", "../static/style_images/15404.jpg", "../static/style_images/16669.jpg", "../static/style_images/15941.jpg", "../static/style_images/15961.jpg",  "../static/style_images/16226.jpg", "../static/style_images/15574.jpg", "../static/style_images/15658.jpg", "../static/style_images/16271.jpg", "../static/style_images/15633.jpg", "../static/style_images/15638.jpg", "../static/style_images/16601.jpg", "../static/style_images/16618.jpg", "../static/style_images/15940.jpg", "../static/style_images/16208.jpg", "../static/style_images/16213.jpg", "../static/style_images/16061.jpg", "../static/style_images/16400.jpg",  "../static/style_images/15611.jpg", "../static/style_images/16246.jpg", "../static/style_images/16291.jpg", "../static/style_images/15301.jpg", "../static/style_images/15447.jpg", "../static/style_images/15674.jpg", "../static/style_images/15520.jpg", "../static/style_images/15593.jpg", "../static/style_images/16288.jpg", "../static/style_images/16546.jpg", "../static/style_images/15517.jpg",  "../static/style_images/15641.jpg", "../static/style_images/16389.jpg", "../static/style_images/15381.jpg", "../static/style_images/15697.jpg", "../static/style_images/15587.jpg",  "../static/style_images/15506.jpg", "../static/style_images/15515.jpg", "../static/style_images/16033.jpg", "../static/style_images/16334.jpg", "../static/style_images/16527.jpg", "../static/style_images/16287.jpg", "../static/style_images/15892.jpg", "../static/style_images/16262.jpg", "../static/style_images/15409.jpg", "../static/style_images/16554.jpg", "../static/style_images/15693.jpg", "../static/style_images/15275.jpg", "../static/style_images/15482.jpg", "../static/style_images/15639.jpg", "../static/style_images/15651.jpg", "../static/style_images/15731.jpg", "../static/style_images/16115.jpg", "../static/style_images/16173.jpg", "../static/style_images/16175.jpg", "../static/style_images/16276.jpg", "../static/style_images/16359.jpg", "../static/style_images/smeared_0107.jpg", "../static/style_images/16021.jpg", "../static/style_images/15287.jpg", "../static/style_images/15446.jpg",  "../static/style_images/15830.jpg", "../static/style_images/15700.jpg", "../static/style_images/15359.jpg", "../static/style_images/16114.jpg", "../static/style_images/16235.jpg", "../static/style_images/bumpy_0094.jpg", "../static/style_images/15486.jpg", "../static/style_images/15714.jpg", "../static/style_images/16088.jpg", "../static/style_images/15987.jpg", "../static/style_images/16740.jpg", "../static/style_images/15648.jpg", "../static/style_images/15735.jpg", "../static/style_images/15722.jpg", "../static/style_images/15895.jpg", "../static/style_images/15629.jpg", "../static/style_images/15543.jpg", "../static/style_images/15908.jpg", "../static/style_images/15529.jpg", "../static/style_images/16702.jpg", "../static/style_images/15427.jpg", "../static/style_images/15859.jpg", "../static/style_images/16392.jpg", "../static/style_images/15454.jpg", "../static/style_images/16015.jpg", "../static/style_images/16298.jpg", "../static/style_images/15898.jpg", "../static/style_images/15769.jpg", "../static/style_images/16249.jpg", "../static/style_images/15937.jpg", "../static/style_images/striped_0058.jpg", "../static/style_images/16650.jpg", "../static/style_images/15323.jpg", "../static/style_images/16229.jpg", "../static/style_images/15559.jpg", "../static/style_images/16371.jpg", "../static/style_images/15509.jpg", "../static/style_images/swirly_0163.jpg"]
				
			}
		},
		methods: {
			init () {
				console.log('跳转到处理页面')
                if(this.$route.params&&this.$route.params.originalPicturePath){//展示的图片
					this.currentShowPath=this.$route.params.originalPicturePath
	                console.log('收到展示路径'+this.currentShowPath)
				}
				if(this.$route.params&&this.$route.params.originalStylePath){//当前风格的图片
					this.currentPath=this.$route.params.originalStylePath
					console.log('收到风格路径'+this.currentPath)
				}
				if(this.$route.params&&this.$route.params.currentPage){//当前风格的Page
					this.currentPage=this.$route.params.originalStylePage
					console.log('收到风格page'+this.currentPage)
				}
				if(this.currentPage){//如果存在页的话  跳转到风格 所在页面
					let val=this.currentPage;
					let start=(val-1)*100;
					let end=val*100;
					if(end>this.listData.length){
						end=this.listData.length;
					}
					this.currentData=this.listData.slice(start,end);
                }
			},
			jumpToIndex(){
				this.$router.push('/index');
            },
            jumpToPage1(){
				this.$router.push('/startCamera');
            },
			checkStyle(path,index){//选中风格图
				this.currentPath=path;
				console.log('点击了风格图')
				console.log('当前的风格路径为'+this.currentPath);
				console.log('当前的展示图路径为'+this.currentShowPath);
				this.request({
					url:'transformbypath',
                    data:{
	                    content_imagepath:this.currentShowPath,
	                    style_imagepath:this.currentPath
                    }
				},(data)=>{
					console.log('收到风格图片如下');
					console.log(data);
					if(data){
						if(data.save_path){
							this.$router.push({
								name: 'picResult',
								params: {
									originalPicturePath: this.currentShowPath,
									path: data.save_path,
									originalStylePath: this.currentPath,
									originalStylePage: this.currentPage,
								}
							})
						}
					}
				})
            },
			handleCurrentChange(val){//分页切换
				this.currentPage=val;
				let start=(val-1)*100;
				let end=val*100;
				if(end>this.listData.length){
					end=this.listData.length;
                }
				this.currentData=this.listData.slice(start,end);
            }
            
			
		}
	}
</script>

<style scoped>
    #indexPage2 {
        width: 100%;
        height: 100%;
        background: url("../assets/images/index.png") no-repeat 0 0;
        /*background-color: #02030B;*/
        background-size: 100% 100%;
        padding: 12px;
    }
    .head{
        height:248px;
        width:100%;
        text-align: left;
    }
    .currentPic{
        display: inline-block;
        border-radius: 4px;
        height:225px;
        width:400px;
        background: #09163F;
        border:2px solid rgba(24, 89, 172, 1);
        margin-top:8px;
    
    }
    .img{
        border-radius: 4px;
        margin: 6px;
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
    .content{
        height:801px;
        width: 100%;
        background: #000000;
        opacity:0.67;
        text-align: left;
        position: relative;
    }
    li{
        display: inline-block;
        padding:10px  10px 0 0;
        position: relative;
    }
    .styleImg{
        border-radius: 4px;
    }
    .hangdlePicturePagination{
        position: absolute;
        bottom: 20px;
        text-align: center;
        width:100%;
    }
    /*选中的图片*/
    .picActive::before{
        content:'';
        display: block;
        position: absolute;
        width:83px;
        height:110px;
        left:0;
        background:url("../assets/images/bg-icon.png") no-repeat -1179px -192px;
    }
</style>
