const Router = require('koa-router')

//用于使用mango
const mongoose = require('mongoose')
const multiparty = require('koa2-multiparty')

let router = new Router()

router.post('/uploadImg', multiparty({uploadDir: './static/imgs'}), async (ctx) => {
    const Img = mongoose.model('Img')
    const reqBody = JSON.parse(ctx.req.body.data);
    let oneImg = new Img({
        picName: ctx.req.files.file.originalFilename,
        picDesc: reqBody.desc,
	    parentDirId: reqBody.parentDirId,
        picPath: ctx.req.files.file.path
    })
    await oneImg.save().then(() => {
        ctx.body = {code: '01', 'message': '上传图片 ' + ctx.req.files.file.originalFilename + '成功！'}
    }).catch(err => {
        ctx.body = {code: '05', 'message': err}
    })
})

router.post('/getImgs', async (ctx) => {
    const Img = mongoose.model('Img')
    const Dir = mongoose.model('Dir')
    const reqBody=ctx.request.body;
    //检查参数
    if(!reqBody.currentPage){
        ctx.body={code:'04',message:'currentPage 是必须的'};
        return
    }else if(!reqBody.pageSize){
        ctx.body={code:'04',message:'pageSize 是必须的'};
        return
    }else if(!reqBody.parentDirId){
        ctx.body={code:'04',message:'文件夹id 是必须的'};
        return
    }

    // 获取结果
		//获取文件夹的数量
	let count1 = await Dir.count({parentId:reqBody.parentDirId}).exec();
	let count = await Img.count({parentDirId:reqBody.parentDirId}).exec();
	let result=[];
	//如果文件夹的数量大于等于当前页的最大数量  则全部为文件夹
    if(count1>=parseInt(reqBody.pageSize) * (reqBody.currentPage)){
        result= await Dir.find({parentId:reqBody.parentDirId}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
		    .limit(parseInt(reqBody.pageSize))
		    .sort({'createAt':-1})
		    .exec();
    }
    //如果文件夹数量小于等于当前页的最小数量 则全部为文件
	else if(count1<=parseInt(reqBody.pageSize) * (reqBody.currentPage-1)){
	    result= await Img.find({parentDirId:reqBody.parentDirId}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1)-count1)
		    .limit(parseInt(reqBody.pageSize))
		    .sort({'createAt':-1})
		    .exec();
	    result.map(item=>{
		    item.picPath=item.picPath.slice(6)
	    })
	}
	else{//当前页即有文件又有文件夹
	    let resultDir= await Dir.find({parentId:reqBody.parentDirId}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
		    .limit(count1-parseInt(reqBody.pageSize)*parseInt(reqBody.currentPage-1))
		    .sort({'createAt':-1})
		    .exec();
	    let resultImg= await Img.find({parentDirId:reqBody.parentDirId}).skip(0)
		    .limit(parseInt(reqBody.pageSize)*parseInt(reqBody.currentPage)-count1)
		    .sort({'createAt':-1})
		    .exec();
	    resultImg.map(item=>{
		    item.picPath=item.picPath.slice(6)
	    })
	    result=[].concat(resultDir).concat(resultImg);
    }

    if (result) {
        ctx.body={code:'01',data:{data:result,count:count+count1}}
    }else{
        ctx.body={code:'02',message:'没有相关信息',data:{}}
    }
})
router.post('/searchImgs', async (ctx) => {
    const Img = mongoose.model('Img')
    const reqBody=ctx.request.body;
    //检查参数
    if(!reqBody.currentPage){
        ctx.body={code:'04',message:'currentPage 是必须的'}
        return
    }else if(!reqBody.pageSize){
        ctx.body={code:'04',message:'pageSize 是必须的'}
        return
    }else if(!reqBody.keyWord){
        ctx.body={code:'04',message:'keyWord 是必须的'}
        return
    }

    // 获取结果
    let count = await Img.count({picName:{$regex:reqBody.keyWord}}).exec();
    let result= await Img.find({picName:{$regex:reqBody.keyWord}}).or({picName:{$regex:reqBody.keyWord}}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
        .limit(parseInt(reqBody.pageSize))
        .sort({'createAt':-1})
        .exec();
    if (result.length!=0) {
        result.map(item=>{
            item.picPath=item.picPath.slice(6)
        })
        ctx.body={code:'01',data:{data:result,count:count}}
    }else{
        ctx.body={code:'02',data:{data:[],count:0},message:'没有相关信息'}
    }
})
router.post('/uploadVideo', multiparty({uploadDir: './static/videos'}), async (ctx) => {
    const Video = mongoose.model('Video')
    const reqBody = JSON.parse(ctx.req.body.data);
    let oneVideo = new Video({
        videoName: ctx.req.files.file.originalFilename,
        videoDesc: reqBody.desc,
        videoPath: ctx.req.files.file.path,
        videoPicUrl: reqBody.picUrl
    })
    await oneVideo.save().then(() => {
        ctx.body = {code: '03', 'message': '上传视频 ' + ctx.req.files.file.originalFilename + '成功！'}
    }).catch(err => {
        ctx.body = {code: '05', 'message': err}
    })
})

router.post('/getVideos', async (ctx) => {
    const Video = mongoose.model('Video')
    const reqBody = ctx.request.body;
    //检查参数
    if(!reqBody.currentPage){
        ctx.body={code:'04',message:'currentPage 是必须的'}
        return
    }else if(!reqBody.pageSize){
        ctx.body={code:'04',message:'pageSize 是必须的'}
        return
    }
    let count = await Video.count({}).exec();
    let result= await Video.find({}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
        .limit(parseInt(reqBody.pageSize))
        .sort({'createAt':-1})
        .exec();
    if (result) {
        result.map(item=>{
            item.videoPath=item.videoPath.slice(6)
        })
        ctx.body={code:'01',data:{data:result,count:count}}
    }else{
        ctx.body={code:'02',data:[]}
    }
})

router.post('/searchVideos', async (ctx) => {
    const reqBody = ctx.request.body;
    const Video = mongoose.model('Video')
    //检查参数
    if(!reqBody.currentPage){
        ctx.body={code:'04',message:'currentPage 是必须的'}
        return
    }else if(!reqBody.pageSize){
        ctx.body={code:'04',message:'pageSize 是必须的'}
        return
    }else if(!reqBody.keyWord){
        ctx.body={code:'04',message:'keyWord 是必须的'}
        return
    }
    let count = await Video.count({}).exec();
    let result= await Video.find({videoName:{$regex:reqBody.keyWord}}).skip(parseInt(reqBody.pageSize) * (reqBody.currentPage-1))
        .limit(parseInt(reqBody.pageSize))
        .sort({'createAt':-1})
        .exec();
    if (result.length!=0) {
        result.map(item=>{
            item.videoPath=item.videoPath.slice(6)
        })
        ctx.body={code:'01',data:{data:result,count:count}}
    }else{
        ctx.body={code:'02',data:{data:[],count:0},message:'没有相关信息'}
    }
})

router.post('/updateImg', async (ctx) => {
    // //检查参数
    // if(!reqBody.currentPage){
    //     ctx.body={code:'404',message:'currentPage 是必须的'}
    // }else if(!reqBody.pageSize){
    //     ctx.body={code:'404',message:'pageSize 是必须的'}
    // }else if(!reqBody.keyWord){
    //     ctx.body={code:'404',message:'keyWord 是必须的'}
    // }
    const reqBody = ctx.request.body;
    const Img = mongoose.model('Img');
    await Img.update({_id:reqBody.id},{picName:reqBody.imgName,picDesc:reqBody.desc},{},(err,row)=>{
        if(err){
            ctx.body={code:'05',message:err}
        }else{
            ctx.body={code:'03',message:'修改成功！'}
        }
    }).catch(err => {
        ctx.body = {code: '05',message:err}
    })


})
router.post('/delImg', async (ctx) => {
    // //检查参数
    // if(!reqBody.currentPage){
    //     ctx.body={code:'404',message:'currentPage 是必须的'}
    // }else if(!reqBody.pageSize){
    //     ctx.body={code:'404',message:'pageSize 是必须的'}
    // }else if(!reqBody.keyWord){
    //     ctx.body={code:'404',message:'keyWord 是必须的'}
    // }

    const reqBody = ctx.request.body;
    const Img = mongoose.model('Img');
    await Img.remove({_id:reqBody.id},(err,row)=>{
        if(err){
            ctx.body={code:'05',message:err}
        }else{
            ctx.body={code:'03',message:'删除成功！'}
        }
    }).catch(err => {
        ctx.body = {code: '05', message:err}
    })

})
router.post('/delVideo', async (ctx) => {
    const reqBody = ctx.request.body;
    const Video = mongoose.model('Video')
    await Video.remove({_id:reqBody.id},(err,row)=>{
        if(err){
            ctx.body={code:'05',message:err}
        }else{
            ctx.body={code:'03',message:'删除成功！'}
        }
    }).catch(err => {
        ctx.body = {code: '05', message:err}
    })
    // //检查参数
    // if(!reqBody.currentPage){
    //     ctx.body={code:'404',message:'currentPage 是必须的'}
    // }else if(!reqBody.pageSize){
    //     ctx.body={code:'404',message:'pageSize 是必须的'}
    // }else if(!reqBody.keyWord){
    //     ctx.body={code:'404',message:'keyWord 是必须的'}
    // }

})

module.exports = router
