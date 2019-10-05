/* 
首页
1 获取接口数据  轮播图
2 使用封装好的异步代码来发送请求 
  1 在小程序中 要引入js文件的话，建议把路径补全！！！
  2 在被导出的js中 使用
    export const 变量名 
    在导入的时候 直接通过 解构的代码来获取
    import {变量名 } from "路径";
3 统一在 request文件中 加入了调用的 loading方法
  1 需要在同时发送出去的请求都回来了 
    再去结束 loading 
 */


import { request } from "../../request/index.js";

Page({

  data: {

    //   轮播图数组
    swiperList: [],
    // 导航数组
    catitemList: [],
    // 楼层数组
    floorList: []
  },

  onLoad() {

    // 调用小程序内置的 loading 效果
    // wx.showLoading({
    //   title: "加载中",
    //   // 遮罩层  true-> 用户无法再次点击 屏幕 
    //   mask: true
    // });
      
    // setTimeout(() => {
      
    //   wx.hideLoading();
        
    // }, 3000);

    this.getSwiperData();
    this.getCatitems();
    this.getfloorList();

  },
  // 获取轮播图 数据
  getSwiperData() {

    request({
      url: "/home/swiperdata"
    }).then(result => {
      this.setData({
        // swiperList: result.data.message
        swiperList: result
      })
    })
  },
  // 获取导航数据
  getCatitems() {

    request({
      url: "/home/catitems"
    }).then(result => {
      this.setData({
        catitemList: result
      })
    })
  },
  // 获取楼层数据
  getfloorList() {
    request({
      url: "/home/floordata"
    }).then(result => {
      this.setData({
        floorList: result
      })
    })
  }


})

// wx2dae2a0d5b21ea67
// wxfb52f2d7b2f6123a


