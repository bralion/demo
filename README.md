##目录结构

每一个demo必须有一个readme.md文件，便于拉取和启动项目

```
--publicSever     公共服务器  供不需要专门的静态demo使用
--publicStatic    公共静态demo存放地址，内部是一个一个完整得静态demo
--severAndClient  需要服务器的demo，内部是一个一个完整的demo

```




##每个项目的reademe.md 必须有如下启动说明

```
复制下列代码在  gitbash上运行便可以复制demo相关代码

mkdir demo1;cd demo1;git init;git remote add -f origin git@github.com:bralion/demo.git;git config core.sparsecheckout true;echo "severAndClient/demo1/" >> .git/info/sparse-checkout;git checkout master;


mkdir demo1;
cd demo1;
git init;     													   #新建一个空的库
git remote add -f origin git@github.com:bralion/demo.git;          #远程加载库
git config core.sparsecheckout true;          					   #允许使用sparse checkout
echo "severAndClient/demo1/" >> .git/info/sparse-checkout;         #将需要下载的文件路径加入到配置文件，需要添加多个则多写一条记录
git checkout master;											   #拉取相关的文件

```