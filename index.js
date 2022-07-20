import { query, ajax, isWechat } from "./utils.js";
import { initWxSDK } from "./wxsdk.js";
import { shareURL, authURL } from "./constant.js";
import { showOpenTag } from "./openTagBtn.js";

const authBtn = document.getElementById("authBtn");
const openId = document.getElementById("openId");
const UserName = document.getElementById("UserName");
const UserPhoto = document.getElementById("UserPhoto");
const scan = document.getElementById("scan");
const scanres = document.getElementById("scanres");

// 初始化用户信息
let UserInfo = {
  openId: "",
  UserName: "",
  UserPhoto: "",
};
// 按钮点击事件，获取主动授权
const handleAuth = () => {
  if (!auth) {
    window.location.replace(authURL);
  }
};
authBtn.addEventListener("click", handleAuth);
// 微信扫一扫事件
const handlescan = () => {
  wx.scanQRCode({
    needResult: 0,
    scanType: ["qrCode", "barCode"],
    success: function (res) {
      scanres.innerHTML = res.resultStr;
    },
  });
};

// 判断用户是否曾经主动授权过
const auth = localStorage.getItem("Auth") || query().state || "";
const code = query().code || "";
const lastCode = sessionStorage.getItem("vercode");
// 在微信平台中
if (isWechat) {
  // 储存本次code
  sessionStorage.setItem("vercode", code);
  // 二次分享无code，保证每次页面刷新，均存在有效的code，
  if (code === lastCode || !code) {
    window.location.replace(shareURL);
  } else {
    // 调用微信SDK设置右上角分享，开启扫一扫
    initWxSDK().then((wx) => {
      const params = {
        title: "测试分享",
        desc: "这里是描述",
        link: shareURL,
        imgUrl: "",
      };
      wx.updateAppMessageShareData(params);
      wx.updateTimelineShareData(params);
      wx.onMenuShareWeibo(params);
      showOpenTag();
      scan.addEventListener("click", handlescan);
    });
    // 网页授权，1是静默授权，0是主动授权
    ajax
      .get(
        `${location.protocol}//${
          location.hostname
        }:3000/auth?code=${code}&type=${auth ? 0 : 1}`
      )
      .then((res) => {
        console.log("用户基本信息：", res);
        UserInfo.openId = res.openId;
        if (res.UserName && res.UserPhoto) {
          UserInfo.UserName = res.UserName;
          UserInfo.UserPhoto = res.UserPhoto;
          // 主动授权后，储存记录
          localStorage.setItem("Auth", 1);
        }
      })
      .then(() => {
        openId.innerHTML = UserInfo.openId;
        UserName.innerHTML = UserInfo.UserName;
        UserPhoto.style.backgroundImage = `url(${UserInfo.UserPhoto})`;
      })
      .catch((e) => console.log(e.message));
  }
}
