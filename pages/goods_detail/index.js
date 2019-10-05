/*
1 点击轮播图 切换大图预览
  1 绑定点击事件
  2 调用 小程序中内置的方法 wx.previewImage
2 点击加入购物车
  1 通过使用本地存储来实现缓存数据
  2 要存下去的数据格式 数组 或者 对象
    [
       {
        商品id,
        商品名称,
        商品价格,
        图片地址,
        购买的数量 -还不能确定,
      }
    ]
3 点击加入购物车
    1 获取本地存储的数据  要么是一个空字符串 或 是一个 [{}]
      let cartList=wx.getStorageSync("carts") || [];
    2 判断当前的商品是否已经存在
      0 当前商品 不存在 第一次购买时候
      1 需要新增一个对象 -购买的数量:1
      2 cartList.push(新增一个对象)
      3 把 cartList   重新写入到本地存储中即可
    3 当前的商品已经存在 
      1 获取到已经存在的商品对象
      2 对象.购买的数量++
      3 cartList 重新写入到本地存储中即可
4 点击收藏按钮
    1 绑定 tap点击事件
    2 获取到缓存中的 收藏数据 collect || []
    3 判断 当前的商品是否被收藏
      1 被 收藏  了  把 该商品从 collect 删除
      2 没被 收藏 把 该商品 存入到  collect
    4 加一些提示
      1 图标变颜色
      2 弹窗提示 
*/

import regeneratorRuntime from '../../lib/runtime/runtime';
import { request, showToast } from "../../request/index.js";
Page({
  data: {
    // 商品的详情数据
    goodsObj: {},
    // 该商品是否被收藏
    isCollect: false
  },
  onLoad(options) {
    this.getGoodsDetail(options.goods_id);


  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: "/goods/detail", data: { goods_id } });
    this.setData({
      goodsObj: res
    })

    const { goodsObj } = this.data;
    let collect = wx.getStorageSync("collect") || [];
    const index = collect.findIndex(v => v.goods_id === goodsObj.goods_id);
    console.log(index);
    this.setData({
      isCollect: index === -1 ? false : true
    })
  },
  // 点击轮播图
  handleImagePreview(e) {

    // console.log(e);

    // 获取data中的商品对象
    const { goodsObj } = this.data;
    const urls = goodsObj.pics.map(v => v.pics_mid_url);
    // target 或者 currentTarget 这两个
    const current = e.target.dataset.current;
    wx.previewImage({
      // 被预览的图片路径数组
      // ["1.png"，"2.png"...]
      urls: urls,
      // 被点击的图片的路径
      current: current
    });

  },
  // 点击加入购物车
  handleCartAdd() {
    // 0 获取datavs的商品对象
    const { goodsObj } = this.data;
    // 1 获取本地存储中购物车数据
    let cartList = wx.getStorageSync("carts") || [];
    // 2 判断该商品对象是否存在于数组中了 
    const index = cartList.findIndex(v => v.goods_id === goodsObj.goods_id);
    if (index === -1) {
      // 找不到 第一次新增
      cartList.push({
        goods_id: goodsObj.goods_id,
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_small_logo: goodsObj.goods_small_logo,
        num: 1,
        checked: true
      })
    } else {
      // console.log("找到了");
      // 修改商品对象的数量
      cartList[index].num++;
    }
    // 把数组 存到 缓存中即可
    wx.setStorageSync("carts", cartList);
    // 弹出窗口提示用户
    wx.showToast({
      title: '加入购物车成功',
      mask: true
      // icon: 'success',
    });

  },
  // 点击收藏按钮
  async handleItemCollect() {

    const { goodsObj } = this.data;
    // 4.2 获取 缓存中的collect 数组
    let collect = wx.getStorageSync("collect") || [];
    // 4.3 判断该商品 是否存在于 数组中
    const index = collect.findIndex(v => v.goods_id === goodsObj.goods_id);
    if (index === -1) {
      // 不存在 就要收藏 
      collect.push(goodsObj);
      this.setData({
        isCollect:true
      })
      await showToast({ title: "收藏成功" });

    } else {
      // 存在 就要删除
      collect.splice(index, 1);
      this.setData({
        isCollect:false
      })
      await showToast({ title: "取消成功" });
    }
    wx.setStorageSync("collect", collect);
  }
})