const Router=require('koa-router')
//用于使用mango
const mongoose = require ('mongoose')
let router =new Router();

// 查询网站
router.post('/getDir',async(ctx)=>{
	const Dir=mongoose.model('Dir');
	var result=await Dir.find({}).exec()
	if (result.length!=0) {
		ctx.body={code:'01',data:{data:result}}
	}else{
		ctx.body={code:'02',message:'没有相关信息',data:{}}
	}
})

router.post('/createDir',async(ctx)=>{
	const Dir=mongoose.model('Dir');
	const reqBody=ctx.request.body;
	let oneDir=new Dir({
			dirLabel:reqBody.dirLabel ,//文件夹名称
			parentId: reqBody.parentId,//父文件夹ID
			path: reqBody.path,//当前文件夹路径 [{id:'aaaa',label:"图片首页"}]  ----》用于显示层级目录面包屑
			passWord: reqBody.passWord,//当前文件夹密码
		}
	);
	await oneDir.save().then(()=>{
		ctx.body={code:'03',data:{message:'创建文件夹成功'}}
	}).catch(err=>{
		ctx.body={code:'05',data:{message:'创建文件夹失败'}}
	})
	
})
module.exports=router
