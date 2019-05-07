# 一个小的demo

功能1，前端调用摄像头实时展示摄像头信息，并可以调用本地摄像头进行拍照，将照片以base64上传给服务器端算法，服务器端根据base64生成图片并返回图片静态资源地址。
功能2，前端跳转页面并展示返回的静态图片   客户选择风格图片  通过接口将风格图片和原始图片地址上传给服务器，服务器根据上传的参数生成图片并返回地址。
功能3，可以实现返回重新拍照，重选风格等操作

主要有意义的功能   前端调用摄像头并且以base64上传。


##1.获取代码

```
复制下列代码在  gitbash上运行便可以复制demo相关代码
	mkdir picStyleDemo;cd picStyleDemo;git init;git remote add -f origin git@github.com:bralion/demo.git;git config core.sparsecheckout true;echo "publicStatic/talentConferenceDemo" >> .git/info/sparse-checkout;git checkout master;
注释：
	mkdir chinaMap;
	cd chinaMap;
	git init;     													   #新建一个空的库
	git remote add -f origin git@github.com:bralion/demo.git;          #远程加载库
	git config core.sparsecheckout true;          					   #允许使用sparse checkout
	echo "publicStatic/talentConferenceDemo" >> .git/info/sparse-checkout;         #将需要下载的文件路径加入到配置文件，需要添加多个则多写一条记录
	git checkout master;

```

##2.启动项目

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
