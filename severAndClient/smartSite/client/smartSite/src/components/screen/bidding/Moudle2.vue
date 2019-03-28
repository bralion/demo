<template>
    <div style="height:100%;width:100%;background-color:#ffffff;">
        <p style="line-height: 45px;font-size:45px;padding-top: 40px;font-family:KaiTi;font-weight: bold">
            {{currentData.title}}</p>
        <table class="table">
            <tr>
                <td :width="currentData.width">{{currentData.line1Title}}</td>
                <td>{{currentData.line1Value}}</td>
            </tr>
            <tr>
                <td :width="currentData.width">{{currentData.line2Title}}</td>
                <td>{{currentData.line2Value}}</td>
            </tr>
            <tr>
                <td :width="currentData.width">{{currentData.line3Title}}</td>
                <td>{{currentData.line3Value}}</td>
            </tr>
            <tr>
                <td :width="currentData.width">{{currentData.line4Title}}</td>
                <td>{{currentData.line4Value}}</td>
            </tr>
            <tr>
                <td :width="currentData.width">{{currentData.line5Title}}</td>
                <td>{{currentData.line5Value}}</td>
            </tr>

        </table>
        <p style="text-align: right;margin-right: 10%;">备注：请各管理机构在开标前到五楼现场管理处领取工作牌</p>
    </div>
</template>

<script>
    export default {
        name: 'moudle1',
        components: {},
        props: {
            showData: {
                type: Object
            },
        },
        watch: {
            showData: {
                handler (new1, old1) {
                    this.currentData = new1
                },
                deep: true
            }
        },
        mounted () {
            //获取当前版本号  如果和version不一致则请求数据库获取配置信息  更新页面
            this.init()
        },
        data () {
            return {
                currentData: {
                    // line1Title: "开标场地",
                    // line1Value: "招标室1",
                    // line2Title: "项目名称",
                    // line2Value: "招标室1",
                    // line3Title: "招标人",
                    // line3Value: "林胖子",
                    // line4Title: "代理机构",
                    // line4Value: "数之联",
                    // line5Title: "标书收取截止时间及开标时间",
                    // line5Value: "2019/01/31-09:30",
                    // moudleId: "bidding1",
                    // roomId: 1,
                    // title: "龙泉驿区公共资源交易中心开标场地使用情况",
                    // width: 220,
                },//展示数据的data
                roomNum:1,
                version:0,
                equipmentId:'bidding',
                defaultMoudle:'bidding2',
                timer:''
            }
        },
        methods: {
            init () {
                if(this.showData){//区分是编辑还是展示
                    return
                }
                this.checkInfo();
                setInterval(this.checkInfo,3000);
            },
            checkInfo(){//检查版本信息
                this.request({
                    url: 'equipment/getBasicInfo',
                    data: {
                        equipmentId: this.equipmentId
                    }
                }, (res) => {
                    if (res.data.currentMoudleId != this.defaultMoudle) {//切换了模板
                        this.$router.push('/bidding/moudle1')
                        clearInterval(this.timer)
                    }
                    if (res.data.currentVersion > this.version) {
                        this.getDetailInfo(this.equipmentId, res.data.currentMoudleId, this.roomNum, res.data.currentVersion)
                    } else {
                        console.log('没变')
                    }
                });
            },
            getDetailInfo(equipmentId,currentMoudleId,roomNum,version){
                this.request({
                    url: 'equipment/getDetailInfo',
                    data: {
                        equipmentId: 'equipmentId',
                        currentMoudleId:currentMoudleId,
                        roomNum:roomNum
                    }
                }, (res) => {
                    this.defaultMoudle=currentMoudleId;
                    this.version=version;
                   this.currentData=res.data;
                });
            }
        }
    }
</script>

<style scoped>
    .table {
        font-family: KaiTi;
        font-size: 30px;
        width: 80%;
        margin: 60px auto;
    }

    .table > tr > td {
        vertical-align: middle;
        height: 120px;
        line-height: 40px;
    }
</style>
