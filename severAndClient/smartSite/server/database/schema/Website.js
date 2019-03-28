const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建ImgSchema
const Website=new Schema({
        websiteId:{type:ObjectId},//网站id
        websiteName:{type:String},//网站名称
        picPath:{type:String},//图片路径连接
        jumpPath:{type:String},//跳转地址路径连接
        userId:{type:String},//所属用户的id
        userName:{type:String},//用户名
        password:{type:String},//密码
        createAt:{type:Date,default:Date.now},//创建时间
    },
    {collection:'website'}//数据集命名
)

//发布模型

mongoose.model('Website',Website);//模型名称叫ImgSchema   模型叫ImgSchema
