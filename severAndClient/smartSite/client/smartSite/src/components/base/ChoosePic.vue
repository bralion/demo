<template>
    <el-dialog
            id="choose"
            title="图片选择"
            :visible.sync="ownPicShow"
            @close="closeDialogShow"
            width="50%"
            append-to-body
    >
        <p style="text-align: right">
            <span style="float:left;line-height: 35px;">已选择{{selectImgNums.length}}张 (最多可选择{{number}}张)</span>
            <el-input class="search"
                      placeholder="请输入内容"
                      v-model="imgWord">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="startSearchImg"
                   style="color: #788498;cursor: pointer;line-height:34px;"></i>
            </el-input>
            <el-button class="cancle" @click="cancleSelect"> 取 消</el-button>
            <el-button class="confirm" @click="" :disabled="selectImgNums.length==0" @click="confirm"> 确 认</el-button>
        </p>

        <div style="height:100%;">
            <ul class="image">
                <li :class="{isChoosed:selectImgNums.indexOf(item)!=-1}" class="imgItem" v-for="(item,index) in imgs">
                    <div v-if="selectImgNums.indexOf(item)!=-1" class="isSelectedIcon"></div>
                    <div  style="margin:  5%; width: 90%;height:90px;">
                        <img style="width: 100%;height:90px;" :src=item.picPath :alt="item.picDesc"  @click="handleSelectImg(item)">
                    </div>
                    <p  v-if="item.createAt"><span class="bg-title" :title="item.picName">{{item.picName}}</span> <span class="bgTime">{{item.createAt.slice(0,10)}}</span></p>
                </li>
            </ul>
        </div>
        <div class="paginationCon">
            <el-pagination
                    background
                    layout="prev, pager, next,total"
                    :current-page="imgPageInfo.currentPage"
                    @current-change="imgCurrentPageChange"
                    :total="imgPageInfo.count">
            </el-pagination>
        </div>
    </el-dialog>
</template>

<script>
    // 组件输入是一个type,包含两种一个是single   一个是many
    // 输出分别是一个数组 数组中是图片对象       single 作为输入则数组length为1  many则大于1
    //confirmSelect 传回数据对象在回调函数中
    export default {
        name: 'choose-pic',
        components: {},
        mounted () {
            this.init()
        },
        props:{
            number: {
                type: Number,
                required: true
            },
            choosePicShow: {
                type: Boolean,
                required: true
            },
            closeShow: {
                type: Function,
                required: true
            },
            confirmSelect: {//传出选择的结果到回调函数中
                type: Function,
                required: true
            }
        },
        watch: {
            choosePicShow() {
                this.ownPicShow = this.choosePicShow;
            }
        },
        data () {
            return {
                imgs:[],//所有当前页面图片数据
                choosedPicUrl:[],//选中图片的地址
                imgWord: '',//图片视图上的关键词====用于显示
                searchImgWord: '',//搜索图片的关键词===用于搜索
                selectImgNums:[],//当前选中的图片
                imgPageInfo:{//图片分页信息
                    count:0,
                    currentPage:1,
                    pageSize:18
                },
                ownPicShow:false,
            }
        },
        methods: {
            init () {
                this.getImgs();
            },
            getImgs(){//获取页面图片
                if(this.searchImgWord){//搜索图片
                    // 请求
                    this.request(
                        {
                            url: "resourceLibrary/searchImgs",
                            data:{
                                keyWord:this.searchImgWord,
                                pageSize:this.imgPageInfo.pageSize,
                                currentPage:this.imgPageInfo.currentPage
                            }
                        },
                        (data) => {
                            this.imgs=data.data;
                            this.imgPageInfo.count=data.count;
                        }
                    );
                }else{//直接请求
                    this.request(
                        {
                            url: "resourceLibrary/getImgs",
                            data:{
                                pageSize:this.imgPageInfo.pageSize,
                                currentPage:this.imgPageInfo.currentPage
                            }
                        },
                        (data) => {
                            this.imgs=data.data
                            this.imgPageInfo.count=data.count;
                        }
                    );
                }

            },
            closeDialogShow(){//关闭图片显示
                this.closeShow();
            },
            startSearchImg(){//开始搜索图片
                this.searchImgWord = this.imgWord;
                this.getImgs();
            },
            handleSelectImg(item){//单击图片选中
                let currentIndex=this.selectImgNums.indexOf(item);
                if(currentIndex===-1){
                    if(this.selectImgNums.length<this.number){
                        this.selectImgNums.push(item);
                    }else{
                         let message='最多只能选择'+this.number+'张！'
                         this.$message({type:'warning',message:message})
                    }
                }else{
                    this.selectImgNums.splice(currentIndex,1);
                }
            },
            imgCurrentPageChange(val){//图片分页当前页改变
                this.imgPageInfo.currentPage=val;
                this.getImgs();
            },
            cancleSelect(){//取消选择
                this.selectImgNums=[];
                this.closeShow();
            },
            confirm(){
                this.confirmSelect(this.selectImgNums);
                this.selectImgNums=[];
                this.closeDialogShow();
            }
         }
    }
</script>

<style scoped>
    .image {
        text-align: left;
    }

    .image > li {
        box-sizing: border-box;
        display: inline-block;
        width: 14.4%;
        height: 155px;
        margin-top: 20px;
        margin-right: 20px;
        background-color: #ffffff;
        border-radius: 4px;
    }

    .image > li > p {
        padding-left: 6%;
        margin-top: 10px;
    }

    .image > li > img {
        border-radius: 4px;
    }
    .imgItem:hover{
        border: 1px solid rgba(41,147,170,0.5);
    }
    .imgItem{
        border: 1px solid transparent;
    }
    .isChoosed{
        border: 1px solid #2993AA;
        position: relative;
    }
    .isChoosed:hover{
        border: 1px solid #2993AA !important;
    }
    .isSelectedIcon{
        background: url("../../assets/choosed.png") no-repeat;
        display: inline-block;
        position: absolute;
        width:18px;
        height:18px;
        right: -7px;
        top:-7px;
        cursor: pointer;
        background-size: 18px 18px;
    }
    .bg-title {
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow: hidden;
        max-width:100px;
        display: inline-block;
        line-height: 16px;
    }

    .bgTime {
        font-size: 14px;
        float: left;
        padding-right: 33px;
        margin-top: 5px;
    }
    #choose >>> .el-dialog__body{
    background-color: #e9eef3;
        height: 640px;
        padding-bottom: 50px;
        padding-top: 15px;
        position: relative;
    }
    .paginationCon{
        position: absolute;
        bottom: 0;
        width: 95%;
        text-align: center;
        line-height: 50px;
    }

    .search {
        width: 146px;
        height:34px;
    }

    .search >>> .el-input__inner {
        border: 1px solid #8B95A0;
        background: transparent;
        height:32px;
    }

    .search >>> .el-input__inner:hover {
        border: 1px solid #409eff;
        color: #000000;
    }

    .search >>> .el-icon-search::before {
        font-size: 17px;
        font-weight: bold;
    }

    .cancle {
        background-color: #46C4D3;
        color: #ffffff;
        height: 34px;
        line-height: 0;
        margin-left: 20px;
    }

    .confirm {
        height: 34px;
        line-height: 0;
        margin-left: 20px;
        margin-right: 23px;
    }


</style>
