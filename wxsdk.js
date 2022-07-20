import { jsonp, randomString, ajax } from "./utils.js";
import { appId } from "./constant.js";

// 微信JS-SDK
const wxsdkURL = "//res.wx.qq.com/open/js/jweixin-1.6.0.js";
// 获取签名
const getSignature = (str, time) => {
  const url = encodeURIComponent(location.href.split("#")[0]);
  return ajax.get(
    `${location.protocol}//${location.hostname}:3000/sdk?noncestr=${str}&timestamp=${time}&url=${url}`
  );
};
// 初始化微信
const initWeChat = (nonceStr, timestamp, signature) => {
  return new Promise((resolve, reject) => {
    window.wx.config({
      debug: false,
      appId: appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: [
        "updateAppMessageShareData",
        "updateTimelineShareData",
        "onMenuShareWeibo",
        "chooseImage",
        "uploadImage",
        "downloadImage",
        "previewImage",
        "openLocation",
        "getLocation",
        "closeWindow",
        "scanQRCode",
      ],
      openTagList: ["wx-open-launch-app"],
    });
    window.wx.ready(() => resolve(window.wx));
    window.wx.error(reject);
  });
};
// 注入微信SDK
export const initWxSDK = () => {
  return jsonp(wxsdkURL).then(() => {
    const nonceStr = randomString();
    const timestamp = Math.floor(Date.now() / 1000);
    return getSignature(nonceStr, timestamp).then((signature) =>
      initWeChat(nonceStr, timestamp, signature)
    );
  });
};
