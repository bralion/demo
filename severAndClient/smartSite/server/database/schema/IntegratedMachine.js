const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建UserSchema
const IntegratedMachine=new Schema({
	pictureUrl:{type:String},//图片链接
	urlName:{type:String},//连接名称
	url:{type:String},//连接
	createAt:{type:Date,default:Date.now},//创建时间
},
{collection:'integratedMachine'}//数据集命名
)

//发布模型

mongoose.model('IntegratedMachine',IntegratedMachine);//模型名称叫IntegratedMachine   模型叫IntegratedMachine
