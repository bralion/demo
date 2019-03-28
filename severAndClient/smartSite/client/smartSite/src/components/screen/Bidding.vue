<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home/viewManage/viewManageHome' }">配置首页</el-breadcrumb-item>
            <el-breadcrumb-item>招投标室模板配置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-popover
                style="position: absolute;right: 380px; top:-6px;"
                placement="bottom"
                width="252"
                trigger="click"
                v-model="isShow"
        >
            <div>
                <div @click="changeMoudle('bidding1')" class="module" :class="{select:current=='bidding1'}">模板1</div>
                <div @click="changeMoudle('bidding2')" class="module" :class="{select:current=='bidding2'}">模板2</div>
            </div>
            <el-button size="mini" slot="reference">选择模板</el-button>
        </el-popover>
        <el-button style="position: absolute;right: 300px; top:-6px;" size="mini" @click="changeStatus">
            {{editStatus=='look'?'编辑':'预览'}}
        </el-button>
        <span style="position: absolute;right: 160px; top:0px;" v-if="current==deafultModule">当前为默认模板</span>
        <span style="position: absolute;right: 160px; top:0px;" v-if="current!=deafultModule" @click="setDefault">设置为默认模板</span>
        <div style="margin-top: 20px;">
            <moudle1 v-if="current==='bidding1'" class="scale" :class="{edit:editStatus=='edit'}"
                     :showData="showData"></moudle1>
            <moudle2 v-if="current==='bidding2'" class="scale" :class="{edit:editStatus=='edit'}"
                     :showData="showData"></moudle2>
        </div>
        <div class="editContanier" v-if="editStatus=='edit'">
            <el-form ref="showData" :model="showData" label-width="140px" label-position="left" size="mini">
                <el-form-item label="标题：">
                    <el-input v-model="showData.title"></el-input>
                </el-form-item>
                <el-form-item label="表格第一行：">
                    <el-input v-model="showData.line1Title"></el-input>
                </el-form-item>
                <el-form-item label="表格第二行：">
                    <el-input v-model="showData.line2Title"></el-input>
                </el-form-item>
                <el-form-item label="表格第三行：">
                    <el-input v-model="showData.line3Title"></el-input>
                </el-form-item>
                <el-form-item label="表格第四行：">
                    <el-input v-model="showData.line4Title"></el-input>
                </el-form-item>
                <el-form-item label="表格第五行：">
                    <el-input v-model="showData.line5Title"></el-input>
                </el-form-item>
                <el-form-item label="宽度：">
                    <el-input v-model="showData.width"></el-input>
                </el-form-item>
                <el-button size="mini" @click="save">保存</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Moudle1 from './bidding/Moudle1'
    import Moudle2 from './bidding/Moudle2'

    export default {
        name: 'bidding',
        components: {Moudle2, Moudle1},
        mounted () {
            this.init()
        },
        data () {
            return {
                showData: {
                    line1Title: "开标场地",
                    line1Value: "招标室1",
                    line2Title: "项目名称",
                    line2Value: "招标室1",
                    line3Title: "招标人",
                    line3Value: "林胖子",
                    line4Title: "代理机构",
                    line4Value: "数之联",
                    line5Title: "标书收取截止时间及开标时间",
                    line5Value: "2019/01/31-09:30",
                    moudleId: "bidding1",
                    title: "龙泉驿区公共资源交易中心开标场地使用情况",
                    width: 220,
                },//展示数据的data
                editStatus: 'look',//预览状态 look   编辑状态  edit
                current: 'bidding1',//当前展示的模板
                deafultModule: 'bidding1',//数据库保存的使用模板
                isShow: false,//控制模板选择弹框显示与否
                equipmentId: 'bidding',//设备类型
                first: true,//是不是初始化页面
            }
        },
        methods: {
            init () {
                this.checkInfo()
            },
            changeMoudle (val) {//改变模板
                this.current = val
                this.isShow = false
                this.checkInfo()
            },
            changeStatus () {
                this.editStatus = this.editStatus == 'look' ? 'edit' : 'look'
            },
            checkInfo () {//检查版本信息

                this.request({
                    url: 'equipment/getBasicInfo',
                    data: {
                        equipmentId: 'bidding'
                    }
                }, (res) => {
                    if (this.first === true) {
                        this.current = res.data.currentMoudleId
                        this.first = false
                    }
                    this.deafultModule = res.data.currentMoudleId
                    this.getDetailInfo(res.data.equipmentId, this.current, 1)
                })
            },
            getDetailInfo (equipmentId, currentMoudleId, roomNum) {//默认房间号为1
                this.request({
                    url: 'equipment/getDetailInfo',
                    data: {
                        equipmentId: 'equipmentId',
                        currentMoudleId: currentMoudleId,
                        roomNum: roomNum
                    }
                }, (res) => {
                    this.showData = res.data
                })
            },
            setDefault () {//设置为默认模板
                var currentMoudleName = '模板2'
                if (this.current == 'bidding1') {
                    currentMoudleName = '模板1'
                }
                if (this.current != this.deafultModule) {
                    this.request({
                        url: 'equipment/setDeafultModule',
                        data: {
                            moudleId: this.current,
                            equipmentId: this.equipmentId,
                            currentMoudleName: currentMoudleName
                        }
                    }, (res) => {
                        console.log(res)
                    })
                } else {
                    console.log('当前模板已经是默认模板')
                }
            },
            save () {//保存模板参数
                console.log(this.showData);
                this.request({
                    url: 'equipment/saveModule',
                    data: {
                        equipmentId: this.equipmentId,
                        ...this.showData
                    }
                }, (res) => {
                    console.log(res)
                })
            }
        }
    }
</script>

<style scoped>
    .breadcrumb {
        font-size: 18px;
    }

    .container {
        position: relative;
    }

    .module {
        display: inline-block;
        width: 100px;
        height: 100px;
        margin-right: 10px;
        line-height: 100px;
        text-align: center;
        border-radius: 4px;
        background: #eeeeee;
    }

    .select {
        border: 1px solid #3a8ee6;
    }

    .scale {
        -moz-transform: scale(0.8);
        -ms-transform: scale(0.8);
        -webkit-transform: scale(0.8);
        -o-transform: scale(0.8);
        transition: all 0.5s;
        -moz-transition: all 0.5s;
        -webkit-transition: all 0.5s;
    }

    .edit {
        transform-origin: 0 0;
        -moz-transform: scale(0.6);
        -ms-transform: scale(0.6);
        -webkit-transform: scale(0.6);
        -o-transform: scale(0.6);
    }

    .editContanier {
        transition: all 0.5s;
        -moz-transition: all 0.5s;
        -webkit-transition: all 0.5s;
        margin-top: 20px;
        width: 450px;
        position: absolute;
        right: 50px;
        top: 20px;
        padding: 20px;
        background: #ffffff;
        border-radius: 4px;
    }
</style>
