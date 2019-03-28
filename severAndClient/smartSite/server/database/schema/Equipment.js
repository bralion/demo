const mongoose=require('mongoose');
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。

//创建equipmentSchema
const Equipment=new Schema({
        equipmentId:{type:String},//设备类别的id
        equipmentName:{type:String},//设备类别的名称
        currentVersion:{type:Number},//当前版本号连接
        currentMoudleId:{type:String},//当前模板ID
        currentMoudleName:{type:String},//当前模板名称
        createAt:{type:Date,default:Date.now},//创建时间
        updateTime:{type:Date,default:Date.now},//最新更新的时间
    },
    {collection:'equipment'}//数据集命名
)

//发布模型

mongoose.model('Equipment',Equipment);
