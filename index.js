const authBtn = document.getElementById("authBtn");
const list = document.getElementById("list");
const openId = document.getElementById("openId");
const UserName = document.getElementById("UserName");
const UserPhoto = document.getElementById("UserPhoto");
// AJAX请求
const ajax = {
  get(url) {
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.response);
            resolve(res);
          }
        }
      };
    });
  },
};
// 初始化用户信息
let UserInfo = {
  openId: '',
  UserName: '',
  UserPhoto: '',
};

const auth = () => {
    list.style.display = "block";
    openId.innerHTML = UserInfo.openId;
    UserName.innerHTML = UserInfo.UserName;
    UserPhoto.style.backgroundImage = `url(${UserInfo.UserPhoto})`;
};
authBtn.addEventListener("click", auth);

// 页面一挂载就发起请求
ajax.get("http://127.0.0.1:3000/auth").then(res => UserInfo = res);
