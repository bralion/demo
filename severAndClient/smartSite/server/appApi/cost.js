const Router=require('koa-router')
//用于使用mango
const mongoose = require ('mongoose')
let router =new Router();

// 查询网站
router.post('/getCost',async(ctx)=>{
    const Cost=mongoose.model('Cost');
    var result=await Cost.find({}).exec()
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
//添加网站
// {
// 'costProjectId':'fdsfsdfsfsf'
// 'expertId':'fsfsffsf'
// 'recordStartTime':'2019-05-12'
// 'recordEndTime':'2019-05-12'
// 'recordTotalTime':10
// }
router.post('/addCost',async(ctx)=>{
    const Cost=mongoose.model('Cost');
    const reqBody=ctx.request.body;
    let oneCost=new Cost(reqBody);
    await oneCost.save().then(()=>{
        ctx.body={code:'03',data:{message:'添加成功'}}
    }).catch(err=>{
        ctx.body={code:'05',data:{message:'添加失败'}}
    })

})

module.exports=router
