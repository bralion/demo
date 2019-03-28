<template>
    <div class="container">
        <div class="btns">
            <el-form :inline="true" v-model="topForm" style="text-align: left;">
                <el-form-item label="项目名称">
                    <el-input v-model="topForm.name"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="topForm.timeRange"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions2">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="topForm.status" placeholder="场地选择">
                        <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button class="search" @click="searchUser"> 查 询</el-button>
            </el-form>
        </div>
        <div>
            <el-table
                    row-class-name="tableTr"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="projectName"
                        label="项目名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="startTime"
                        label="开始时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="endEvaluateTime"
                        label="结束时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="projectAddress"
                        label="场地">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="tenderingName"
                        label="招标人">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createAt"
                        label="详情">
                    <template slot-scope="scope">
                        <span class="btn">
                            <a  title="考勤详情"  @click="handleEdit(scope.row)"style="cursor: pointer;text-decoration:underline;color:#333399;">详情</a>
                        </span>
                    </template>

                </el-table-column>

            </el-table>
            <div class="paginationCon">
                <el-pagination
                        background
                        layout="prev, pager, next,total"
                        :current-page="PageInfo.currentPage"
                        :page-size="PageInfo.pageSize"
                        @current-change="currentPageChange"
                        :total="PageInfo.count">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                title="项目专家考勤详情"
                :visible.sync="editUserForm.showDialog"
                width="40%"
        >
            <div>考勤详情   <el-button>导出详情excle</el-button></div>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'jurisdiction-manage',//权限管理
        components: {},
        mounted () {
            this.init()
        },
        data () {
            return {
                roles:[//角色的选项
                    {label:'超级管理员',value:'super'},
                    {label:'管理员',value:'admin'},
                    {label:'普通用户',value:'user'},
                ],
                statusOptions:[//状态的选项
                    {label:'正常',value:'normal'},
                    {label:'暂停',value:'pause'},
                    {label:'请选择状态',value:''},
                ],
                PageInfo:{//外出信息分页
                    currentPage:1,
                    pageSize:9,
                    count:0,
                },
                addUserForm:
                    {
                        showDialog:false,
                        userName:'',
                        password:'',
                        status:'normal',//用户状态
                        jobPosition:'',//用户职位
                        role:'admin',//用户角色
                        jurisdiction:{//用户权限
                            web:true,//常用网站权限
                            view:true,//视图配置权限
                            expert:true,//专家考勤权限
                            out:true,//员工外出权限
                            res:true,//资源库权限
                            cdLibrary:true,//光盘库权限
                            jurisdiction:false,//权限系统权限
                        },}
                ,
                editUserForm:{
                    showDialog:false,
                    userName:'',
                    status:'normal',//用户状态
                    jobPosition:'',//用户职位
                    role:'admin',//用户角色
                    jurisdiction:{//用户权限
                        web:false,//常用网站权限
                        view:false,//视图配置权限
                        expert:false,//专家考勤权限
                        out:false,//员工外出权限
                        res:false,//资源库权限
                        cdLibrary:false,//光盘库权限
                        jurisdiction:false,//权限系统权限
                    },
                },
                tableData: [],
                json_fields: {
                    "创建时间":'createAt' ,
                    "结束时间":'endTime' ,
                    "外出人姓名":'recordPersonName' ,
                    "代班人姓名": 'replacePersonName',
                    '开始时间' : "startTime",
                    "用户名称":'userName',
                    '确认签字':'确认签字'
                },
                topForm: {
                    name: '',
                    timeRange: null,
                    status:'',
                },//页面上部的表单
                pickerOptions2: {//快捷选择日期使用
                    shortcuts: [{
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                },
            }
        },
        methods: {
            searchUser(){//搜索用户
                let name=this.topForm.name;
                let status=this.topForm.status;
                let timerange=this.topForm.timeRange!=null?this.topForm.timeRange.length:0;
                let startTime=this.topForm.timeRange!=null?this.topForm.timeRange[0]:'1990-01-01';
                let endTime=this.topForm.timeRange!=null?this.topForm.timeRange[1]:'3990-01-01';
                if(name||timerange||status){
                    this.request({
                        url:'user/searchUser',
                        data:{status:status,name:this.topForm.name,startTime:startTime,endTime:endTime,...this.PageInfo,currentPage:1}
                    },(data)=>{
                        this.tableData=data.data?data.data:[];
                        this.PageInfo.count=data.count?data.count:0;
                    })
                }else{
                    this.PageInfo.currentPage=1;
                    this.getProjectData()
                }

            },
            submitEditUser(){//提交编辑用户
                this.request({
                    url:'user/editUser',
                    data:{
                        ...this.editUserForm
                    }
                },(data)=>{
                    this.editUserForm={
                        showDialog:false,
                        userName:'',
                        status:'normal',//用户状态
                        jobPosition:'',//用户职位
                        role:'admin',//用户角色
                        jurisdiction:{//用户权限
                            web:false,//常用网站权限
                            view:false,//视图配置权限
                            expert:false,//专家考勤权限
                            out:false,//员工外出权限
                            res:false,//资源库权限
                            cdLibrary:false,//光盘库权限
                            jurisdiction:false,//权限系统权限
                        },};
                    this.getProjectData();
                })
            },
            handleEdit(row){//编辑用户
                console.log(row);
                this.editUserForm= {showDialog:false,
                    userName:'',
                    password:'',
                    status:'normal',//用户状态
                    jobPosition:'',//用户职位
                    role:'admin',//用户角色
                    jurisdiction:{//用户权限
                        web:true,//常用网站权限
                        view:true,//视图配置权限
                        expert:true,//专家考勤权限
                        out:true,//员工外出权限
                        res:true,//资源库权限
                        cdLibrary:true,//光盘库权限
                        jurisdiction:false,//权限系统权限
                    },...row}
                this.editUserForm.showDialog=true;

            },
            handleRefresh(row){//重启用户使用
                console.log(row)
                this.request({
                    url:'user/RefreshUser',
                    data:{
                        _id:row._id
                    }
                },(data)=>{
                    this.getProjectData();
                })
            },
            handlePause(row){//暂停用户使用
                console.log(row)
                this.request({
                    url:'user/pauseUser',
                    data:{
                        _id:row._id
                    }
                },(data)=>{
                    this.getProjectData();
                })
            },
            checkName(val){//检查用户名
                console.log(val,'用户名改变');
                this.request({url:'user/check',data:{userName:val}},(data)=>{
                    this.editUserForm.userName='';
                    this.addUserForm.userName='';
                })
            },
            filterRole(value, row) {
                return row.role === value;
            },
            formatterTime(row,column){//格式化表格状态
                return this.formatDate(row.lastLoginAt);
            },
            formatterRole(row,column){//格式化表格状态
                if(row.role==='super'){
                    return '超级管理员'
                }else if(row.role==='admin'){
                    return '管理员'
                }else if(row.role==='user'){
                    return '普通用户'
                }
            },
            selectRoleChange(val){//用户更改选项
                if(val==='admin'){
                    this.addUserForm.jurisdiction={
                        web:true,//常用网站权限
                        view:true,//视图配置权限
                        expert:true,//专家考勤权限
                        out:true,//员工外出权限
                        res:true,//资源库权限
                        cdLibrary:true,//光盘库权限
                        jurisdiction:false,//权限系统权限
                    }
                }else if(val==='super'){
                    this.addUserForm.jurisdiction={
                        web:true,//常用网站权限
                        view:true,//视图配置权限
                        expert:true,//专家考勤权限
                        out:true,//员工外出权限
                        res:true,//资源库权限
                        cdLibrary:true,//光盘库权限
                        jurisdiction:true,//权限系统权限
                    }
                }else if(val==='user'){
                    this.addUserForm.jurisdiction={
                        web:true,//常用网站权限
                        view:false,//视图配置权限
                        expert:false,//专家考勤权限
                        out:true,//员工外出权限
                        res:false,//资源库权限
                        cdLibrary:false,//光盘库权限
                        jurisdiction:false,//权限系统权限
                    }
                }
            },
            init () {
                this.getProjectData();
            },

            getProjectData(){//获取用户数据
                this.topForm={
                    name: '',
                    timeRange: null,
                    status:'',
                };
                this.request({
                    url:'project/getProject',
                    data:{
                        pageSize: this.PageInfo.pageSize,
                        currentPage: this.PageInfo.currentPage
                    }
                },(data)=>{
                    this.tableData=data.data?data.data:[];
                    this.PageInfo.count=data.count?data.count:0;
                })

            },
            handleRecord(){//点击外出登记
                this.addUserForm.showDialog=true;
            },
            submitAddUser(){//提交登记员工外出
                this.request({
                    url:'user/save',
                    data:{...this.addUserForm}
                },(data)=>{
                    this.getProjectData();
                    this.addUserForm= {
                        showDialog:false,
                        userName:'',
                        password:'',
                        status:'normal',//用户状态
                        jobPosition:'',//用户职位
                        role:'admin',//用户角色
                        jurisdiction:{//用户权限
                            web:true,//常用网站权限
                            view:true,//视图配置权限
                            expert:true,//专家考勤权限
                            out:true,//员工外出权限
                            res:true,//资源库权限
                            cdLibrary:true,//光盘库权限
                            jurisdiction:false,//权限系统权限
                        }
                    }
                })
            },
            currentPageChange(val){//当前页更改
                this.PageInfo.currentPage=val;
                this.getProjectData();
            },
            delUser(row){
                this.$confirm('此操作将永久删除用户 '+row.userName+' 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.request({
                        url: 'user/deleteUser',
                        data:{
                            _id:row._id,
                            userName:row.userName
                        }
                    }, async(res) => {
                        this.getProjectData()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .normal{
        display: inline-block;
        height: 6px;
        width: 6px;
        background: green;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
    }
    .logOut{
        display: inline-block;
        height: 6px;
        width: 6px;
        background: red;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
    }
    .pause{
        display: inline-block;
        height: 6px;
        width: 6px;
        background: yellow;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
    }
    .statusBtn{
        display: inline-block;
        width: 80px;
        height: 26px;
        line-height:26px;
        font-size: 12px;
        border-radius:13px;
        border: 1px solid #cccccc;
        vertical-align: middle;
    }
    .statusBtn-success{
        border: 1px solid green;
    }
    .statusBtn-warning{
        border: 1px solid yellow;
    }
    .statusBtn-err{
        border: 1px solid red;
    }
    .paginationCon{
        position: absolute;
        bottom: 0;
        width: 100%;
    }
    .btns > .el-button {
        width: 110px;
    }

    .search {
        background-color: #46C4D3;
        color: #ffffff;
    }

    .record {
        background-color: #46C4D3;
        color: #ffffff;
        float: right;
        width: 100px !important;
    }

    .del {
        color: #9FA9BA;
    }

    .del:hover {
        background-color: #f36c9d;
        color: #ffffff;
        border: 1px solid #f36c9d;
    }

    .container >>> .el-form-item__label {
        font-size: 16px;
    }

    .container >>> .el-button {
        width: 100px;
    }

    /*表格样式覆盖--start*/
    .container >>> .el-table{
        background: transparent;
    }
    .container >>> thead>tr>th{
        background: transparent;
    }
    .container >>> thead>tr{
        background: transparent;
    }
    .container >>> .el-table td{
        border-bottom: 10px solid #f2f5f8;
    }
    .container >>>.el-table--border::after, .el-table--group::after, .el-table::before {
        content: '';
        position: absolute;
        background-color: transparent;
        z-index: 1;
    }
    .container >>> .cell{
        line-height: 39px;
        font-size: 16px;
    }
    /*表格样式覆盖--end*/
    .container >>> .el-dialog__body .el-input__inner{
        line-height: 35px;
        height: 35px;
    }
    .container >>> .el-dialog__body .el-date-editor{
        width: 100%;
    }

    .container >>> .el-dialog__body{
        padding: 50px 20px;
    }
    .icon-pause{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("../assets/pause.svg") no-repeat 100% 100%;
        position: relative;
        top:2px;
    }
    .btn{
        margin-left: 15px;
    }

</style>
