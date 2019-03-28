const Router=require('koa-router')
//用于使用mango
const mongoose = require ('mongoose')
let router =new Router();

// 查询网站
router.post('/getExpert',async(ctx)=>{
    const Expert=mongoose.model('Expert');
    var result=await Expert.find({}).exec()
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
//添加网站
// {
// 'expertName':'单文远',
// 'expertLeave':'leave1'},
// 'expertRate':'200',
// 'expertNum':'513030198606138888',}
router.post('/addExpert',async(ctx)=>{
    const Expert=mongoose.model('Expert');
    const reqBody=ctx.request.body;
    let oneExpert=new Expert(reqBody);
    await oneExpert.save().then(()=>{
        ctx.body={code:'03',data:{message:'添加成功'}}
    }).catch(err=>{
        ctx.body={code:'05',data:{message:'添加失败'}}
    })

})

module.exports=router
