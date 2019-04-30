const Koa=require('koa')
const app=new Koa()
const colors=require('colors')
const  static = require("koa-static")
const path = require('path')
//用于日志管理
const {log4js} = require('./logSetting/log4js')
//用于生成模板
const {connect,initSchemas}=require('./database/init.js')

//用于使用路由
const Router=require('koa-router')

//用于跨域
const cors=require('koa2-cors')

//用于解析post请求
const bodyParser=require('koa-bodyparser')
const session = require('koa-session');

//引入接口模块
let user=require('./appApi/user.js')
let home=require('./appApi/home.js')
let cost=require('./appApi/cost.js')
let resourceLibrary=require('./appApi/resourceLibrary.js')
let integratedMachine=require('./appApi/integratedMachine.js')
let equipment=require('./appApi/equipment.js')
let websites=require('./appApi/websites.js')
let outRecord=require('./appApi/outRecord.js')
let project=require('./appApi/project.js')
let expert=require('./appApi/expert.js')
let dir=require('./appApi/dir.js')


//配置中间件

	//配置session中间件
const CONFIG = {
	key: 'koa:sess1',   //cookie key (default is koa:sess)
	maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
	overwrite: true,  //是否可以overwrite    (默认default true)
	httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
	signed: true,   //签名默认true
	rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
	renew: false,  //(boolean) renew session when session is nearly expired,
};


app.keys = ['asdasd'] //cookie的签名

app.use(session(CONFIG, app))

//装载所有子路由 用于接口模块化

let router =new Router();
app.use(bodyParser())
app.use(static( path.join( __dirname,'/static')));//静态资源服务器

router.use('/user',user.routes())
router.use('/home',home.routes())
router.use('/project',project.routes())
router.use('/integratedMachine',integratedMachine.routes())
router.use('/resourceLibrary',resourceLibrary.routes())
router.use('/equipment',equipment.routes())
router.use('/websites',websites.routes())
router.use('/outRecord',outRecord.routes())
router.use('/expert',expert.routes())
router.use('/cost',cost.routes())
router.use('/dir',dir.routes())

router.get('/test',async(ctx)=>{
	console.log(ctx.request);
})

//加载路由中间件
app.use(async(ctx, next) => {//记录日志开始
	const start = new Date()
	await next()
	const ms = new Date() - start
	log4js.resLogger(ctx, ms)
})

app.use(async (ctx, next)=> {//设置允许跨域
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if (ctx.method == 'OPTIONS') {
		ctx.body = 200;
	} else {
		await next();
	}
});


app.use(router.routes())

app.use(router.allowedMethods())
app.use(cors())


colors.setTheme ({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

//主函数
(async()=>{
	await connect();
	//初始化数据库schema模板
	initSchemas();
	}
)()

//监听函数
app.listen(8080,()=>{
	console.log('【server】 server start in port 8080'.info);
});
app.on('error', (err, ctx) => {
	log4js.errLogger(ctx, err)
	console.error('server error', err, ctx)
});
