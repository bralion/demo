const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const bcrypt=require('bcryptjs')
const SALT_WORK_FACTOR=10
//schema类型   可以写成下面这样  也可以直接向userName一样  写成对象。
let ObjectId=Schema.Types.ObjectId;

//创建UserSchema
const userSchema=new Schema({
	userId:{type:ObjectId},//用户id
	userName:{unique:true,type:String},//用户名称
	password:String,//用户密码
	status:String,//用户状态
	jobPosition:String,//用户职位
	role:String,//用户角色
	jurisdiction:{//用户权限
		web:{type:Boolean,default:false},//常用网站权限
		view:{type:Boolean,default:false},//视图配置权限
		expert:{type:Boolean,default:false},//专家考勤权限
		out:{type:Boolean,default:false},//员工外出权限
		res:{type:Boolean,default:false},//资源库权限
		cdLibrary:{type:Boolean,default:false},//光盘库权限
        jurisdiction:{type:Boolean,default:false},//权限系统权限
	},
	createAt:{type:Date,default:Date.now},//创建时间
	lastLoginAt:{type:Date,default:Date.now},//最后登陆时间
},
{collection:'user'}//数据集命名
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
//发布模型

mongoose.model('User',userSchema);//模型名称叫User   模型叫userSchema
