const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建ImgSchema
const Video=new Schema({
        videoId:{type:ObjectId},//视频id
        videoName:{type:String},//视频名称
        videoPath:{type:String},//视频路径连接
        videoDesc:{type:String},//视频描述
        videoPicUrl:{type:String},//视频图片地址
        createAt:{type:Date,default:Date.now},//创建时间
    },
    {collection:'video'}//数据集命名
)

//发布模型

mongoose.model('Video',Video);//模型名称叫ImgSchema   模型叫ImgSchema
