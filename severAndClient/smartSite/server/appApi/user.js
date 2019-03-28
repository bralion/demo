const Router=require('koa-router')
//用于使用mango
const mongoose = require ('mongoose')
let router =new Router();
let check=async (instance,ctx,arr)=>{//第一个是model的实例   第二个为请求上下文  第三个为 验证的参数数组
    //开发模式禁用权限检测
    return true
    //生产环境开启权限检测
    // var reqBody=ctx.request.body;
    // let flag=true;
    // return new Promise(async(resolve,reject)=>{
    //     //检查权限
    //     let re= ctx.session?ctx.session.jurisdiction['jurisdiction']:false;
    //     if(!re){
    //         ctx.body={code:'04',message:'该用户不具备此权限',data:{}}
    //         flag=false;
    //         resolve(flag)
    //     }
    //     //检查参数
    //     arr.map((item,index)=>{
    //         if(!reqBody[item]){
    //             flag=false;
    //             ctx.body={code:'04',message:item+' 是必须的'}
    //         }
    //     });
    //     resolve(flag)
    // })
}

//用户登陆
router.post('/login',async(ctx)=>{
	const User=mongoose.model('User');
	var reqBody=ctx.request.body;
	await User.findOne({userName:reqBody.userName}).exec().then(async(result)=>{
		if(result){
			if(result.status==='pause'){
                ctx.body={code:'04',message:'该用户账号被暂停使用！',data:{}}
                return
			}
			if(result.status==='stop'){
                ctx.body={code:'04',message:'该用户账号被停止使用！',data:{}}
                return
			}
			let newUser=new User();
			await newUser.comparePassword(reqBody.password,result.password).then((res)=>{
				if(res){//赋予权限。
                    ctx.session.username= result.userName;
                    ctx.session.jurisdiction= result.jurisdiction;
                    ctx.body={code:'01',message:'登陆成功',data:{userName:result.userName,role:result.role,uid:result._id,jurisdiction:result.jurisdiction}}
				}else{
					ctx.body={code:'04',message:'密码错误'}
				}
			})
            console.log(ctx.session.username);
		}else{
			ctx.body={code:'04',message:'用户名不存在'}
		}
	}).catch(err=>{
		console.log(err);
		ctx.body={
			code:500,
			message:err
		}
	})
})
// 用户注册
router.post('/save',async(ctx)=>{
	var reqBody=ctx.request.body;
	const User=mongoose.model('User');
	//检查权限和参数
    let re=await check(User,ctx,['userName','password','role']);
    if(!re){//检查不通过
        return
    }
	//模板
    // {'userName':'wy','password':'123','role':'super','status':'normal',//用户状态
    //     'jobPosition':'科长',//用户职位
    //     'role':'super',//用户角色
    //     'jurisdiction':{//用户权限
    //     		'web':true,//常用网站权限
    //         'view':false,//视图配置权限
    //         'expert':false,//专家考勤权限
    //         'out':true,//员工外出权限
    //         'res':false,//资源库权限
    //         'cdLibrary':false,//光盘库权限
    //         'jurisdiction':false,//权限系统权限
    // },}
	let oneUser=new User({userName:reqBody.userName,password:reqBody.password,role:reqBody.role,status:reqBody.status,jobPosition:reqBody.jobPosition,
		jurisdiction:reqBody.jurisdiction})
	await oneUser.save().then(
		()=>{
            ctx.body={code:'01',data:{},message:'添加用户成功'};
		}
	).catch(err=>{
        ctx.body={code:'05',data:{},message:'服务器出错'};
	})

})
// 检测用户名
router.post('/check',async(ctx)=>{
	var reqBody=ctx.request.body;
	const User=mongoose.model('User');
    //检查权限和参数
    let re=await check(User,ctx,[]);
    if(!re){//检查不通过
        return
    }
	await User.count({userName:reqBody.userName}).then(
		(val)=>{
			if(val>=1){
                ctx.body={code:'01',data:{},message:'用户名重复'};
            }else{
                ctx.body={code:'01',data:{}};//用户名可用
			}
		}
	).catch(err=>{
		console.log(err)
        ctx.body={code:'05',data:{},message:err};
	})

})
// 获取用户
router.post('/getUsers',async(ctx)=>{
    const User=mongoose.model('User');
    const reqBody=ctx.request.body;
    let newUser=new User();
    let re=await check(newUser,ctx,['currentPage','pageSize']);
    if(!re){//检查不通过
        return
    }
    let count = await User.count({}).exec();
    let result= await User.find({}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
        .limit(parseInt(reqBody.pageSize))
        .sort({'createAt':-1})
        .exec();
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result,count:count}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
// 获取用户名称
router.post('/getUsersName',async(ctx)=>{

    const User=mongoose.model('User');
    let re=await check(User,ctx,[]);
    if(!re){//检查不通过
        return
    }

    let result= await User.find({},'userName userId')
        .sort({'createAt':-1})
        .exec();
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result}}
    }else{
        ctx.body={code:'02',data:{}}
    }
})
// 删除用户
router.post('/deleteUser',async(ctx)=>{
    const reqBody=ctx.request.body;
    const User=mongoose.model('User');

    let re=await check(User,ctx,['_id']);
    if(!re){//检查不通过
        return
    }
    if(reqBody.userName==='admin'){
        ctx.body={code:'04',message:'禁止删除系统初始用户，如果有需要可修改密码！'};
        return
	}
  	await User.remove({_id:reqBody._id}).then(()=>{
        ctx.body={code:'01',message:'删除成功',data:{}}
    }).catch(err=>{
        ctx.body={code:'05',message:'删除失败',data:{}}
    })
})
// 暂停用户使用
router.post('/pauseUser',async(ctx)=>{
    const reqBody=ctx.request.body;
    const User=mongoose.model('User');
    let re=await check(User,ctx,['_id']);
    if(!re){//检查不通过
        return
    }
  	await User.update({_id:reqBody._id},{ $set:{status:'pause'}}).then((val)=>{
        if(val.n>=1){
            ctx.body={code:'01',message:'暂停成功',data:{}}
        }else{
            ctx.body={code:'01',message:'暂停失败，id不存在',data:{}}
        }
    }).catch(err=>{
        ctx.body={code:'05',message:'暂停失败',data:{}}
    })
})
// 重启用户使用
router.post('/RefreshUser',async(ctx)=>{
    const reqBody=ctx.request.body;
    const User=mongoose.model('User');
    let re=await check(User,ctx,['_id']);
    if(!re){//检查不通过
        return
    }
  	await User.update({_id:reqBody._id},{ $set:{status:'normal'}}).then((val)=>{
  		if(val.n>=1){
            ctx.body={code:'01',message:'重启成功',data:{}}
        }else{
            ctx.body={code:'01',message:'重启失败，id不存在',data:{}}
        }
    }).catch(err=>{
        ctx.body={code:'05',message:' 重启失败',data:{}}
    })
})
// 编辑用户接口
router.post('/editUser',async(ctx)=>{
    const reqBody=ctx.request.body;
    const User=mongoose.model('User');
    let re=await check(User,ctx,['_id']);
    if(!re){//检查不通过
        return
    }
  	await User.update({_id:reqBody._id},{ $set:{status:reqBody.status,jobPosition:reqBody.jobPosition,role:reqBody.role,jurisdiction:reqBody.jurisdiction}}).then((val)=>{
  		if(val.n>=1){
            ctx.body={code:'01',message:'编辑成功',data:{}}
        }else{
            ctx.body={code:'01',message:'编辑失败，id不存在',data:{}}
        }
    }).catch(err=>{
        ctx.body={code:'05',message:' 重启失败',data:{}}
    })
})

// 查询用户
router.post('/searchUser',async(ctx)=>{
    const reqBody=ctx.request.body;
    const User=mongoose.model('User');
    let re=await check(User,ctx,['currentPage','pageSize']);
    if(!re){//检查不通过
        return
    }
    let startTime=new Date(reqBody.startTime);
    let endTime=new Date(reqBody.endTime);
    let status=reqBody.status;
    let count = await User.count({userName:{$regex:reqBody.name},lastLoginAt:{$gte:startTime, $lt:endTime},status:{$regex:status}}).exec();
    let result= await User.find({userName:{$regex:reqBody.name},lastLoginAt:{$gte:startTime, $lt:endTime},status:{$regex:status}}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
        .limit(parseInt(reqBody.pageSize))
        .sort({'createAt':-1})
        .exec();
    if (count!=0) {
        ctx.body={code:'01',data:{data:result,count:count}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})

module.exports=router
