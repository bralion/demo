const Router=require('koa-router')
//用于使用mango
const mongoose = require ('mongoose')
let router =new Router();

// 查询网站
router.post('/getProject',async(ctx)=>{
    const Project=mongoose.model('Project');
    var result=await Project.find({}).exec()
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
//添加网站
// {
//     'projectName' :'项目1',//项目名称
//     'tenderingName':'林邱恒',//招标人名称
//     'agency':'成都数之联',//代理机构
//     'startTime':'2018-12-11 10:12:30',//项目招标开始时间
//     'endTime':'2018-12-11 10:12:30',//项目招标结束时间
//     'startEvaluateTime':'2018-12-11 10:12:30',//项目评标开始时间
//     'endEvaluateTime':'2018-12-11 10:12:30',//项目评标结束时间
//     'projectAddress':'招标室1',//项目地址
//     'projectAddressId':'room1',//项目地址
// }
router.post('/addProject',async(ctx)=>{
    const Project=mongoose.model('Project');
    const reqBody=ctx.request.body;
    let oneProject=new Project(reqBody);
    await oneProject.save().then(()=>{
        ctx.body={code:'03',data:{message:'添加成功'}}
    }).catch(err=>{
        ctx.body={code:'05',data:{message:'添加失败'}}
    })

})

module.exports=router
