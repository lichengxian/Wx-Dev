// 公众号信息
export const appId = "wxbcc1eb17b5d50398";
export const appSecret = "9ab1a2627e9ac81a2359708d8d7f6c9b";
// 回调页
export const cbURL = encodeURIComponent(`http://10.86.125.20:5500/`);
// 分享链接，静默授权
export const shareURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${cbURL}&response_type=code&scope=snsapi_base#wechat_redirect`;
// 主动授权链接，额外带state参数
export const authURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${cbURL}&response_type=code&scope=snsapi_userinfo&state=auth#wechat_redirect`;
