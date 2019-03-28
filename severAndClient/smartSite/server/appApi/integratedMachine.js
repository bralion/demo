const Router=require('koa-router')

//用于使用mango
const mongoose = require ('mongoose')

let router =new Router();
let staticUrl='http://172.27.7.64:8080';

router.post('/addUrl',async(ctx)=>{
	let reqBody=ctx.request.body;
	const IntegratedMachine=mongoose.model('IntegratedMachine');
	let oneIntegratedMachine=new IntegratedMachine({url:reqBody.jumpPath,urlName:reqBody.websiteName,pictureUrl:staticUrl+reqBody.picPath.replace(/\\/g,"\/") });
	oneIntegratedMachine.save().then(()=>{
		console.log('添加链接成功');
	});
	ctx.body={code:'03',message:'添加链接成功！'}
})
router.post('/getUrl',async(ctx)=>{
	ctx.set('Access-Control-Allow-Origin','*')
	const IntegratedMachine=mongoose.model('IntegratedMachine');
	let res=await IntegratedMachine.find({}).exec()
	ctx.body={code:'01',data:{data:res}};
})
router.post('/delUrl',async(ctx)=>{
    let reqBody=ctx.request.body;
	ctx.set('Access-Control-Allow-Origin','*')
	const IntegratedMachine=mongoose.model('IntegratedMachine');
	let res=await IntegratedMachine.remove({_id:reqBody._id},(err,row)=>{
        if(err){
            ctx.body={code:'05',message:err}
        }else if(row.n>=1){
            ctx.body={code:'03',message:'删除成功！'}
        }else{
            ctx.body={code:'03',message:'该网站已删除，请刷新！'}
		}
    }).catch(err => {
        ctx.body = {code: '05', message:err}
    })
})

module.exports=router
