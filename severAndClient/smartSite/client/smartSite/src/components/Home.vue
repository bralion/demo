<template>
    <el-container>
        <el-aside width="260px">
            <div class="logo">
                <div>
                    智能场地系统
                </div>
                <div class="subtitle">
                    intelligent site system
                </div>
            </div>
            <el-menu default-active="/home/websiteManage" class="el-menu-vertical-demo" :collapse="isCollapse"
                     :router="true">
                <el-menu-item index="/home/websiteManage" v-if="web==='true'">
                    <div class="menu-item">
                        <!--<span class="aside-bg">11</span>-->
                        <div class="menu-item-bg useWebSitesBg"></div>
                        <p>常用网站</p>
                    </div>
                </el-menu-item>
                <el-menu-item index="/home/viewManage" v-if="view==='true'">
                    <div class="menu-item">
                        <!--<span class="aside-bg">11</span>-->
                        <div class="menu-item-bg viewManageBg"></div>
                        <p>视图配置</p>
                    </div>
                </el-menu-item>
                <el-menu-item index="/home/expertManage" v-if="expert==='true'">
                    <div class="menu-item">
                        <!--<span class="aside-bg">11</span>-->
                        <div class="menu-item-bg expertManageBg"></div>
                        <p>专家考勤</p>
                    </div>
                </el-menu-item>
                <el-menu-item index="/home/staffOut" v-if="out==='true'">
                    <div class="menu-item">
                        <!--<span class="aside-bg">11</span>-->
                        <div class="menu-item-bg staffOutBg"></div>
                        <p>员工外出</p>
                    </div>
                </el-menu-item>
                <el-menu-item index="/home/resourceLibrary" v-if="res==='true'">
                    <div class="menu-item">
                        <!--<span class="aside-bg">11</span>-->
                        <div class="menu-item-bg resourceLibraryBg"></div>
                        <p>资源库</p>
                    </div>
                </el-menu-item>
                <el-menu-item index="/home/cdLibrary" v-if="cdLibrary==='true'">
                    <div class="menu-item">
                        <!--<span class="aside-bg">11</span>-->
                        <div class="menu-item-bg cdLibraryBg"></div>
                        <p>光盘库</p>
                    </div>
                </el-menu-item>
                <el-menu-item index="/home/jurisdictionManage" v-if="jurisdiction==='true'">
                    <div class="menu-item">
                        <!--<span class="aside-bg">11</span>-->
                        <div class="menu-item-bg jurisdictionManageBg"></div>
                        <p>权限管理</p>
                    </div>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container class="container-left">
            <el-header class="header">
                <!--日期-->
                <span class="date">{{date}}</span>
                <!--时间-->
                <span class="clock">
                    <span class="time">{{time[0]}}</span>
                    <span class="time">{{time[1]}}</span>
                    <span class="timeInterval">:</span>

                    <span class="time">{{time[2]}}</span>
                    <span class="time">{{time[3]}}</span>
                    <span class=" timeInterval">:</span>

                    <span class="time">{{time[4]}}</span>
                    <span class="time">{{time[5]}}</span>
                </span>

                <span class="userName">{{userName}}</span>
                <span class="person"></span>
                <span class="quit" @click="handleQuit"></span>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>


<script>
    export default {
        data () {
            return {
                isCollapse: false,
                userName: '',
                date: '1990-01-01',
                time: '000000',
                web:false,
                res:false,
                expert:false,
                out:false,
                view:false,
                jurisdiction:false,
                cdLibrary:false,
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                this.userName = sessionStorage.getItem('userName');
                this.web=sessionStorage.getItem('web');
                this.res=sessionStorage.getItem('res');
                this.expert=sessionStorage.getItem('expert');
                this.out=sessionStorage.getItem('out');
                this.view=sessionStorage.getItem('view');
                this.jurisdiction=sessionStorage.getItem('jurisdiction');
                this.cdLibrary=sessionStorage.getItem('cdLibrary');
                console.log(this.web)
                this.startTime()
            },
            //时间滚动
            startTime () {
                var today = new Date()
                var Y = today.getFullYear()
                var M = today.getMonth() + 1
                var D = today.getDate()
                var H = today.getHours()
                var mm = today.getMinutes()
                var s = today.getSeconds()
                if (s < 10) {
                    s = '0' + s
                }
                if (mm < 10) {
                    mm = '0' + mm
                }
                if (H < 10) {
                    H = '0' + H
                }
                if (M < 10) {
                    M = '0' + M
                }
                if (D < 10) {
                    D = '0' + D
                }
                // this.time=""+Y+"-"+M+'-'+D+' '+H+":"+mm+':'+s
                this.time = '' + H + mm + s
                this.date = '' + Y + '年' + M + '月' + D + '日'
                setTimeout(this.startTime, 500)
            },
            //点击退出
            handleQuit(){
                sessionStorage.setItem('userName','');
                sessionStorage.setItem('userId','');
                sessionStorage.setItem('role','');
                sessionStorage.setItem('web', '')
                sessionStorage.setItem('cdLibrary', '')
                sessionStorage.setItem('res', '')
                sessionStorage.setItem('expert','')
                sessionStorage.setItem('out', '')
                sessionStorage.setItem('view', '')
                sessionStorage.setItem('jurisdiction','')
                this.$router.push('/login');
            }

        }
    }
</script>

<style scoped>
    .quit {
        line-height: 90px;
        vertical-align: middle;
        display: inline-block;
        margin-right: 40px;
        width: 28px;
        height: 28px;
        background: url("../assets/quit.png");
    }

    .userName {
        margin-right: 10px;
        font-size: 18px;
        color: #999999;
        font-family: 'religion27';
    }

    .person {
        margin-right: 10px;
        line-height: 90px;
        vertical-align: middle;
        display: inline-block;
        width: 40px;
        height: 40px;
        background: url("../assets/person.png");
    }

    .date {
        font-size: 20px;
        margin-right: 20px;
        color: #939FAE;
        font-family: 'religion27';
    }

    .clock {
        line-height: 35px;
        margin-right: 80px;
    }

    .time {
        font-family: 'LcdD';
        font-size: 50px;
        width: 27px;
        text-align: right;
        display: inline-block;
        position: relative;
        z-index: 2;
        color: #939FAE;
    }

    .time:after {
        float: right;
        content: '';
        display: inline-block;
        width: 27px;
        height: 20px;
        background-color: #ECF1FA;
        position: absolute;
        left: 5px;
        top: -6px;
        z-index: -1;
        border-radius: 4px 4px 0px 0px;
        border: 1px solid #C6CCDC;
    }

    .time:before {
        float: right;
        content: '';
        display: inline-block;
        width: 27px;
        height: 20px;
        background-color: #ECF1FA;
        position: absolute;
        top: 20px;
        left: 5px;
        z-index: -1;
        border-radius: 0px 0px 4px 4px;
        border: 1px solid #C6CCDC;
    }

    .timeInterval {
        font-family: 'LcdD';
        font-size: 50px;
        width: 10px;
        text-align: right;
        display: inline-block;
        color: #939FAE;
    }

    .logo {
        background-color: #1d3653;
        font-size: 24px;
        padding-top: 9px;
        line-height: 50px;
        height: 90px;
        width: 100%;
        color: #47c7d6;
        font-weight: bold;
    }

    .subtitle {
        background-color: #1d3653;
        font-size: 14px;
        width: 100%;
        line-height: 30px;
        color: #a3abb5;
        position: relative;
        bottom: 5px;
    }

    .el-header {
        background-color: #ffffff;
        color: #333;
        text-align: right;
        line-height: 60px;
    }


    .el-header {
        height: 90px !important;
        line-height: 90px !important;
        font-size: 30px !important;
        border-bottom: 1px solid #B1B8CA;
    }

    .el-aside {
        color: #333;
        text-align: center;
        line-height: 200px;
        background-color: #345070;
    }

    .el-aside:after {
        display: block;
        position: absolute;
        top: 0;
        content: '';
        width: 50px;
        height: 100%;
        background: linear-gradient(to right, rgba(28, 43, 60, 0.6), rgba(28, 43, 60, 0.3), rgba(28, 43, 60, 0));
    }

    .el-main {
        background-color: #f2f5f8;
        color: #333;
        text-align: center;
    }

    body > .el-container {
        margin-bottom: 40px;
        background-color: #E9EEF3;
    }

    .el-aside {
        height: 100%;
    }

    .el-container {
        height: 100%;
    }

    .container-left {
        background-color: #E9EEF3;
    }

    .container-left:after {
        display: block;
        position: absolute;
        top: 0;
        content: '';
        width: 10px;
        height: 100%;
        background: linear-gradient(to right, rgba(28, 43, 60, 0.3), rgba(28, 43, 60, 0.1), rgba(28, 43, 60, 0));
    }

    .el-menu-vertical-demo {
        background-color: #345070;
    }

    .is-active {
        background-color: #46C4D3 !important;
    }

    .el-menu-item {
        height: 120px;
        line-height: 60px;
    }

    .el-menu-item:hover {
        background-color: #2c4867;
    }

    .el-menu {
        border-right: none;
    }

    .aside-bg {
    }

    .menu-item {
        width: 130px;
        height: 120px;
        margin-right: auto;
        display: inline-block;
        vertical-align: middle;
        border-bottom: 2px solid #405975;
        padding-top: 15px;
    }

    /*菜单标题*/
    .menu-item > p {
        color: #ffffff;
        font-size: 18px;
        font-family: MicrosoftYaHeiLight;
        white-space: pre-wrap;
        line-height: 30px;
    }

    .menu-item-bg {
        display: inline-block;
        width: 130px;
        height: 60px;
        background-size: 34px 34px;
    }

    .useWebSitesBg {
        background: url("../assets/aside/webSites.png") no-repeat 48px;
    }

    .el-menu-item.is-active .menu-item {
        border-bottom: none;
    }

    .el-menu-item.is-active .useWebSitesBg {
        background: url("../assets/aside-select/webSites.png") no-repeat 48px;
    }

    .viewManageBg {
        background: url("../assets/aside/viewManage.png") no-repeat 48px;
    }

    .el-menu-item.is-active .viewManageBg {
        background: url("../assets/aside-select/viewManage.png") no-repeat 48px;
    }

    .expertManageBg {
        background: url("../assets/aside/expertManage.png") no-repeat 48px;
    }

    .el-menu-item.is-active .expertManageBg {
        background: url("../assets/aside-select/expertManage.png") no-repeat 48px;
    }

    .staffOutBg {
        background: url("../assets/aside/staffOut.png") no-repeat 48px;
    }

    .el-menu-item.is-active .staffOutBg {
        background: url("../assets/aside-select/staffOut.png") no-repeat 48px;
    }

    .resourceLibraryBg {
        background: url("../assets/aside/resourceLibrary.png") no-repeat 48px;
    }

    .el-menu-item.is-active .resourceLibraryBg {
        background: url("../assets/aside-select/resourceLibrary.png") no-repeat 48px;
    }

    .cdLibraryBg {
        background: url("../assets/aside/cdLibrary.png") no-repeat 48px;
    }

    .el-menu-item.is-active .cdLibraryBg {
        background: url("../assets/aside-select/cdLibrary.png") no-repeat 48px;
    }

    .jurisdictionManageBg {
        background: url("../assets/aside/jurisdictionManage.png") no-repeat 48px;
    }

    .el-menu-item.is-active .jurisdictionManageBg {
        background: url("../assets/aside-select/jurisdictionManage.png") no-repeat 48px;
    }

</style>
