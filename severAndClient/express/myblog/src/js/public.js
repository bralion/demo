function dataSrc(){//绑定面包屑导航事件和样式
    $("iframe").contents().find('span[data-src]').addClass('canClick')
    $("iframe").contents().find('span[data-src]').click(function (e) {
        console.log(123)
        var srcUrl='[data-src="'+$(e.target).attr("data-src")+'"]'
        console.log(srcUrl)
        $(srcUrl).click();
    })
}
function transfromTime(time) {//传入一个带有时区 的字符串，返回一个正常的字符串
        var oldDate = new Date(time).toJSON();
        var newDate = new Date(+new Date(oldDate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
       return newDate
}
function geturl(name) {//在location中查找传递过来的参数
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = window.parent.document.getElementById("iframeIndex").contentWindow.location.search.match(reg);
    if (arr != null) {
        return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    }
    return "";
}
function getMonthDay(time) {
    var month = new Date(time).getMonth() + 1
    var day = new Date(time).getDate()
    if (month < 10) {
        month = '0' + month
    }
    var newTime = month + "-" + day;
    return newTime
}
function getTime(time) {
    var hour = new Date(time).getHours()
    var minutes = new Date(time).getMinutes()
    var second = new Date(time).getSeconds()
    var newTime = hour + ":" + minutes+ ":" + second;
    return newTime
}

function randomColor(a) {//随机生成颜色和互补色
    var r = parseInt(Math.random() * a + 255 - a) //105到255
    var g = parseInt(Math.random() * a + 255 - a) //105到255
    var b = parseInt(Math.random() * a + 255 - a) //105到255
    var color=[]
    color[0] = 'rgb(' + r + ',' + g + ',' + b + ')'
    color[1] = 'rgb(' +(r-118) + ',' + (g-118) + ',' + (b-118) + ')';
    return color
}