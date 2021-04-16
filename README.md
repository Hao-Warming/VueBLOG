# VueBLOG
 Vue.js+Node.js+Mongodb+Express的前后端分离的个人博客
 
 ## 主要技术构成
前端主要技术栈为vue.js、vue-router、 axios

后端主要技术栈为node.js、 mongodb、 Express

视图框架：iview

## 博客功能
### 前台页面
- 文章目录
- 动态显示文章
- 点赞
- 留言
- 文章分类显示
- 归档


### 后台管理页面
- 文章的增删改查
- 权限验证
- 登录验证
- markdown编辑器

## Setup

运行环境
- node.js
- mongoDB

克隆远程库
```
git clone https://github.com/FatDong1/VueBlog.git
```
进入项目目录VueBlog后，安装依赖
```
npm install
```
安装完数据库后，启动mongodb。（不要关闭当前窗口，然后重新打开另外一个dos窗口，进行下一个步骤）
```
mongod --dbpath d:\data      // d:\data 为数据库文件夹位置，可自行设置
```
运行服务器。（确保数据库mongodb已经启动，不要关闭当前窗口，然后重新打开另外一个dos窗口，进行下一个步骤）
```
npm run start
```
在8082端口热重载开发，等待一会后，会自动弹出浏览器窗口，加载会比较慢，请耐心等待
```
npm run dev
```
