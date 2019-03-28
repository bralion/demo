const Router=require('koa-router')
//用于使用mango
const mongoose = require ('mongoose')


let router =new Router();

// 查询网站
router.post('/getWebsites',async(ctx)=>{
    const Website=mongoose.model('Website');
   var result=await Website.find({}).exec()
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
//添加网站
router.post('/addWebsite',async(ctx)=>{
    const Website=mongoose.model('Website');
    const reqBody=ctx.request.body;
    let oneWebsite=new Website(reqBody);
    await oneWebsite.save().then(()=>{
        ctx.body={code:'03',data:{message:'添加成功'}}
    }).catch(err=>{
        ctx.body={code:'05',data:{message:'添加失败'}}
    })

})

module.exports=router
