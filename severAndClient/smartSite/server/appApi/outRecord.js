const Router=require('koa-router')
//用于使用mango
const mongoose = require ('mongoose')

let router =new Router();

// 得到全部网站接口
router.post('/getRecords',async(ctx)=>{
    const OutRecord=mongoose.model('OutRecord');
    const reqBody=ctx.request.body;
    //检查参数
    if(!reqBody.currentPage){
        ctx.body={code:'04',message:'currentPage 是必须的'}
        return
    }else if(!reqBody.pageSize){
        ctx.body={code:'04',message:'pageSize 是必须的'}
        return
    }
    let count = await OutRecord.count({}).exec();
    let result= await OutRecord.find({}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
        .limit(parseInt(reqBody.pageSize))
        .sort({'createAt':-1})
        .exec();
    if (count!=0) {
        ctx.body={code:'01',data:{data:result,count:count}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
// 查询网站
router.post('/searchRecords',async(ctx)=>{
    const OutRecord=mongoose.model('OutRecord');
    const reqBody=ctx.request.body;
    //检查参数
    if(!reqBody.currentPage){
        ctx.body={code:'04',message:'currentPage 是必须的'}
        return
    }else if(!reqBody.pageSize){
        ctx.body={code:'04',message:'pageSize 是必须的'}
        return
    }
    let startTime=new Date(reqBody.startTime);
    let endTime=new Date(reqBody.endTime);
    let count = await OutRecord.count({recordPersonName:{$regex:reqBody.name},startTime:{$gte:startTime, $lt:endTime}}).exec();
    let result= await OutRecord.find({recordPersonName:{$regex:reqBody.name},startTime:{$gte:startTime, $lt:endTime}}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
        .limit(parseInt(reqBody.pageSize))
        .sort({'createAt':-1})
        .exec();
    if (count!=0) {
        ctx.body={code:'01',data:{data:result,count:count}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
//添加外出记录
router.post('/addRecords',async(ctx)=>{
    const OutRecord=mongoose.model('OutRecord');
    const reqBody=ctx.request.body;
    let oneOutRecord=new OutRecord(reqBody);
    await oneOutRecord.save().then(()=>{
        ctx.body={code:'03',data:{message:'添加成功'}}
    }).catch(err=>{
        ctx.body={code:'05',data:{message:'添加失败'}}
    })

})
//删除外出记录
router.post('/delRcord',async(ctx)=>{
    const OutRecord=mongoose.model('OutRecord');
    const reqBody=ctx.request.body;
    let oneOutRecord=new OutRecord(reqBody);
    await oneOutRecord.remove({_id:reqBody._id}).then(()=>{
        ctx.body={code:'01',message:'删除成功',data:{}}
    }).catch(err=>{
        ctx.body={code:'05',message:'删除失败',data:{}}
    })

})

module.exports=router
