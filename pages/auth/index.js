/* 
1 获取用户token
  1 构成参数  
    1 来自 用户信息
    2 来自 wx登录
  2 发送到后台 获取 用户token
2 token获取成功后
  1 把token 存入到缓存中 
  2 返回上一页 
 */

import regeneratorRuntime from '../../lib/runtime/runtime';
import { login,request } from "../../request/index.js";
Page({
  handleGetuserinfo(e) {
    this.wxLogin(e);
  },

  // 执行微信登录
  async wxLogin(e) {
    const { code } = await login();
    const { encryptedData, rawData, iv, signature } = e.detail;
    const tokenParam = {
      code,
      encryptedData, rawData, iv, signature
    }
    const res=await request({url:"/users/wxlogin",method:"post",data:tokenParam});
    
    wx.setStorageSync("token", res.token);

    wx.navigateBack({
      // 返回上几页  
      delta: 1
    });
      
      
    
  }
})