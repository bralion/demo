const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建ImgSchema
const Project=new Schema({
        projectId:{type:ObjectId},//项目id
        projectName:{type:String},//项目名称
        tenderingName:{type:String},//招标人名称
        agency:{type:String},//代理机构
        startTime:{type:Date},//项目招标开始时间
        endTime:{type:Date},//项目招标结束时间
        startEvaluateTime:{type:Date},//项目评标开始时间
        endEvaluateTime:{type:Date},//项目评标结束时间
        projectAddress:{type:String},//项目地址
        projectAddressId:{type:String},//项目地址ID
    },
    {collection:'project'}//数据集命名
)

//发布模型

mongoose.model('Project',Project);//模型名称叫OutRecord   模型叫OutRecord
