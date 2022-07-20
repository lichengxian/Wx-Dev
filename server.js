import { appId, appSecret } from "./constant.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { createHash } = require("crypto");
const express = require("express");
const https = require("https");

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
// 开启服务器
app.listen(3000, () => console.log("服务器已开启"));

// 网页授权接口
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

// 缓存
const cache = Object.create(null);
// 微信SDK接口
app.get("/sdk", function (req, res) {
  // 获取AccessToken
  const getAccessToken = () => {
    return new Promise((resolve, reject) => {
      const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
      https
        .get(URL, (res) => {
          let rawData = "";
          res.on("data", (data) => (rawData += data));
          res.on("end", () => resolve(JSON.parse(rawData)));
        })
        .on("error", (e) => console.log(e.message));
    });
  };
  // 通过AccessToken获取jsapi_ticket
  const getJsapiTicket = (access_token) => {
    return new Promise((resolve, reject) => {
      const URL = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
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
  const wxsdk = async () => {
    if (!cache.access_token) {
      const token = await getAccessToken();
      // 请求报错
      if (!token.access_token) {
        return res.send({ code: token.errcode, message: token.errmsg });
      }
      cache.access_token = token.access_token;
      console.log("已缓存access_token: ", cache.access_token);
    }
    if (!cache.jsapi_ticket) {
      const jsapi_ticket = await getJsapiTicket(cache.access_token);
      // 请求报错
      if (jsapi_ticket.errcode) {
        return res.send({
          code: jsapi_ticket.errcode,
          message: jsapi_ticket.errmsg,
        });
      }
      cache.jsapi_ticket = jsapi_ticket.ticket;
      console.log("已缓存jsapi_ticket: ", cache.jsapi_ticket);
    }
    const { noncestr, timestamp, url } = req.query;
    const string = `jsapi_ticket=${
      cache.jsapi_ticket
    }&noncestr=${noncestr}&timestamp=${timestamp}&url=${decodeURIComponent(
      url
    )}`;
    const signature = createHash("sha1").update(string).digest("hex");
    return res.send({
      code: 0,
      message: "success",
      data: signature,
    });
  };
  wxsdk();
});
