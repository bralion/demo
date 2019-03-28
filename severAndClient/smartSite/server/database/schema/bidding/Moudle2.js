const mongoose=require('mongoose');
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
//创建BiddingMoudle1
const BiddingMoudle2=new Schema({
        moudleId: {type: String},//设备类别的id
        title:{type:String},//标题
        line1Title:{type:String},
        line1Value:{type:String},
        line2Title:{type:String},
        line2Value:{type:String},
        line3Title:{type:String},
        line3Value:{type:String},
        line4Title:{type:String},
        line4Value:{type:String},
        line5Title:{type:String},
        line5Value:{type:String},
        width:{type:Number},
    },
    {collection:'moudles'}//数据集命名
)

//发布模型
mongoose.model('BiddingMoudle2',BiddingMoudle2);
