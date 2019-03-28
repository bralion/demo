<template>
    <div class="container">
        <ul class="items">
            <li class="item" v-for="item in showData">
                <div class="item-contanier" @dblclick="jump(item.jumpPath,item.userName)">
                    <div class="item-top" :style="item.picPath?{background:'url('+item.picPath.replace(/\\/g, '/')+')',backgroundSize:'100% 100%'}:{}">
                        <el-button size="mini"
                                   v-clipboard:copy="item.userName"
                                   v-clipboard:success="copyNameSuccess">
                            复制用户名
                        </el-button>
                        <el-button
                                size="mini"
                                v-clipboard:copy="item.password"
                                v-clipboard:success="copyPasswdSuccess">
                            复制密码
                        </el-button>
                    </div>
                    <p class="item-title">{{item.websiteName}}</p>
                </div>
            </li>
            <li class="item" @click="addWebsite">
                <div class="item-contanier" style="border: none;">
                    <img src="../assets/add1.png" class="add" alt="" width="284" height="180">
                </div>
            </li>
        </ul>
        <el-dialog
                title="添加网站"
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
                <el-form-item label="用户名" >
                    <el-input v-model="addWebsiteForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" >
                    <el-input v-model="addWebsiteForm.password"></el-input>
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
    import ChoosePic from './base/ChoosePic'
    export default {
        name: 'website-manage',
        components: {
            ChoosePic
        },
        mounted () {
            this.init()
        },
        data () {
            return {
                showData: [],//网站列表
                addWebsiteForm:{//添加网站表单
                    websiteName:'',//网站名称
                    picPath:'',//图片地址
                    picName:'',//图片名称
                    jumpPath:'',//跳转地址
                    userName:'',//用户名称
                    password:'',//密码
                    showDialog: false,//模态框状态
                },
                choosePicShow:false,//选择图片弹框
            }
        },
        methods: {
            init () {
                this.getWebsites()
            },
            jump (url, userName) {//跳转一个新页面
                this.$copyText(userName).then((e) => {
                    this.$message({
                        type: 'success', message: '复制用户名成功！'
                    })
                }, (e) => {
                    this.$message({
                        type: 'warning', message: '复制用户名失败！'
                    })
                    console.log(e)
                })
                setTimeout(() => {
                    window.open(url)
                }, 1000)
            },
            copyNameSuccess (val) {
                this.$message({
                    type: 'success',
                    message: '复制用户名成功！'
                })
            },
            copyPasswdSuccess (val) {
                this.$message({
                    type: 'success',
                    message: '复制密码成功！'
                })
            },
            getWebsites () {
                this.request({
                    url: 'websites/getWebsites',
                }, (res) => {
                    console.log(res.data)
                    this.showData = res.data
                })
            },
            startAddWebsite () {//添加网站
                this.request({
                    url: 'websites/addWebsite',
                    data:this.addWebsiteForm
                }, (res) => {
                    this.addWebsiteForm={websiteName:'',//网站名称
                        picPath:'',//图片地址
                        picName:'',//图片名称
                        jumpPath:'',//跳转地址
                        userName:'',//用户名称
                        password:'',//密码
                        showDialog: false,}//模态框状态
                    this.getWebsites();
                })
            },
            addWebsite(){
                this.addWebsiteForm.showDialog=true;
            },
            closePicShow() {//关闭组件弹框====供选择图片弹窗组件调用
                this.choosePicShow = false;
            },
            confirmSelect (val) {//当前选中的图片
                this.addWebsiteForm.picPath = val[0].picPath
                this.addWebsiteForm.picName = val[0].picName
            },
        }
    }
</script>

<style scoped>
    .container {
        padding: 0 20px;
        height: 100%;
        position: relative;
    }

    .items {
        width: 100%;
        font-size: 0;
        letter-spacing: -4px;
        text-align: left;
    }

    .item {
        display: inline-block;
        width: 316px;
        height: 200px;
        margin-top: 15px;
        padding: 10px 15px;
        vertical-align: text-bottom;
    }

    .item:hover {
        cursor: pointer;
    }

    .item-contanier {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        border-radius: 4px;
        border: 1px solid #E6EAEE;
    }

    .item-top {
        width: 100%;
        height: 120px;
        border-radius: 4px;
        text-align: right;
        padding-top: 86px;
        background: url('../assets/bg.png') no-repeat;
        background-size: 100% 100%;
        padding-right: 15px;
    }

    .item-title {
        font-size: 18px;
        line-height: 60px;
        color: #424D58;
        letter-spacing: normal;
        text-align: center;
    }
</style>
