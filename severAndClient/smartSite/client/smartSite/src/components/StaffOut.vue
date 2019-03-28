<template>
    <div class="container">
        <div class="btns">
            <el-form :inline="true" v-model="topForm" style="text-align: left;">
                <el-form-item label="外出人名称">
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
                <el-button class="search" @click="searchOutRecord"> 查 询</el-button>
                <download-excel style="display: inline-block"
                        :data = "tableData"
                        :fields ='json_fields'
                        name = "员工外出统计表.xls"
                >
                    <el-button title="导出当前页"> 导 出</el-button>
                </download-excel>

                <el-button class="record" icon="el-icon-edit" @click="handleRecord"> 外出登记</el-button>
            </el-form>
        </div>
        <div>
            <el-table
                    row-class-name="tableTr"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="recordPersonName"
                        label="外出人名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="replacePersonName"
                        label="代班人名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="startTime"
                        :formatter="formatterTime"
                        label="外出开始时间">
                </el-table-column>

                <el-table-column
                        align="center"
                        prop="endTime"
                        :formatter="formatterTime"
                        label="外出结束时间">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="userName"
                        label="登记人">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="createAt"
                        :formatter="formatterTime"
                        label="登记时间">
                </el-table-column>
                <el-table-column
                        v-if="delete1"
                        align="center"
                        prop="createAt"
                        label="操作">
                    <template slot-scope="scope">
                        <span class="btn">
                            <i class="el-icon-delete" title="删除" style="cursor: pointer;color:red;" @click="delStaffOut(scope.row)"></i>
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
                title="外出登记"
                :visible.sync="outRecordForm.showDialog"
                width="40%"
        >
            <el-form label-position="right" label-width="220px"  :model="outRecordForm">
                <el-form-item label="登记人姓名"   prop="userName" style="text-align: left;" >
                        <el-input style="width: 217px;" v-model="outRecordForm.userName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="外出人姓名"  prop="recordPersonName"  :rules="[{ required: true, message: '请输入外出人姓名', trigger: 'blur' }]">
                    <el-col :span="16"  style="text-align: left;">
                        <el-select v-model="outRecordForm.recordPersonName"  @change="changeRecord"  filterable placeholder="请选择">
                            <el-option
                                    v-for="item in userData"
                                    :key="item._id"
                                    :label="item.userName"
                                    :value="item._id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="代班人姓名"  prop="replacePersonName"  :rules="[{ required: true, message: '请输入代班人姓名', trigger: 'blur' }]">
                    <el-col :span="16" style="text-align: left;">
                        <el-select v-model="outRecordForm.replacePersonName" @change="changeReplace" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in userData"
                                    :key="item._id"
                                    :label="item.userName"
                                    :value="item._id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="外出开始时间"  prop="startTime"   :rules="[{ required: true, message: '请选择外出开始时间', trigger: 'blur' }]">
                    <el-col :span="16">
                        <el-date-picker
                                v-model="outRecordForm.startTime"
                                type="datetime"
                                prefix-icon="el-icon-date"
                                placeholder="选择外出开始时间">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                 <el-form-item label="外出结束时间"   prop="endTime"  :rules="[{ required: true, message: '请选择外出结束时间', trigger: 'blur' }]">
                     <el-col :span="16">
                         <el-date-picker
                                 v-model="outRecordForm.endTime"
                                 type="datetime"
                                 prefix-icon="el-icon-date"
                                 placeholder="选择外出结束时间">
                         </el-date-picker>
                     </el-col>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitRecord" >提交</el-button>
                    <el-button @click="outRecordForm.showDialog = false">取 消</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'staff-out',//员工外出
        components: {},
        mounted () {
            this.init()
        },
        data () {
            return {
                delete1:false,
                userData:[//用户列表
                ],
                PageInfo:{//外出信息分页
                    currentPage:1,
                    pageSize:9,
                    count:0,
                },
                outRecordForm:{//外出登记表单
                    showDialog:false,
                    recordPersonId:'',//外出人员Id
                    recordPersonName:'',//外出人员名称
                    userName:'',//用户名称
                    userId:'',//用户iD
                    replacePersonName:'',//代班人员
                    replacePersonId:'',//代班Id
                    startTime:'',//开始时间
                    endTime:''//结束时间
                },
                tableData: [{
                        createAt: "2019-03-20T08:57:09.730Z",
                        endTime: "2019-03-30T16:00:00.000Z",
                        recordPersonId: "",
                        recordPersonName: "杨超林",
                        replacePersonId: "",
                        replacePersonName: "林邱恒",
                        startTime: "2019-03-20T08:59:43.000Z",
                        userId: "",
                        userName: "admin"
                        }
                    ],
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
                    timeRange: null
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
            init () {
                this.delete1=sessionStorage.getItem('role')==='super'&&sessionStorage.getItem('out')==='true'?true:false;
                this.getRecordData();
                this.getUserData();
            },
            getUserData(){//获取
                this.request({
                    url:'user/getUsersName',
                },(data)=>{
                   this.userData=data.data;
                })
            },
            getRecordData(){//获取数据
                this.request({
                    url:'outRecord/getRecords',
                    data:{
                        pageSize: this.PageInfo.pageSize,
                        currentPage: this.PageInfo.currentPage
                    }
                },(data)=>{
                       this.tableData=data.data?data.data:[];
                       this.PageInfo.count=data.count?data.count:0;
                })

            },
            changeReplace(val){//change代班人

                let user=this.userData.find((item)=>{
                    return item._id===val
                })
                this.outRecordForm.replacePersonName=user.userName
            },
            changeRecord(val){//change代班人
                let user=this.userData.find((item)=>{
                    return item._id===val
                })
                this.outRecordForm.recordPersonName=user.userName
            },
            handleRecord(){//点击外出登记
                this.outRecordForm.showDialog=true;
                this.outRecordForm.userName=sessionStorage.getItem('userName');
            },
            submitRecord(){//提交登记员工外出
                this.request({
                    url:'outRecord/addRecords',
                    data:{...this.outRecordForm}
                },(data)=>{
                   this.getRecordData();
                   this.outRecordForm={//外出登记表单
                       showDialog:false,
                       recordPersonId:'',//外出人员Id
                       recordPersonName:'',//外出人员名称
                       userName:'',//用户名称
                       userId:'',//用户iD
                       replacePersonName:'',//代班人员
                       replacePersonId:'',//代班Id
                       startTime:'',//开始时间
                       endTime:''//结束时间
                   };
                })
            },
            currentPageChange(val){//当前页更改
                this.PageInfo.currentPage=val;
                this.getRecordData();
            },
            formatterTime(row,column,val){//格式化表格状态
                return this.formatDate(val);
            },
            delStaffOut(row){//触发删除弹框
                console.log(row);
                this.$confirm('此操作将永久删除 '+row.recordPersonName+' 的外出记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.request({
                        url: 'outRecord/delRcord',
                        data:{
                            _id:row._id
                        }
                    }, async(res) => {
                        this.getRecordData()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            searchOutRecord(){//搜索外出登记记录
                console.log(this.topForm.name);
                let name=this.topForm.name;
                let timerange=this.topForm.timeRange!=null?this.topForm.timeRange.length:0;
                let startTime=this.topForm.timeRange!=null?this.topForm.timeRange[0]:'1990-01-01';
                let endTime=this.topForm.timeRange!=null?this.topForm.timeRange[1]:'3990-01-01';
                if(name||timerange){
                    this.request({
                        url:'outRecord/searchRecords',
                        data:{name:this.topForm.name,startTime:startTime,endTime:endTime,...this.PageInfo,currentPage:1}
                    },(data)=>{
                        this.tableData=data.data?data.data:[];
                        this.PageInfo.count=data.count?data.count:0;
                    })
                }else{
                    this.PageInfo.currentPage=1;
                    this.getRecordData()
                }
            }
        }
    }
</script>

<style scoped>
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
        width: 120px !important;
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

</style>
