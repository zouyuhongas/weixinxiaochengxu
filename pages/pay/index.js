/* 
1 在页面数据渲染时候 要加载的购物车数据 应该是 item.checked=true
  carts=carts.filter(v=>v.checked);
2 当用户点击 “结算”按钮
  1 绑定 点击事件
3 判断缓存中有没有token
  1 么有token 跳转页面 到 授权页面获取token
  2 有token 继续往下执行 
4 创建订单
  1 根据接口要求来构成参数
    1 请求头中 token
    2 请求体中  
5 获取支付参数
6 调起微信支付
7 查询刚才的查看订单支付状态
8 弹窗提示 支付成功
8.5 删除已经支付成功的购物车数据
  1 获取缓存中的完整的购物车数据（包含了有选中的和未选中）
  2 获取 缓存中的完整的数据 而不是 data中购物车数据（只包含选中了的数据 ）
9 跳转到订单页面

 */

import regeneratorRuntime from '../../lib/runtime/runtime';
import { request, requestPayment, showToast } from "../../request/index.js";
Page({
  data: {
    // 用户收货信息
    address: {},
    // 购物车数据
    carts: [],
    // 总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0
  },

  onShow() {
    // 1 获取缓存中的收货地址  默认值 空字符串 
    const address = wx.getStorageSync("address");
    // 2 给 address赋值
    // 3 获取缓存中的购物车数据
    let carts = wx.getStorageSync("carts") || [];
    // 筛选出 checked=true 数据
    carts = carts.filter(v => v.checked);
    this.setData({ carts, address })
    this.countData(carts);
  },
  // 计算数据
  countData(carts) {
    //  要 元素的选中属性  checked=true 来计算价格 
    let totalPrice = 0;
    // 要 元素的选中属性  checked=true 来计算  数量
    let totalNum = 0;

    carts.forEach((v, i) => {
      if (v.checked) {
        // 计算价格和数量
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }
    });
    this.setData({
      totalPrice,
      totalNum
    })
  },
  // 点击支付按钮
  handleOrderPay() {
    this.orderPay();
  },

  // 执行支付的逻辑
  async orderPay() {
    try {
      
    // 3 判断有没有token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 4  构造 订单参数
    //#region 构造订单参数
    const { totalPrice, address, carts } = this.data;
    const order_price = totalPrice;
    const consignee_addr = address.detailAddress;
    const goods = carts.map(v => {
      return {
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }
    });
    //#endregion 

    const orderParams = {
      order_price, consignee_addr, goods
    }
    // 4.1 开始创建订单
    const { order_number } = await request({ url: "/my/orders/create", method: "post", data: orderParams });
    // 5 获取支付参数
    const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number } });
    // 6 调起微信内置的支付
    await requestPayment(pay);
    // 7 查询刚才的订单支付状态
    const message = await request({ url: "/my/orders/chkOrder", method: "post", data: { order_number } });

    await showToast({ title: message, mask: true });
    // [].splice(index,1);
    // this.setData({
    //   carts:carts.filter(v=>!v.checked)
    // })
    // 保留未选中的商品  ==== 删除了 被选中的了商品
    let localCarts=wx.getStorageSync("carts");
    wx.setStorageSync("carts", localCarts.filter(v=>!v.checked));
    wx.navigateTo({
      url: '/pages/order/index',
    });
    } catch (error) {
        console.log(error);
    }
  }

})