import { appId } from "./constant.js";
import { transformPx, addStyle } from "./utils.js";

export const showOpenTag = () => {
  const openTag = document.createElement("div");
  // 开放标签容器样式
  openTag.className = "wxOpenTag";
  document.getElementsByTagName("body")[0].appendChild(openTag);
  // 开放标签样式
  const style = {
    width: `${transformPx(160)}px`,
    height: `${transformPx(40)}px`,
    fontSize: `${transformPx(14)}px`,
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#37f",
    borderRadius: `${transformPx(8)}px`,
  };
  openTag.innerHTML = `
  <wx-open-launch-app appid=${appId} id="openTag" extinfo=${"someInfo"}>
    <script type="text/wxtag-template"></script>
  </wx-open-launch-app>
  `;
  const ref = document.getElementById("openTag");
  const btn = document.createElement("div");
  addStyle(btn, style);
  btn.innerHTML = "App内打开";
  ref.children[0].appendChild(btn);
  // 开放标签绑定事件
  const launch = (e) => console.log("success");
  const error = (e) => console.log(e.detail);
  ref.addEventListener("launch", launch);
  ref.addEventListener("error", error);
};
