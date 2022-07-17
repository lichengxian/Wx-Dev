const authBtn = document.getElementById("authBtn");
const list = document.getElementById("list");
const openId = document.getElementById("openId");
const UserName = document.getElementById("UserName");
const UserPhoto = document.getElementById("UserPhoto");
// 公众号信息
const appId = "wxbcc1eb17b5d50398";
// 回调页
const cbURL = encodeURIComponent(`http://127.0.0.1:5500/`);
// 分享链接，静默授权
const shareURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${cbURL}&response_type=code&scope=snsapi_base#wechat_redirect`;
// 主动授权链接，额外带state参数
const authURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${cbURL}&response_type=code&scope=snsapi_userinfo&state=auth#wechat_redirect`;
// 判断微信平台
const ua = navigator.userAgent.toLowerCase();
const isWechat = /micromessenger/.test(ua);
// AJAX请求
const ajax = {
  get(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.response);
            if (!res.code) resolve(res.data);
            else reject(res);
          }
        }
      };
    });
  },
};
// 解析URL的query参数
function query() {
  const map = {};
  const params = window.location.search.substring(1).split("&");
  params.forEach((item) => {
    const temp = item.split("=");
    map[temp[0]] = temp[1];
  });
  return map;
}
// 初始化用户信息
let UserInfo = {
  openId: "",
  UserName: "",
  UserPhoto: "",
};
// 声明完以上内容，开始获取URL上的参数
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
    // 1是静默授权，0是主动授权
    ajax
      .get(`http://127.0.0.1:3000/auth?code=${code}&type=${auth ? 0 : 1}`)
      .then((res) => {
        console.log(res);
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
// 按钮点击事件，获取主动授权
const handleAuth = () => {
  if (!auth) {
    window.location.replace(authURL);
  }
};
authBtn.addEventListener("click", handleAuth);
