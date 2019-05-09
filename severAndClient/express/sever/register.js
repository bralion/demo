/*下面是nodejs原生的服务器写法,下面的demo完成了获取请求的功能，能够接受到请求。要完成静态服务器的功能（就是发送文件 html css
js等文件到客户端，则需要对请求进行判断然后写上对应的请求头文件。然后运用nodejs自带 的fs模块发送文件）*/
/*express是对这一系列功能的封装，轻量级。*/
var http=require("http");
var mysql=require("mysql");
var server = http.createServer();
var url=require("url");
var querystring=require("querystring");
server.listen("3000");
server.on('request',(request,response)=>{
    var arg = querystring.parse(url.parse(request.url).query);
    var addr=request.url.split("?")[0];
    console.log(addr);
    if(addr=="/register") {
        var name = arg.name;
        var password = arg.password;
       console.log("接收到参数" + name + password);
        response.writeHead("200", "ok", {
            "content-type": "text/html;charset=UTF-8"
        });
        if(name&&password){
            var connection = mysql.createConnection({
                host: '127.0.0.1',
                user: "root",
                password: "",
                database: 'blog'
            });
            //console.log('insert into user(name,pwd) values("' + name + '","' + password + '");');
            connection.query('insert into user(name,pwd) values("' + name + '","' + password + '");', function (err, results) {
                if(err){
                    response.write("注册失败！");
               }else{
                    response.write("注册成功！");

                }
                response.end();
            });
        }else{
            response.write("输入不合法！！");
            response.end();
        }
    }

});

