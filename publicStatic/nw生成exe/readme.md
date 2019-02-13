##1.获取代码

```
复制下列代码在  gitbash上运行便可以复制demo相关代码
	mkdir makeExe;cd makeExe;git init;git remote add -f origin git@github.com:bralion/demo.git;git config core.sparsecheckout true;echo "publicStatic/nw生成exe" >> .git/info/sparse-checkout;git checkout master;
注释：
	mkdir makeExe;
	cd makeExe;
	git init;     													   #新建一个空的库
	git remote add -f origin git@github.com:bralion/demo.git;          #远程加载库
	git config core.sparsecheckout true;          					   #允许使用sparse checkout
	echo "publicStatic/nw生成exe" >> .git/info/sparse-checkout;         #将需要下载的文件路径加入到配置文件，需要添加多个则多写一条记录
	git checkout master;

```

##2.启动项目

```
	命令行进入文件夹 makeExe;解压nw.zip到当前文件夹（由于github限制大小不能大于100m）
	点击nw.exe即可看到效果


```
##3.扩展

```
	nw项目开发文件下载：https://nwjs.io/downloads/
	nw项目打包发布教程：

		1.下载并且安装壳包装软件：enigma virtul box
		2.将app压缩成app.zip
		3.将文件夹下运行 copy /b nw.exe+app.zip app.exe      （生成exe文件，但是该文件不能脱离文件夹上下文）
		4.运用打包工具添加exe执行的上下文  输入文件为app.exe  输出文件自动填充  左下角添加文件和文件夹（注意拖动文件locales、app和其它相关文件夹）；
		5.点击打包即可。

	nw开发资料：

		nw环境下对应的全局变量和方法：  http://docs.nwjs.io/en/latest/References/webview%20Tag/



```
