const mongoose = require('mongoose')
const Schema = mongoose.Schema
const db = 'mongodb://172.27.7.68/smartSite'
const colors = require('colors')
const bcrypt=require('bcryptjs')
const SALT_WORK_FACTOR=10

colors.setTheme({
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
})

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
            console.log('【sever】 数据库连接成功'.info)
            resolve()
        })
    })
}

//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId = Schema.Types.ObjectId
//创建UserSchema
const userSchema = new Schema({
        userId: {type: ObjectId},//用户id
        userName: {unique: true, type: String},//用户名称
        password: String,//用户密码
        role: String,//用户角色
        createAt: {type: Date, default: Date.now()},//创建时间
        lastLoginAt: {type: Date, default: Date.now()}//最后登陆时间
    },
    {collection: 'user'}//数据集命名
)
userSchema.pre('save',function (next) {//定义save之前的钩子
    bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
        if(err) return next(err)
        bcrypt.hash(this.password,salt,(err,hash)=>{
            if(err) return next(err);
            //this代表userSchema
            this.password=hash;
            next();

        })
    })
})
userSchema.methods={//添加scheme实例方法
    comparePassword:(password1,password)=>{
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password1,password,(err,ismatch)=>{
                if(!err){
                    resolve(ismatch)
                }
                else reject(err)
            })
        })
    }
}

mongoose.model('User', userSchema)//模型名称叫User   模型叫userSchema

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

//创建BiddingMoudle1
const BiddingMoudle1 = new Schema({
        moudleId: {type: String},//设备类别的id
        title: {type: String},//标题
        line1Title: {type: String},
        line1Value: {type: String},
        line2Title: {type: String},
        line2Value: {type: String},
        line3Title: {type: String},
        line3Value: {type: String},
        line4Title: {type: String},
        line4Value: {type: String},
        line5Title: {type: String},
        line5Value: {type: String},
        width: {type: Number},
        roomId:{type:Number},//房间号
    },
    {collection: 'moudles'}//数据集命名
)

//发布模型

mongoose.model('BiddingMoudle1', BiddingMoudle1)
//创建BiddingMoudle2
const BiddingMoudle2 = new Schema({
        moudleId: {type: String},//设备类别的id
        title: {type: String},//标题
        line1Title: {type: String},
        line1Value: {type: String},
        line2Title: {type: String},
        line2Value: {type: String},
        line3Title: {type: String},
        line3Value: {type: String},
        line4Title: {type: String},
        line4Value: {type: String},
        line5Title: {type: String},
        line5Value: {type: String},
        width: {type: Number},
        roomId:{type:Number},//房间号
    },
    {collection: 'moudles'}//数据集命名
)

//发布模型

mongoose.model('BiddingMoudle2', BiddingMoudle2)

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

let initDatabase = () => {//初始化数据库
    // //初始化用户
    // const User = mongoose.model('User')
    // let oneUser = new User({userName:'admin', password: '123', role: 'super'})
    // oneUser.save()
    // //初始化设备类别
    // const Equipment = mongoose.model('Equipment')
    // let date = new Date()
    // let oneEquipment = new Equipment({
    //     equipmentId:'bidding',
    //     equipmentName: '招投标室',
    //     currentVersion: 10000,
    //     currentMoudleId: 'bidding1',
    //     currentMoudleName: '模板1',
    //     updateTime: date
    // })
    // oneEquipment.save()
    // //初始化招投标模板1信息
    // const BiddingMoudle1 = mongoose.model('BiddingMoudle1')
    // const BiddingMoudle2 = mongoose.model('BiddingMoudle2')
    // let oneBiddingMoudle1 = new BiddingMoudle1({
    //     moudleId:'bidding1',
    //     title: '龙泉驿区公共资源交易中心开标场地使用情况',
    //     line1Title: '开标场地',
    //     line1Value: '招标室1',
    //     line2Title: '项目名称',
    //     line2Value: '招标室1',
    //     line3Title: '招标人',
    //     line3Value: '林胖子',
    //     line4Title: '代理机构',
    //     line4Value: '数之联',
    //     line5Title: '标书收取截止时间及开标时间',
    //     line5Value: '2019/01/31-09:30',
    //     width:220,
    //     roomId:1,//房间号
    // })
    // oneBiddingMoudle1.save()
    // let oneBiddingMoudle2 = new BiddingMoudle2({
    //     moudleId:'bidding2',
    //     title: '龙泉驿区公共资源交易中心开标场地使用情况',
    //     line1Title: '开标场地1',
    //     line1Value: '招标室1',
    //     line2Title: '项目名称1',
    //     line2Value: '招标室1',
    //     line3Title: '招标人',
    //     line3Value: '林胖子1',
    //     line4Title: '代理机构1',
    //     line4Value: '数之联',
    //     line5Title: '标书收取截止时间及开标时间',
    //     line5Value: '2019/01/31-09:30',
    //     width:220,
    //     roomId:1,//房间号
    // })
    // oneBiddingMoudle2.save();
    
    
	const Dir = mongoose.model('Dir')
	let oneDir = new Dir({
		dirLabel:'公共图片',//文件夹名称
		parentId:'',//父文件夹ID
		path:[{id:'aaaa',label:"公共图片"}],//图片文件的根目录
		passWord:'',//当前文件夹密码
    })
	oneDir.save()
	let oneDir1 = new Dir({
		dirLabel:'公共视频',//文件夹名称
		parentId:'',//父文件夹ID
		path:[{id:'bbbb',label:"公共视频"}],//视频文件的根目录
		passWord:'',//当前文件夹密码
    })
	oneDir1.save()
}

connect().then(initDatabase)//连接数据库

