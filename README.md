# 微信开发Demo——JS-SDK注入与网页授权
## 项目配置
- 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
- [微信公众平台](http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)的测试公众号。测试号无法展示开放标签，必须使用官方认证的公众服务号。
- 设置公众测试号**JS接口安全域名**和**网页授权获取用户基本信息**。
- 前端页面使用VSCode的`Live Server`本地开启服务器，端口号是`5500`。后端使用Node的`express`本地开启服务器，端口号是`3000`。
- 具体步骤详见代码注释，详细操作可参考我的CSDN博客[微信开发](https://blog.csdn.net/weixin_52009092/article/details/125398688)篇。
## 项目启动
- 安装环境
```
npm i express
```
- 开启后端服务器
```
node server.js
```
- 微信开发者工具访问`Live Server`开启的页面URL即可。
