const Router = require('koa-router')

//用于使用mango
const mongoose = require('mongoose')
let router = new Router()


router.post('/getBasicInfo', async (ctx) => {//获取设备基本信息  前端定时获取  对比版本号和模板信息
    const Equipment = mongoose.model('Equipment')
    const reqBody=ctx.request.body;

    //检查参数
    if(!reqBody.equipmentId){
        ctx.body={code:'04',message:'equipmentId 是必须的'}
        return
    }
    // 获取结果
    let result= await Equipment.find({equipmentId:reqBody.equipmentId}).exec();
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result[0]}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})

router.post('/getDetailInfo', async (ctx) => {//获取设备详细信息  前端获取数据更新模板数据
    const BiddingMoudle1 = mongoose.model('BiddingMoudle1')
    const reqBody=ctx.request.body;
    //检查参数
    if(!reqBody.currentMoudleId){
        ctx.body={code:'04',message:'modelId 是必须的'};
        return
    }
    if(!reqBody.roomNum){
        ctx.body={code:'04',message:'roomNum 是必须的'}
        return
    }

    // 获取结果
    let result=  await BiddingMoudle1.find({moudleId:reqBody.currentMoudleId,roomId:reqBody.roomNum}).exec()
    if (result.length!=0) {
        ctx.body={code:'01',data:{data:result[0]}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})

router.post('/setDeafultModule', async (ctx) => {//获取设备基本信息  前端定时获取  对比版本号和模板信息
    const Equipment = mongoose.model('Equipment')
    const reqBody=ctx.request.body;

    //检查参数
    if(!reqBody.moudleId){
        ctx.body={code:'04',message:'moudleId 是必须的'}
        return
    }
    if(!reqBody.equipmentId){
        ctx.body={code:'04',message:'equipmentId 是必须的'}
        return
    }
    await Equipment.update({equipmentId:reqBody.equipmentId},{currentMoudleId:reqBody.moudleId,currentMoudleName:reqBody.currentMoudleName,$inc: {currentVersion: 1 }},{},(err,row)=>{
        if(err){
            ctx.body={code:'05',message:err}
        }else{
            ctx.body={code:'03',message:'修改成功！'}
        }
    }).catch(err => {
        ctx.body = {code: '05',message:err}
    })

})
router.post('/saveModule', async (ctx) => {//保存模板的参数
    const Equipment = mongoose.model('Equipment')
    const BiddingMoudle1 = mongoose.model('BiddingMoudle1')
    const reqBody=ctx.request.body;
    await Equipment.update({equipmentId:reqBody.equipmentId},{$inc: {currentVersion: 1 }},{},(err,row)=>{//更新版本号
        if(err){
            ctx.body={code:'05',message:err}
            return
        }
    }).catch(err => {
        ctx.body = {code: '05',message:err}
    })
    //将该模板的所有数据更新
    if(reqBody.moudleId==='bidding1'){
        let data={};
        reqBody.line1Title?data.line1Title=reqBody.line1Title:'';
        reqBody.line2Title?data.line2Title=reqBody.line2Title:'';
        reqBody.line3Title?data.line3Title=reqBody.line3Title:'';
        reqBody.line4Title?data.line4Title=reqBody.line4Title:'';
        reqBody.line5Title?data.line5Title=reqBody.line5Title:'';
        reqBody.width?data.width=reqBody.width:'';
        reqBody.title?data.title=reqBody.title:'';
        console.log(data);
        await BiddingMoudle1.update({moudleId:reqBody.moudleId},data,{},(err,row)=>{
            if(err){
                ctx.body={code:'05',message:err}
            }else{
                ctx.body={code:'03',message:'修改成功！'}
            }
        }).catch(err => {
            ctx.body = {code: '05',message:err}
        })
    }else if(reqBody.moudleId==='bidding2'){
        let data={};
        reqBody.line1Title?data.line1Title=reqBody.line1Title:'';
        reqBody.line2Title?data.line2Title=reqBody.line2Title:'';
        reqBody.line3Title?data.line3Title=reqBody.line3Title:'';
        reqBody.line4Title?data.line4Title=reqBody.line4Title:'';
        reqBody.line5Title?data.line5Title=reqBody.line5Title:'';
        reqBody.width?data.width=reqBody.width:'';
        reqBody.title?data.title=reqBody.title:'';
        await BiddingMoudle1.update({moudleId:reqBody.moudleId},data,{},(err,row)=>{
            if(err){
                ctx.body={code:'05',message:err}
            }else{
                ctx.body={code:'03',message:'修改成功！'}
            }
        }).catch(err => {
            ctx.body = {code: '05',message:err}
        })
    }

})
module.exports = router
