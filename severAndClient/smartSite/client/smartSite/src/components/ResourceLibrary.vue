<template>
    <div class="resource">
        <el-tabs v-model="activeName" @tab-click="handleClick" :before-leave="changeTabs">
            <el-tab-pane label="图片" name="first">
                <div class="btns">
                    <el-button class="upload" @click="handleUpload('img')"> 上 传</el-button>
                    <el-button class="del" @click="delImg" :disabled="editStyleNum==-1"> 删 除</el-button>
                    <el-input class="search"
                              placeholder="请输入图片名称"
                              v-model="imgWord">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="startSearchImg"
                           style="color: #788498;cursor: pointer;"></i>
                    </el-input>
                </div>
                <div style="height:100%;">
                    <ul class="image">
                        <li :class="{isEdit:editStyleNum==index}" class="imgItem" v-for="(item,index) in imgs">
                            <div v-if="editStyleNum==index" class="isEditIcon" @click="handleEditStart(index)"></div>
                            <div style="margin:  5%; width: 90%;height:150px;">
                                <img style="width: 100%;height:150px;" :src=item.picPath :alt="item.picDesc"
                                     @click="handleEditStyle(index)" @dblclick="showImg(item.picPath)">
                            </div>
                            <p v-if="item.createAt"><span class="bg-title" :title="item.picName">{{item.picName}}</span>
                                <span class="bgTime">{{item.createAt.slice(0,10)}}</span></p>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="视频" name="second">
                <div class="btns">
                    <el-button class="upload" @click="handleUpload('video')"> 上 传</el-button>
                    <el-button class="del"  @click="delVideo" :disabled="editStyleNum==-1"> 删 除</el-button>
                    <el-input class="search"
                              placeholder="请输入内容"
                              v-model="videoWord">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="startSearchVideo"
                           style="color: #788498;cursor: pointer;"></i>
                    </el-input>
                </div>
                <div style="height:100%;">
                    <ul class="image">
                        <li :class="{isEdit:editStyleNum==index}" class="imgItem" v-for="(item,index) in videos">
                            <div v-if="editStyleNum==index" class="isEditIcon" @click="handleEditStart(index)"></div>
                            <div style="margin:  5%; width: 90%;height:150px;position: relative;">
                                <img v-if="item.videoPicUrl" style="width: 100%;height:150px;" :src=item.videoPicUrl>
                                <img v-if="!item.videoPicUrl" style="width: 100%;height:150px;"
                                     src='../assets/defaultImg.jpg'>
                                <div class="video" :alt="item.videoName" @click="handleEditStyle(index)" @dblclick="playVideo(item)"></div>
                            </div>
                            <p v-if="item.createAt"><span class="bg-title"
                                                          :title="item.videoName">{{item.videoName}}</span> <span
                                    class="bgTime">{{item.createAt.slice(0,10)}}</span></p>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="新闻来源" name="third">新闻来源</el-tab-pane>
        </el-tabs>
        <!--图片分页-->
        <div class="paginationCon" v-if="activeName==='first'">
            <el-pagination
                    background
                    layout="prev, pager, next,total"
                    :current-page="imgPageInfo.currentPage"
                    @current-change="imgCurrentPageChange"
                    :total="imgPageInfo.count">
            </el-pagination>
        </div>
        <!--视频分页-->
        <div class="paginationCon" v-if="activeName==='second'">
            <el-pagination
                    background
                    layout="prev, pager, next,total"
                    :current-page="videoPageInfo.currentPage"
                    @current-change="videoCurrentPageChange"
                    :total="videoPageInfo.count">
            </el-pagination>
        </div>
        <el-dialog
                title="图片详情"
                :visible.sync="dialogVisible"
                width="40%"
        >
            <img :src="showImgUrl" style="width: 100%;height: 100%;" alt="">
        </el-dialog>
        <el-dialog
                title="视频播放"
                :visible.sync="videoPlayVisible"
                :before-close="closePlayer"
                width="40%"
        >
            <video controls="controls" ref="video" autoplay="autoplay" :src="showVideoUrl"
                   style="width: 100%;height: 100%;" alt=""></video>
        </el-dialog>
        <el-dialog
                title="图片上传"
                :visible.sync="uploadForm.showDialog"
                width="40%"
        >
            <el-form label-position="left" label-width="80px"  :model="uploadForm">
                <el-form-item label="图片描述" >
                    <el-input v-model="uploadForm.desc"></el-input>
                </el-form-item>
                <el-form-item label="图片选择">
                    <el-upload
                            ref="uploadImgRef"
                            class="upload-demo"
                            action=""
                            :auto-upload="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            accept="image/png,image/jpeg"
                            :before-remove="beforeRemove"
                            multiple
                            :limit="3"
                            :on-exceed="handleExceed"
                            :http-request='handleUpdateFile'
                            list-type="picture"
                            :file-list="uploadForm.fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="startUpload">提交</el-button>
                    <el-button @click="uploadForm.showDialog = false">取 消</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="图片编辑"
                :visible.sync="editForm.showDialog"
                width="40%"
        >
            <el-form label-position="left" label-width="80px" ref="editForm"  :model="editForm">
                <el-form-item label="图片描述" >
                    <el-input v-model="editForm.desc"></el-input>
                </el-form-item>
                <el-form-item label="图片名称" >
                    <el-input v-model="editForm.imgName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="startUpdateImg">提交</el-button>
                    <el-button @click="editForm.showDialog = false">取 消</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="删除图片"
                :visible.sync="delForm.showDialog"
                width="40%"
        >
            确定删除图片  {{delForm.imgName}}  ？
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="startDelImg">删除</el-button>
                    <el-button @click="delForm.showDialog = false">取 消</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="删除视频"
                :visible.sync="delVideoForm.showDialog"
                width="40%"
        >
            确定删除视频  {{delVideoForm.imgName}}  ？
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="startDelVideo">删除</el-button>
                    <el-button @click="delVideoForm.showDialog = false">取 消</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="视频上传"
                :visible.sync="uploadVideoForm.showDialog"
                width="40%"
        >
            <el-form label-position="left" label-width="80px" :model="uploadVideoForm">
                <el-form-item label="视频描述">
                    <el-input v-model="uploadVideoForm.desc"></el-input>
                </el-form-item>
                <el-form-item style="text-align: left" label="封面图片">
                    <el-input style="width:300px;" placeholder="请选择图片" v-model="uploadVideoForm.picName"
                              :disabled='true'></el-input>
                    <el-button @click="choosePicShow=true">选择图片作为封面</el-button>
                </el-form-item>
                <el-form-item style="text-align: left" label="视频选择">
                    <el-upload
                            ref="uploadVideoRef"
                            class="upload-demo"
                            action=""
                            :auto-upload="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            accept="video/mp4"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :http-request='handleUpLoadVideoFile'
                            :file-list="uploadVideoForm.fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip"><span style="color:red">*</span>只能上传mp4文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <choose-pic :number="1" :choosePicShow="choosePicShow" :closeShow="closePicShow"
                        :confirmSelect="confirmSelect"></choose-pic>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="startUploadVideo">提交</el-button>
                    <el-button @click="uploadVideoForm.showDialog = false">取 消</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import ChoosePic from './base/ChoosePic'

    export default {
        name: 'resource-library',//资源库
        components: {
            ChoosePic
        },
        mounted () {
            this.init()
        },
        data () {
            return {
                activeName: 'first',//激活的tab名称
                imgWord: '',//图片视图上的关键词====用于显示
                searchImgWord: '',//搜索图片的关键词===用于搜索
                videoWord: '',//视频视图上的关键词===用于显示
                searchVideoWord: '',//搜索视频的关键词===用于搜索
                dialogVisible: false,//展示详情的图片弹框
                showImgUrl: '',//展示详情的图片
                imgs: [],//展示的图片列表
                videos: [],//展示的视频列表,
                videoPic: '',//视频封面图片对象
                imgPageInfo: {//图片分页信息
                    count: 0,
                    currentPage: 1,
                    pageSize: 18
                },
                videoPageInfo: {//视频分页信息
                    count: 0,
                    currentPage: 1,
                    pageSize: 18
                },
                editStyleNum: -1,//当前单击需要编辑的图片index   --仅仅用来控制编辑样式  和控制删除
                editImgId: '',//当前单击需要编辑的图片id,
                choosePicShow: false,//选择图片弹框是否展示
                videoPlayVisible: false,//视频详情播放弹框
                showVideoUrl: '',//播放视频的地址
                uploadForm: {//图片上传的表单
                    desc: '',//图片描述
                    showDialog: false,
                    fileList: []//文件列表
                },
                editForm: {//图片编辑的表单
                    desc: '',//图片描述
                    imgName:'',//图片名称
                    id:'',//图片id
                    showDialog: false,//模态框状态
                },
                delForm:{//删除弹框
                    id:'',
                    imgName:'',//图片名称
                    showDialog:false
                },
                delVideoForm:{//删除弹框
                    id:'',
                    videoName:'',//图片名称
                    showDialog:false
                },
                uploadVideoForm: {//视频上传的表单
                    desc: '',//视频描述
                    picName: '',
                    picUrl: '',
                    showDialog: false,
                }
            }
        },
        methods: {
            init () {
                this.getImgs()
                this.getVideos()
            },
            handleClick (tab, event) {
                console.log(tab, event)
            },
            changeTabs (new1, old1) {
                if (new1 !== old1) {
                    this.editStyleNum = -1
                    this.searchImgWord = ''
                    this.searchVideoWord = ''
                    this.videoWord = ''
                    this.imgWord = ''
                }
            },
            showImg (url) {//双击图片   查看详情
                this.dialogVisible = true
                this.showImgUrl = url
            },
            handleUpload (type) {//点击上传图片
                if (type == 'img') {
                    this.uploadForm.showDialog = true
                } else {
                    this.uploadVideoForm.showDialog = true
                }
            },
            startUpload () {//开始上传图片
                this.$refs.uploadImgRef.submit()
                this.uploadForm.showDialog = false
            },
            startUploadVideo () {//开始上传图片
                this.$refs.uploadVideoRef.submit()
                this.uploadVideoForm.showDialog = false
            },
            handleRemove (file, fileList) {
                console.log(file, fileList)
            },
            handlePreview (file) {
                console.log(file)
            },
            handleExceed (files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
            },
            beforeRemove (file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`)
            },
            // 图片文件上传
            handleUpdateFile (content) {//上传图片
                let formData = new FormData()
                formData.append('file', content.file)

                let config = {
                    'Content-Type': 'multipart/form-data'
                }

                formData.append(
                    'data',
                    JSON.stringify({
                        ...this.uploadForm
                    })
                )
                // 请求
                this.request(
                    {
                        url: 'resourceLibrary/uploadImg',
                        formData: formData,
                        headers: config,
                        successText: true,
                    },
                    (data) => {
                        this.uploadForm.showDialog = false
                        this.uploadForm.desc = ''
                        this.uploadForm.fileList = []
                        this.getImgs()
                    }
                )
            },
            // 视频文件上传
            handleUpLoadVideoFile (content) {//上传视频
                let formData = new FormData()
                formData.append('file', content.file)

                let config = {
                    'Content-Type': 'multipart/form-data'
                }

                formData.append(
                    'data',
                    JSON.stringify({
                        ...this.uploadVideoForm
                    })
                )
                // 请求
                this.request(
                    {
                        url: 'resourceLibrary/uploadVideo',
                        formData: formData,
                        headers: config,
                    },
                    (data) => {
                        this.uploadForm.showDialog = false
                        this.uploadForm.desc = ''
                        this.uploadForm.fileList = []
                        this.getVideos()
                    }
                )
            },
            getImgs () {//获取页面图片
                if (this.searchImgWord) {//搜索图片
                    // 请求
                    this.request(
                        {
                            url: 'resourceLibrary/searchImgs',
                            data: {
                                keyWord: this.searchImgWord,
                                pageSize: this.imgPageInfo.pageSize,
                                currentPage: this.imgPageInfo.currentPage
                            }
                        },
                        (data) => {
                            this.imgs = data.data
                            this.imgPageInfo.count = data.count
                        }
                    )
                } else {//直接请求
                    this.request(
                        {
                            url: 'resourceLibrary/getImgs',
                            data: {
                                pageSize: this.imgPageInfo.pageSize,
                                currentPage: this.imgPageInfo.currentPage
                            }
                        },
                        (data) => {
                            this.imgs = data.data
                            this.imgPageInfo.count = data.count
                        }
                    )
                }

            },
            getVideos () {//获取页面视频
                if (this.searchVideoWord) {//搜索图片
                    // 请求
                    this.request(
                        {
                            url: 'resourceLibrary/searchVideos',
                            data: {
                                keyWord: this.searchVideoWord,
                                pageSize: this.videoPageInfo.pageSize,
                                currentPage: this.videoPageInfo.currentPage
                            }
                        },
                        (data) => {
                            this.videos = data.data;
                            this.videoPageInfo.count = data.count;
                        }
                    )
                } else {//直接请求
                    // 请求
                    this.request(
                        {
                            url: 'resourceLibrary/getVideos',
                            data: {
                                pageSize: this.videoPageInfo.pageSize,
                                currentPage: this.videoPageInfo.currentPage
                            }
                        },
                        (data) => {
                            this.videos  = data.data
                            this.videoPageInfo.count = data.count
                        }
                    )
                }

            },
            handleEditStyle (index) {//触发编辑样式
                this.editStyleNum = index;
            },
            handleEditStart (index) {//弹出编辑弹框
                if(this.activeName=='first'){
                    this.editForm.desc=this.imgs[index].picDesc;
                    this.editForm.imgName=this.imgs[index].picName;
                    this.editForm.id=this.imgs[index]._id;
                    this.editForm.showDialog=true;
                }else if(this.activeName=='second'){
                    console.log('编辑下标' + index+'类型为视频');
                }
                // this.request()
            },
            delImg () {//删除图片弹框

                    this.delForm.id=this.imgs[this.editStyleNum]._id;
                    this.delForm.imgName=this.imgs[this.editStyleNum].picName;
                    this.delForm.showDialog=true;

                // this.request()
            },
            delVideo () {//删除视频弹框

                    this.delVideoForm.id=this.videos[this.editStyleNum]._id;
                    this.delVideoForm.imgName=this.videos[this.editStyleNum].videoName;
                    this.delVideoForm.showDialog=true;

                // this.request()
            },
            startDelImg(){
                // 请求
                this.request(
                    {
                        url: 'resourceLibrary/delImg',
                        data:this.delForm
                    },
                    (data) => {
                        this.delForm={//删除弹框
                            id:'',
                                imgName:'',//图片名称
                                showDialog:false
                        };
                        this.delForm.showDialog=false;
                        this.getImgs();
                    }
                )
            },
            startDelVideo(){
                // 请求
                this.request(
                    {
                        url: 'resourceLibrary/delVideo',
                        data:this.delVideoForm
                    },
                    (data) => {
                        this.delForm={//重置form
                            id:'',
                            videoName:'',//图片名称
                            showDialog:false
                        },
                        this.delVideoForm.showDialog=false;
                        this.getVideos();
                    }
                )
            },
            closePicShow () {//关闭组件弹框====供选择图片弹窗组件调用
                this.choosePicShow = false
            },
            startSearchImg () {//开始搜索图片
                this.searchImgWord = this.imgWord
                this.getImgs()
            },
            startSearchVideo(){//开始视频搜索
                this.searchVideoWord = this.videoWord;
                this.getVideos();
            },
            imgCurrentPageChange (val) {//图片分页当前页改变
                this.imgPageInfo.currentPage = val
                this.getImgs()
            },
            videoCurrentPageChange(val){
                this.videoPageInfo.currentPage = val;
                this.getVideos();
            },
            confirmSelect (val) {//当前选中的图片
                this.uploadVideoForm.picUrl = val[0].picPath
                this.uploadVideoForm.picName = val[0].picName
            },
            playVideo (item) {
                this.videoPlayVisible = true
                this.showVideoUrl = item.videoPath
            },
            closePlayer (done) {
                this.$refs.video.pause()
                done()
            },
            startUpdateImg(){//图片更新
                // 请求
                this.request(
                    {
                        url: 'resourceLibrary/updateImg',
                        data:this.editForm
                    },
                    (data) => {
                        this.$refs.editForm.resetFields();
                        this.editForm.showDialog=false;
                        this.getImgs();
                    }
                )
            }
        }
    }
</script>
<style scoped>
    .video {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: url('../assets/play.png') no-repeat center;
        background-size:50% 50%;
        opacity: 0.3;
    }

    .video:hover{
        opacity: 0.5;
    }
    .resource {
        padding: 10px 20px;
        height: 100%;
        position: relative;
    }

    .resource >>> .el-tabs__item {
        font-size: 20px;
        color: #345070;
        opacity: 0.65;
        font-family: "Microsoft YaHei";
        font-weight: bold;
    }

    .resource >>> .el-tabs__item.is-active {
        opacity: 1;
    }

    .resource >>> .el-tabs__active-bar {
        height: 3px;
        background-color: #2993AA;
    }

    .resource >>> .el-tabs__nav-wrap::after {
        background-color: #2993AA;
        opacity: 0.6;
    }

    .btns {
        padding-top: 5px;
        text-align: left;
    }

    .btns > .el-button {
        width: 110px;
    }

    .upload {
        background-color: #46C4D3;
        color: #ffffff;
    }

    .del {
        color: #9FA9BA;
    }

    .del:hover {
        background-color: #f36c9d;
        color: #ffffff;
        border: 1px solid #f36c9d;
    }

    .search {
        width: 146px;
        float: right;

    }

    .search >>> .el-input__inner {
        border: 1px solid #8B95A0;
        background: transparent;
    }

    .search >>> .el-input__inner:hover {
        border: 1px solid #409EFF;
        opacity: 0.6;
        color: #000000;
    }

    .search >>> .el-icon-search::before {
        font-size: 17px;
        font-weight: bold;
    }

    .image {
        text-align: left;
        width: 1580px\9;
    }

    _:-ms-fullscreen, :root .image { width: 1580px; }

    .image > li {
        box-sizing: border-box;
        display: inline-block;
        width: 15.1%;
        height: 215px;
        margin-top: 20px;
        margin-right: 20px;
        background-color: #ffffff;
        border-radius: 4px;

    }


    .image > li > p {
        padding-left: 6%;
        margin-top: 15px;
    }

    .image > li > img {
        border-radius: 4px;
    }

    .bg-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 100px;
        display: inline-block;
    }

    .bgTime {
        font-size: 14px;
        float: right;
        padding-right: 33px;
    }


    .paginationCon {
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .isEditIcon {
        background: url("../assets/edit.svg") no-repeat;
        display: inline-block;
        position: absolute;
        width: 18px;
        height: 18px;
        right: -9px;
        top: -9px;
        cursor: pointer;
    }

    .imgItem:hover {
        border: 1px solid rgba(41, 147, 170, 0.5);
    }

    .imgItem {
        border: 1px solid transparent;
    }

    .isEdit {
        border: 1px solid #2993AA;
        position: relative;
    }

    .isEdit:hover {
        border: 1px solid #2993AA !important;
    }

</style>

