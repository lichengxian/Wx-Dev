// 判断微信平台
const ua = navigator.userAgent.toLowerCase();
export const isWechat = /micromessenger/.test(ua);

// AJAX请求
export const ajax = {
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
export function query() {
  const map = {};
  const params = window.location.search.substring(1).split("&");
  params.forEach((item) => {
    const temp = item.split("=");
    map[temp[0]] = temp[1];
  });
  return map;
}

// JSONP
export function jsonp(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.setAttribute("src", url);
    document.getElementsByTagName("head")[0].appendChild(script);
    script.onload = resolve();
  });
}

// 生成随机字符串
export function randomString(number = 16) {
  const templateChars = "abcdefghijklmnopqrstuvwxwyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const result = [];
  for (let i = 0; i < number; i++) {
    result.push(templateChars.charAt(Math.floor(Math.random() * 51.99)));
  }
  return result.join("");
}

// 样式适配
export const transformPx = (px) => {
  return (document.body.clientWidth / 375) * px;
};

// 给元素添加style
export const addStyle = (target, styles) => {
  let styleStr = "";
  for (const key of Object.keys(styles)) {
    target.style[key] = styles[key];
  }
  return styleStr;
};
