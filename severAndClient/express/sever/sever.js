//1:加载相关模块  http express mysql
const http = require("http");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs=require('fs');
const svgCaptcha = require("svg-captcha");
var cookieParser = require('cookie-parser');
var session = require('express-session');

console.log(1);
//2:创建连接池
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'blog',
    connectionLimit: 5   //连接池中对象
});
console.log(2);
//3:创建服务器
var app = express();
var server = http.createServer(app);
server.listen(80);
console.log(3);
//使用express自带中间件访问静态资源
app.use(express.static("../myblog"));
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({limit: "5mb", extended: true, parameterLimit:5000}));
app.use(cookieParser('sessiontest'));
app.use(session({
    secret: 'sessiontest',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));
//4:服务器全局变量
var VerificationCode={};//生成验证码并且保存到全局变量

// 验证码
app.post("/pages/getCode", (req, res) => {
    if(req.session.user){//如果已经登录过
        var data={}
        data.code='008'
        data.message='欢迎回来'+req.session.user
        res.json(data);
        return
    }
    verifycodeGetController(req, res);
});
// 首页判断是否已经登录了
app.post("/pages/isLogin", (req, res) => {
    if(req.session.user){//如果已经登录过
        var data={}
        data.code='001'
        data.name=req.session.user
        data.userId=req.session.userId
        res.json(data);
        return
    }else{
        var data={}
        data.code='002'
        res.json(data);
        return
    }
});
app.post("/pages/login", (req, res) => {
    console.log(req.body)
    if(req.session.user){//已经登陆过
        var data={}
        data.code='003'
        data.message='欢迎回来'+req.session.user
        res.json(data)
        return
    }
    if(req.body.verificationCode==VerificationCode[req.body.sessionId]){
        // console.log('验证码正确')
        //验证用户名和密码
        ////获取连接发送sql语句
        pool.getConnection((err, conn) => {
            conn.query("select password,userId from bloguser where userName=?", [req.body.userName], (err, result) => {

                if(result[0]!=undefined&&result[0].password==req.body.password){
                   //登陆成功
                    req.session.user=req.body.userName;//写入session
                    req.session.userId=result[0].userId;//写入session
                    var data={}
                    data.code='001'
                    data.message='登录成功'
                    res.json(data)
               }
               else{
                    var data={}
                    data.code='002'
                    data.message='用户名或密码错误'
                   res.json(data)
               }
                //7:释放连接
                conn.release();
            });
        });
    }else{
        var data={}
        data.code='002'
        data.message='验证码错误'
        res.json(data)

    }
});
function verifycodeGetController(req, res) {
    // 验证码，对了有两个属性，text是字符，data是svg代码
    var sessionId='s'+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)+parseInt(Math.random()*10)
    console.log("res")
    var code = svgCaptcha.create({
        // 翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 36,
        // 噪声线条数
        noise: 3,
        // 宽度
        width: 80,
        // 高度
        height: 30,
    });
    // 保存到session,忽略大小写
    VerificationCode[sessionId]= code.text.toLowerCase();
    // 返回数据直接放入页面元素展示即可
    data={
        code:'001',
        data:code.data,
        sessionId:sessionId
    }
    res.json(data);
}


//5:接收客户端提交的请求 /user/3  /user/5
app.get("/pages/position/:position&:name&:ipAdtr", (req, res) => {
    var login=false;
    if(req.session.user){
       login=true;
    }
    console.log(4);
    //5:获取参数值
    var map = req.params.position;
    var name = req.params.name;
    var ipAdtr= req.params.ipAdtr;
    console.log("insert into map(name,map,ipAdr) values('" + name + "','[" + map + "]')");
    ////6:获取连接发送sql语句
    pool.getConnection((err, conn) => {
        conn.query("insert into map(name,map,ipAdr) values(?,?,?)", [name, map,ipAdtr], (err, result) => {
            //result
            res.json(login);
            //7:释放连接
            console.dir(result);//NaN
            conn.release();
        });
    });
});
app.get("/pages/getPosition/:name", (req, res) => {
    var name = req.params.name;
    pool.getConnection((err, conn) => {
        conn.query("select * from map where name=?", [name], (err, result) => {
            //result
            res.json(result);
            //7:释放连接
            //console.dir(result);//NaN
            conn.release();
        });

    });
})
app.get("/pages/getName", (req, res) => {
    pool.getConnection((err, conn) => {
        conn.query("select mapId,ipAdr,name,map from map", (err, result) => {
            //result
            res.json(result);
            console.log(result)
            //7:释放连接
            //console.dir(result);//NaN
            conn.release();
        });

    });
})
Date.prototype.Format = function (fmt) {//时间对象转字符串
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

app.post("/ueditor/commitBlog", (req, res) => {
    if(req.session.user) {//如果已经登录过
        console.log(req.body)
        var content = req.body.text;
        var date = (new Date(req.body.date)).Format("yyyy-MM-dd hh:mm:ss");
        var isAllow = parseInt(req.body.isAllow);
        var text = req.body.txt;
        var title = req.body.title;
        // var isAllow=parseInt(req.body.isAllow);
        var classify = req.body.classify;
        var userid = req.session.userId;
        if(req.body.bowenId){//为更改博客内容的请求
            pool.getConnection((err, conn) => {
                conn.query("update ueditor set userId=?,blogTitle=?,content=?,contentTxt=?,classifyId=?,isAllowComment=? where bowenId=?", [userid, title, content, text, classify, isAllow,req.body.bowenId], (err, result) => {
                    //result
                    var data={}
                    data.code='001'
                    res.json(data);
                    //7:释放连接
                    //console.dir(result);//NaN
                    conn.release();
                });
            });

        }else{
            pool.getConnection((err, conn) => {
                conn.query("INSERT INTO ueditor(userId,blogTitle,content,contentTxt,editTime,classifyId,isAllowComment) VALUES (?,?,?,?,?,?,?)", [userid, title, content, text, date, classify, isAllow], (err, result) => {
                    //result
                    var data={}
                    data.code='001'
                    data.content=result;
                    res.json(data);
                    //7:释放连接
                    //console.dir(result);//NaN
                    conn.release();
                });

            });
            pool.getConnection((err, conn) => {//统计数量加一
                conn.query("update blogclassify set classifyNumber=classifyNumber+1 where classifyId = ?", [classify], (err, result) => {
                    //7:释放连接
                    //console.dir(result);//NaN
                    conn.release();
                });

            });
        }
    }
    else {
        var data={}
        data.code='002'
        data.content='未登录上传博客';
        res.json(data);
    }
});
app.post("/pages/readBlog", (req, res) => {
    var pages =req.body.pages ;
    pool.getConnection((err, conn) => {
        conn.query("SELECT u.classifyId,u.boWenId,u.blogTitle,u.content,u.editTime,u.isAllowComment,b.userName,c.classifyName FROM blogUser b,ueditor u,blogclassify c WHERE b.userId=u.userId AND u.classifyId=c.classifyId and u.boWenId=?", [pages], (err, result) => {
            //result
            if(req.session.userId){//传回usrid，控制是否可以编辑
                result[0].userId=req.session.userId;
            }
            views=result.viewNumber;
            res.json(result);
            //7:释放连接
            conn.release();
        });
    });
    pool.getConnection((err, conn) => {//浏览量加一
        conn.query("update ueditor set viewNumber=viewNumber+1 where boWenId = ?", [pages], (err, result) => {
            if(err){console.log(err)}
            console.log('aa')
        });
        conn.release();
    });
});
app.post("/pages/deleteBlog", (req, res) => {//删除博客
    var pages =req.body.bowenId ;
    var classify =req.body.classify ;
    if(req.session.userId){//传回usrid，控制是否可以编辑
        pool.getConnection((err, conn) => {
            conn.query("delete from ueditor where boWenId=?", [pages], (err, result) => {
                //result
                if(!err){
                    var data={}
                    data.code='001'
                    data.message='删除成功'
                    res.json(data);
                    //7:释放连接
                    conn.release();
                }else{
                    console.log(err)
                    var data={}
                    data.code='002';
                    data.message='删除失败';
                    res.json(data);
                    //7:释放连接
                    conn.release();
                }

            });
        });
        pool.getConnection((err, conn) => {//统计数量加一
            conn.query("update blogclassify set classifyNumber=classifyNumber-1 where classifyId = ?", [classify], (err, result) => {
                //7:释放连接
                //console.dir(result);//NaN
                conn.release();
            });

        });
    }else{
        var data={}
        data.code='003'
        data.message='对不起,你没有权限删除'
        res.json(data);
    }

});
app.post("/pages/getBlogs", (req, res) => {
    if(req.session.userId){
        pool.getConnection((err, conn) => {
            conn.query("SELECT u.boWenId,u.blogTitle,u.editTime,u.isAllowComment,b.userName,c.classifyName FROM blogUser b,ueditor u,blogclassify c WHERE b.userId=u.userId AND u.classifyId=c.classifyId", (err, result) => {//获取 内容包括隐藏内容
                //result
                res.json(result);
                //7:释放连接
                console.dir(result);//NaN
                conn.release();
            });

        });
    }else{
        pool.getConnection((err, conn) => {
            conn.query("SELECT u.boWenId,u.blogTitle,u.editTime,u.isAllowComment,b.userName,c.classifyName FROM blogUser b,ueditor u,blogclassify c WHERE b.userId=u.userId AND u.classifyId=c.classifyId AND u.isAllowComment=1", (err, result) => {
                //result
                res.json(result);
                //7:释放连接
                console.dir(result);//NaN
                conn.release();
            });
        });
    }

});
app.post("/pages/getSrc", (req, res) =>{
    var src =req.body.src ;
    console.log(src);
    fs.readFile('../myblog/src/lrc/'+src,'utf-8',function(err,data){
        if(err){
            console.error(err);
            res.json('未有相关歌词');
        }
        else{
            //result
            res.json(data);
            //7:释放连接
            console.log(data);
        }
    });
})
app.post("/pages/getRecommend", (req, res) =>{//获取首页推荐文章6个
    if(req.session.userId){
        pool.getConnection((err, conn) => {
            conn.query("SELECT u.viewNumber,u.boWenId,b.userName,u.blogTitle,u.contentTxt,u.editTime,c.classifyName FROM ueditor u,bloguser b,blogclassify c WHERE u.userId=b.userId AND u.classifyId=c.classifyId ORDER BY boWenId desc", (err, result) => {
                var array=[]
                var length=result.length>8?8:result.length;
                for(var i=0;i<length;i++){
                    array[i]=result[i]
                }
                //result
                res.json(array);
                //7:释放连接
                conn.release();
            });
        });
    }else{
        pool.getConnection((err, conn) => {
            conn.query("SELECT u.viewNumber,u.boWenId,b.userName,u.blogTitle,u.contentTxt,u.editTime,c.classifyName FROM ueditor u,bloguser b,blogclassify c WHERE u.userId=b.userId AND u.classifyId=c.classifyId AND u.isAllowComment=1 ORDER BY boWenId desc", (err, result) => {
                var array=[]
                var length=result.length>8?8:result.length;
                for(var i=0;i<length;i++){
                    array[i]=result[i]
                }
                //result
                res.json(array);
                //7:释放连接
                conn.release();
            });
        });
    }

});
app.post("/pages/getMood", (req, res) =>{//获取首页个人心情6个
    if(req.session.userId){
        pool.getConnection((err, conn) => {
            conn.query("SELECT u.viewNumber,u.boWenId,b.userName,u.blogTitle,u.content,u.editTime FROM ueditor u,bloguser b WHERE u.userId=b.userId AND u.classifyId=0 ORDER BY boWenId desc", (err, result) => {
                var array=[]
                var length=result.length>5?5:result.length;
                for(var i=0;i<length;i++){
                    array[i]=result[i]
                }
                //result
                console.log(array)
                res.json(array);
                //7:释放连接
                conn.release();
            });
        });
    }else{
        pool.getConnection((err, conn) => {
            conn.query("SELECT u.viewNumber,u.boWenId,b.userName,u.blogTitle,u.content,u.editTime FROM ueditor u,bloguser b WHERE u.userId=b.userId AND u.classifyId=0 AND u.isAllowComment=1 ORDER BY boWenId desc", (err, result) => {
                var array=[]
                console.log(result);
                var length=result.length>5?5:result.length;
                for(var i=0;i<length;i++){
                    array[i]=result[i]
                }
                //result
                 console.log(array)
                res.json(array);
                //7:释放连接
                conn.release();
            });
        });
    }

})
app.post("/pages/getTag", (req, res) =>{
    pool.getConnection((err, conn) => {
        conn.query("SELECT classifyId,classifyName,classifyNumber from blogclassify ORDER BY classifyId desc", (err, result) => {
            var data={};
            data.code='001';
            data.data=result;
            //result
            res.json(data);
            //7:释放连接
            conn.release();
        });
    });
})


//以下是编辑器相关模块
var ueditor = require("ueditor")
var path = require('path');
var ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
app.use("/ueditor/ue", ueditor(path.join(__dirname, '../myblog'), function (req, res, next) {

    // ueditor 客户发起上传图片请求

    if (req.query.action === 'uploadimage') {
        console.log("tupian")
        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png

        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var img_url = '/img/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/img/ueditor/'; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/nodejs/config.json')
    }
}));
//编辑器相关模块完毕
