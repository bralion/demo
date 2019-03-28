const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建ImgSchema
const OutRecord=new Schema({
        recordId:{type:ObjectId},//记录id
        userName:{type:String},//记录人名称
        userId:{type:String},//记录人Id
        recordPersonId:{type:String},//外出人员ID
        recordPersonName:{type:String},//外出人员名称
        replacePersonId:{type:String},//代班人Id
        replacePersonName:{type:String},//代班人名称
        startTime:{type:Date},//外出开始时间
        endTime:{type:Date},//外出结束时间
        createAt:{type:Date,default:Date.now},//创建时间
    },
    {collection:'outRecord'}//数据集命名
)

//发布模型

mongoose.model('OutRecord',OutRecord);//模型名称叫OutRecord   模型叫OutRecord
