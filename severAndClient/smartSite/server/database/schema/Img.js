const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建ImgSchema
const Img=new Schema({
        picId:{type:ObjectId},//用户id
        picName:{type:String},//图片名称
        picPath:{type:String},//图片路径连接
        picDesc:{type:String},//图片描述
        createAt:{type:Date,default:Date.now},//创建时间
    },
    {collection:'img'}//数据集命名
)

//发布模型

mongoose.model('Img',Img);//模型名称叫ImgSchema   模型叫ImgSchema
