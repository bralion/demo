const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;
//创建一条记录代表一个专家在一个项目上的费用记录
const Dir=new Schema({
		dirLabel:{type:String},//文件夹名称
		parentId:{type:String},//父文件夹ID
		path:{type:Array},//当前文件夹路径 [{id:'aaaa',label:"图片首页"}]  ----》用于显示层级目录面包屑
		passWord:{type:String},//当前文件夹密码
		createAt:{type:Date,default:Date.now},//创建时间
	},
	{collection:'dir'}//数据集命名
)
//发布模型
mongoose.model('Dir',Dir);//模型名称叫Dir   模型叫Dir
