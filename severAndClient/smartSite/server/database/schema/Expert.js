const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建expertSchema
const Expert=new Schema({
        expertId:{type:ObjectId},//专家id
        expertName:{type:String},//专家名称
        expertLeave:{type:String},//专家级别
        expertRate:{type:String},//专家费率
        expertNum:{type:String},//专家身份证号
        createAt:{type:Date,default:Date.now},//创建时间
    },
    {collection:'expert'}//数据集命名
)

//发布模型
mongoose.model('Expert',Expert);//模型名称叫Expert   模型叫Expert
