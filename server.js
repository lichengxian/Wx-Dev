const express = require("express");
const https = require("https");
// 公众号信息
const appId = "wxbcc1eb17b5d50398";
const appSecret = "9ab1a2627e9ac81a2359708d8d7f6c9b";
// 创建一个服务器应用
const app = express();
// CORS跨域设置
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// 接口
app.get("/auth", function (req, res) {
  // 通过code获取AccessToken
  const getAccessToken = (code) => {
    return new Promise((resolve, reject) => {
      const URL = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
      https
        .get(URL, (res) => {
          let rawData = "";
          res.on("data", (data) => (rawData += data));
          res.on("end", () => resolve(JSON.parse(rawData)));
        })
        .on("error", (e) => console.log(e.message));
    });
  };
  // 通过AccessToken和openId获取UserInfo
  const getUserInfo = (accessToken, openId) => {
    return new Promise((resolve, reject) => {
      const URL = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN`;
      https
        .get(URL, (res) => {
          let rawData = "";
          res.on("data", (data) => (rawData += data));
          res.on("end", () => resolve(JSON.parse(rawData)));
        })
        .on("error", (e) => console.log(e.message));
    });
  };
  // 整体流程
  const wxAuth = async () => {
    // 解析query参数，字符串类型
    const { code, type } = req.query;
    const token = await getAccessToken(code);
    // 请求报错
    if (!token.access_token) {
      return res.send({ code: token.errcode, message: token.errmsg });
    }
    // 静默授权
    if (Number(type)) {
      return res.send({
        code: 0,
        message: "success",
        data: { openId: token.openid },
      });
      // 主动授权
    } else {
      const UserInfo = await getUserInfo(token.access_token, token.openid);
      // 请求报错
      if (!UserInfo.openid) {
        return res.send({ code: UserInfo.errcode, message: UserInfo.errmsg });
      }
      return res.send({
        code: 0,
        message: "success",
        data: {
          openId: UserInfo.openid,
          UserName: UserInfo.nickname,
          UserPhoto: UserInfo.headimgurl,
        },
      });
    }
  };
  wxAuth();
});
// 开启服务器
app.listen(3000, () => console.log("服务器已开启"));
