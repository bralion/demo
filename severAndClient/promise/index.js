const Koa = require ('koa')
const app = new Koa ()
const Router = require ('koa-router')
const static = require ("koa-static")
const cors = require ('koa2-cors')
const path = require ('path')
//用于解析post请求
const bodyParser = require ('koa-bodyparser')
//用于使用mango
const mongoose = require ('mongoose')
let router = new Router ()
const db = "mongodb://172.27.7.68/testPromise"
const Schema = mongoose.Schema;
//创建equipmentSchema
const Equipment = new Schema ({
		equipmentId: {type: String},//设备类别的id
		equipmentName: {type: String},//设备类别的名称
		currentVersion: {type: Number},//当前版本号连接
		currentMoudleId: {type: String, unique: true},//当前模板ID
		currentMoudleName: {type: String},//当前模板名称
		createAt: {type: Date, default: Date.now ()},//创建时间
		updateTime: {type: Date, default: Date.now ()},//最新更新的时间
	},
	{collection: 'equipment'}//数据集命名
)

//发布模型
mongoose.model ('Equipment', Equipment)

app.use (bodyParser ())
app.use (static (path.join (__dirname, '/static')));//静态资源服务器
app.use (cors ())
app.use (router.routes ())


//连接数据库
let connect = async () => {
	//连接数据库
	mongoose.connect (db)
	let maxConnectTimes = 0
	
	//增加数据库监听
	
	//三次之内从新连接  三次之外报错
	return new Promise ((resolve, reject) => {
		mongoose.connection.on ('disconnexted', () => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++
				console.log ('【sever】 数据库断开连接')
				mongoose.connect (db)
			} else {
				reject ()
				throw new Error ('数据库连接失败，请确认数据库配置正确。。。')
			}
		})
		
		mongoose.connection.on ('error', (err) => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++
				console.log ('【sever】 数据库连接错误，正在重新连接')
			} else {
				reject (err)
				throw new Error ('数据库连接失败，请确认数据库配置正确。。。')
			}
		})
		
		mongoose.connection.once ('open', () => {
			console.log ('【sever】 数据库连接成功')
			resolve ()
		})
	})
}


//主函数
(async () => {
		await connect ();
	}
) ()


router.get ('/getBasicInfo', async (ctx) => {//获取设备基本信息  前端定时获取  对比版本号和模板信息
	const Equipment = mongoose.model ('Equipment');
	console.log (ctx.query);
	let reqBody = ctx.query;
//检查参数
	if (!reqBody.equipmentId) {
		ctx.body = {code: '04', message: 'equipmentId 是必须的'}
		return
	}
// 获取结果
	// 	{
	// 		equipmentId:'bidding',
	// 			equipmentName: '招投标室',
	// 		currentVersion: 10000,
	// 	}
	
	
	// //需求1   获取设备的信息 然后再更新设备的Id,在后面加上字符串   aa   ---------》链式调用   promise 解决回调地狱的问题
	// await Equipment.find ({equipmentId: reqBody.equipmentId}).exec ()
	// 	.then (async (val) => {
	// 		console.log (val);
	// 		await Equipment.update ({equipmentId: val[0].equipmentId}, {equipmentId: val[0].equipmentId + 'aa'})
	// 	}).then (() => {
	// 		ctx.body = {code: '01', data: {message: '末尾添加aa成功'}}
	// 	}).catch(err=>(ctx.body = {code: '01', data: {message: '未找到该id'}}));
	
	
	//需求二  同时插入5条数据，5条插入都成功后  返回前端数据插入成功。
	let oneEquipment = new Equipment ({
		// 		currentMoudleId: 'bidding1',
		// 		currentMoudleName: '模板1',
		// 		updateTime: date
		equipmentId: 'bidding1',
		equipmentName: '招投标室',
		currentVersion: 10000,
		currentMoudleId: 'bidding1',
		currentMoudleName: '模板1',
		updateTime: new Date ()
	});
	let oneEquipment1 = new Equipment ({
		// 		currentMoudleId: 'bidding1',
		// 		currentMoudleName: '模板1',
		// 		updateTime: date
		equipmentId: 'bidding1',
		equipmentName: '招投标室',
		currentVersion: 10000,
		currentMoudleId: 'bidding2',
		currentMoudleName: '模板1',
		updateTime: new Date ()
	});
	let oneEquipment2 = new Equipment ({
		// 		currentMoudleId: 'bidding1',
		// 		currentMoudleName: '模板1',
		// 		updateTime: date
		equipmentId: 'bidding1',
		equipmentName: '招投标室',
		currentVersion: 10000,
		currentMoudleId: 'bidding3',
		currentMoudleName: '模板1',
		updateTime: new Date ()
	});
	let oneEquipment3 = new Equipment ({
		// 		currentMoudleId: 'bidding1',
		// 		currentMoudleName: '模板1',
		// 		updateTime: date
		equipmentId: 'bidding1',
		equipmentName: '招投标室',
		currentVersion: 10000,
		currentMoudleId: 'bidding4',
		currentMoudleName: '模板1',
		updateTime: new Date ()
	});
	let oneEquipment4 = new Equipment ({
		// 		currentMoudleId: 'bidding1',
		// 		currentMoudleName: '模板1',
		// 		updateTime: date
		equipmentId: 'bidding1',
		equipmentName: '招投标室',
		currentVersion: 10000,
		currentMoudleId: 'bidding5',
		currentMoudleName: '模板1',
		updateTime: new Date ()
	});
	await  Promise.all ([oneEquipment.save (), oneEquipment1.save (), oneEquipment2.save (), oneEquipment3.save (), oneEquipment4.save ()]).then ((info) => {
		ctx.body = {code: '01', data: {message: '插入5条数据成功'}}
	}).catch (err => {
		ctx.body = {code: '01', err: err}
	})
})
//监听函数
app.listen (8080, () => {
	console.log ('【server】 server start in port 8080');
});

