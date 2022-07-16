const express = require('express');
const https = require('https');
// 公众号信息
const appId = 'wxbcc1eb17b5d50398';
const appSecret = '9ab1a2627e9ac81a2359708d8d7f6c9b';
// 回调页
const URL = 'http://127.0.0.1:5500/5.WeiXin/';
// 开启一个服务器
const app = express();
// 跨域设置
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// 接口
app.get('/auth', function(req, res) {
  res.send({
    openId: "123",
    UserName: "456",
    UserPhoto: "",
  });
})

app.listen(3000, function() {
  console.log('服务器已开启');
});