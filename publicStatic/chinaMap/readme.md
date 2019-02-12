##1.获取代码

```
复制下列代码在  gitbash上运行便可以复制demo相关代码
	mkdir chinaMap;cd chinaMap;git init;git remote add -f origin git@github.com:bralion/demo.git;git config core.sparsecheckout true;echo "publicSever/" >> .git/info/sparse-checkout;echo "publicStatic/chinaMap" >> .git/info/sparse-checkout;git checkout master;
注释：
	mkdir chinaMap;
	cd chinaMap;
	git init;     													   #新建一个空的库
	git remote add -f origin git@github.com:bralion/demo.git;          #远程加载库
	git config core.sparsecheckout true;          					   #允许使用sparse checkout
	echo "publicSever/" >> .git/info/sparse-checkout;         #将需要下载的文件路径加入到配置文件，需要添加多个则多写一条记录
	echo "publicStatic/chinaMap" >> .git/info/sparse-checkout;         #将需要下载的文件路径加入到配置文件，需要添加多个则多写一条记录
	git checkout master;

```

##2.启动项目

```
	命令行进入文件夹 publicSever
	npm install
	node app.js
	浏览器访问
	http://127.0.0.1:8085/chinaMap/yangchaolinIndex.html 即可

```