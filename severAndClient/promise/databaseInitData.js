const mongoose = require('mongoose')
const Schema = mongoose.Schema
const db = 'mongodb://172.27.7.68/test111'

//连接数据库
let connect = async () => {
	//连接数据库
	mongoose.connect(db)
	let maxConnectTimes = 0
	
	//增加数据库监听
	
	//三次之内从新连接  三次之外报错
	return new Promise((resolve, reject) => {
		mongoose.connection.on('disconnexted', () => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++
				console.log('【sever】 数据库断开连接')
				mongoose.connect(db)
			} else {
				reject()
				throw new Error('数据库连接失败，请确认数据库配置正确。。。')
			}
		})
		
		mongoose.connection.on('error', (err) => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++
				console.log('【sever】 数据库连接错误，正在重新连接')
			} else {
				reject(err)
				throw new Error('数据库连接失败，请确认数据库配置正确。。。')
			}
		})
		
		mongoose.connection.once('open', () => {
			console.log('【sever】 数据库连接成功')
			resolve()
		})
	})
}

//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId = Schema.Types.ObjectId

//创建equipmentSchema
const Equipment = new Schema({
		equipmentId:{type:String},//设备类别的id
		equipmentName:{type:String},//设备类别的名称
		currentVersion:{type:Number},//当前版本号连接
		currentMoudleId:{type:String},//当前模板ID
		currentMoudleName:{type:String},//当前模板名称
		createAt:{type:Date,default:Date.now()},//创建时间
		updateTime:{type:Date,default:Date.now()},//最新更新的时间
	},
	{collection: 'equipment'}//数据集命名
)

//发布模型
mongoose.model('Equipment', Equipment)

let initDatabase = () => {//初始化数据库
	//初始化设备类别
	const Equipment = mongoose.model('Equipment')
	let date = new Date()
	let oneEquipment = new Equipment({
		equipmentId:'bidding',
		equipmentName: '招投标室',
		currentVersion: 10000,
		currentMoudleId: 'bidding1',
		currentMoudleName: '模板1',
		updateTime: date
	})
	oneEquipment.save().then(()=>{console.log('数据库初始化完成。');mongoose.disconnect()});
}

connect().then(initDatabase)//连接数据库

