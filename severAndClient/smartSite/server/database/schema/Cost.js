const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;
//创建一条记录代表一个专家在一个项目上的费用记录
const Cost=new Schema({
         costId:{type:ObjectId},//项目费用
        costProjectId:{type:String},//项目id
        expertId:{type:String},//专家ID
        recordStartTime:{type:Date},//考勤开始时间
        recordEndTime:{type:Date},//考勤结束时间
        recordTotalTime:{type:Number},//总时间
    },
    {collection:'cost'}//数据集命名
)
//发布模型
mongoose.model('Cost',Cost);//模型名称叫Expert   模型叫Expert
