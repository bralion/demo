<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home/viewManage/viewManageHome' }">配置首页</el-breadcrumb-item>
            <el-breadcrumb-item>一体机模板配置</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="height: 100%;padding-top: 30px;">
            <div style="display: inline-block; width: 25%;border-right: 1px solid #cfcfcf;height: 100%;overflow: hidden;box-sizing:border-box;">
                <div>
                    <img src="" alt="">
                </div>
                <ul ref="list" style="width:100%;">
                    <li @click="handleClick(index)" v-for="(item ,index) in showData"
                        :style="'background: url('+item.pictureUrl+') no-repeat 0;  background-size: 300px 80px; '"
                        :targetLink="item.url" :title="item.urlName" :class="{active:currentItem==item}"
                        class="item item_static"></li>
                </ul>
            </div>
            <div class="text-right">
                <p style="font-size: 18px;text-align: left;margin-bottom: 20px;">当前一共{{showData.length}}个网站在一体机上 <el-button size="mini"
                        style="margin-left: 50px;" @click="addWebsiteForm.showDialog=true">添加</el-button>
                    <el-button size="mini" style="margin-left: 20px;" @click="delWebSite">删除</el-button>
                </p>

                <p v-for="(value,key) in currentItem" v-if="Object.keys(switchText).includes(key)">
                    {{switchText[key]+':'+value}}
                </p>

            </div>
        </div>
        <el-dialog
                title="添加一体机网站"
                :visible.sync="addWebsiteForm.showDialog"
                width="40%"
        >
            <el-form label-position="left" label-width="80px" ref="addWebsiteForm"  :model="addWebsiteForm">
                <el-form-item label="网站名称" >
                    <el-input v-model="addWebsiteForm.websiteName"></el-input>
                </el-form-item>
                <el-form-item label="跳转地址" >
                    <el-input v-model="addWebsiteForm.jumpPath"></el-input>
                </el-form-item>
                <el-form-item label="封面图片" >
                    <el-input style="width:300px;" placeholder="请选择图片" v-model="addWebsiteForm.picName"
                              :disabled='true'></el-input>
                    <el-button @click="choosePicShow=true">选择图片作为封面</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="startAddWebsite">提交</el-button>
                    <el-button @click="addWebsiteForm.showDialog = false">取 消</el-button>
                </span>
        </el-dialog>
        <choose-pic :number="1" :choosePicShow="choosePicShow" :closeShow="closePicShow"
                    :confirmSelect="confirmSelect"></choose-pic>

    </div>
</template>

<script>
    import ChoosePic from '../base/ChoosePic'

    export default {
        name: 'integrated-machine',
        components: {
            ChoosePic
        },
        mounted () {
            this.init()
        },
        data () {
            return {
                showData: [],//展示列表
                currentItem: '',//当前被激活的链接
                switchText:{//文字字典表
                    createAt:'创建时间',
                    url:'跳转地址',
                    urlName:'网站名称',
                    pictureName:'图片名称',
                    pictureUrl:'图片地址'
                },//配置页面上一体机详情显示的文字
                addWebsiteForm:{//添加网站表单
                    websiteName:'',//网站名称
                    picPath:'',//图片地址
                    picName:'',//图片名称
                    jumpPath:'',//跳转地址
                    showDialog: false,//模态框状态
                },
                choosePicShow:false,//控制选择图片组件显示
            }
        },
        methods: {
            async init () {
                await this.getData()
                this.handleClick()
            },
            getData () {//获取数据
                return this.request({
                    url: 'integratedMachine/getUrl',
                }, (res) => {
                   res.data.map(item=>{
                       item.pictureUrl=item.pictureUrl;
                    });
                    this.showData =res.data;
                })
            },
            handleClick (index) {//点击图片
                if (!index) {
                    this.currentItem = this.showData[0]
                } else {
                    this.currentItem = this.showData[index]
                }

            },
            delWebSite(){//删除当前网站
                this.$confirm('此操作将永久删除该网站, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.request({
                        url: 'integratedMachine/delUrl',
                        data:{
                            _id:this.currentItem._id
                        }
                    }, async(res) => {
                        await this.getData()
                        this.handleClick()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            startAddWebsite () {//添加网站
                this.request({
                    url: 'integratedMachine/addUrl',
                    data:this.addWebsiteForm
                }, async(res) => {
                    this.addWebsiteForm={websiteName:'',//网站名称
                        picPath:'',//图片地址
                        picName:'',//图片名称
                        jumpPath:'',//跳转地址
                        showDialog: false,}//模态框状态
                    await this.getData()
                    this.handleClick()
                })
            },
            confirmSelect (val) {//当前选中的图片
                this.addWebsiteForm.picPath = val[0].picPath
                this.addWebsiteForm.picName = val[0].picName
            },
            closePicShow() {//关闭组件弹框====供选择图片弹窗组件调用
                this.choosePicShow = false;
            },
        }
    }
</script>

<style scoped>
    .text-right {
        width: 70%;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        padding-left: 40px;
    }
    .text-right>p{
        line-height: 40px;
        text-align: left;
    }

    .breadcrumb {
        font-size: 18px;
        float: left;
    }

    .container {
        padding: 0 20px;
        height: 100%;
        position: relative;
    }

    .item {
        margin: 0 auto;
        font-weight: bold;
    }

    .item_static {
        margin-top: 70px;
        width: 300px;
        height: 80px;
        border: 1px solid rgba(8, 74, 135, 0.5);
        border-radius: 5px;
        text-align: center;
        font-size: 18px;
        line-height: 60px;
    }

    .item_static.active {
        border: 1px solid #42b983;
    }

    .item_static:hover {
        cursor: pointer;
    }

</style>
