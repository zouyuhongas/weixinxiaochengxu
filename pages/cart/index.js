/* 
1 如何合理的获取 收货地址
  0 当用户点击了 "拒绝" 之后，第二次再点击的时候 无法再获取收货地址 （有区别于其他 获取用户信息 ）
  1 先检查 用户的授权-获取收货地址 状态    auth 
  2 auth 表示 用户是否曾经给过 权限
    1 auth = false 点击了 “取消”
      1 要诱导用户 自己 打开 “授权页面” 让用户自己给权限
      2 直接获取用户的收货地址 
    2 auth = true  表示 用户 曾经 点击了 “允许”
    3 auth = undefined  表示 用户 没有点击过取消和允许 
      当用户满足 2、3 的状态 直接获取用户的收货地址 
  3 通过 async的代码 来简化以上过程
    1 把   wx.getSetting 、 wx.openSetting 、wx.chooseAddress 
      改成 promise的形式 
  4 把收货地址存入到 缓存中（下次打开小程序获取页面使用） 和 data（给页面渲染要用的）
2 在 onShow 触发
  1 获取缓存中的 收货地址信息
  2 假设 有
    把按钮隐藏 再显示 地址信息
  3 假设 没有 
    按钮显示 
3 在 onShow 触发
  1 获取缓存中的购物车的数据 显示到页面中 
    1 回到了商品的详情页面 自己新增了一个 选中属性 checked
    2 直接循环渲染
4 计算 数据
  0 因为这个功能需要被调用多次 做个封装
  1 全选 
  2 总价格
  3 总购买数量 
5 商品的单选功能
  1 给复选框的父元素（checkbox-group） 绑定  bindchange
  2 获取当前的选中的状态
    0 如何获取到数组的中 被修改的元素 
    1 获取源购物车数组中的 元素的选中状态
    1 直接取反即可！！！
      carts[index].checked=!carts[index].checked;
  3 去修改 data中 carts 和 缓存中的carts
  5 再重新计算 数据（价格 数量 。。。）
6 商品的数量编辑
  1 给数量按钮 绑定 点击事件
    1 给 “+” 和 “-” 按钮都绑定同一个事件  “+” =>{{1}}  “-”=>{{-1}}
  2 传递一个参数 被点击的索引 index
  2 获取到被点击的商品 
    carts[index].num += operation;
  3 去修改 data中 carts 和 缓存中的carts
  4 再重新计算 数据（价格 数量 。。。）
7 商品的数量编辑 -  删除
  1 当用户点击 “-”  同时  nums 值 = 1 
  2 弹出窗口 询问用户 是否要删除 
  3 用户点击 了 “是”
  4 用户点击 了 “否” 
  5 很简单 。。。。
8 点击结算
  1 判断 用户有没有选中有购买的商品
  2 判断 用户有没有 选择 收货地址
  3 都满足了 跳转页面 跳转到 “支付页面”

  


 */
import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting, openSetting, chooseAddress, showModal, showToast } from "../../request/index.js";
Page({
  data: {
    // 用户收货信息
    address: {},
    // 购物车数据
    carts: [],
    // 全选状态 
    allChecked: false,
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
    const carts = wx.getStorageSync("carts");
    this.setData({ carts, address })

    this.countData(carts);

  },
  handleChooseAddress() {
    // const auth = result1.authSetting["scope.address"];
    // 1 获取用户 对于 收货地址的 授权状态
    this.getUserAddress();
  },
  // 获取用户的收货地址
  async getUserAddress() {
    try {
      // 1 获取用户的 授权状态
      const result1 = await getSetting();
      const auth = result1.authSetting["scope.address"];
      // 2 判断授权状态
      if (auth === false) {
        await openSetting();
      }
      const result2 = await chooseAddress();
      result2.detailAddress = result2.provinceName + result2.cityName + result2.countyName + result2.detailInfo;
      // 4 把收货地址存入到 缓存中（下次打开小程序获取页面使用） 和 data（给页面渲染要用的）
      this.setData({
        address: result2
      })
      wx.setStorageSync("address", result2);


    } catch (error) {
      console.log(error);
    }
  },
  // 计算数据
  countData(carts) {
    // 只要  carts 数组中 有一个元素的 checked=false 那么  allChecked=false
    let allChecked = true;
    //  要 元素的选中属性  checked=true 来计算价格 
    let totalPrice = 0;
    // 要 元素的选中属性  checked=true 来计算  数量
    let totalNum = 0;

    carts.forEach((v, i) => {
      if (v.checked) {
        // 计算价格和数量
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });

    allChecked = carts.length === 0 ? false : allChecked;

    this.setData({
      allChecked,
      totalPrice,
      totalNum
    })

  },
  // 商品的单选功能
  hanleItemChange(e) {
    // 1 获取要修改的元素的索引
    const { index } = e.target.dataset;
    // 2 获取 购物车数组
    let { carts } = this.data;
    // 3 选中属性取反
    carts[index].checked = !carts[index].checked;
    // 4 把购物车重新设置到 data中和缓存中
    this.setData({
      carts
    })
    // 5 填充回缓存中
    wx.setStorageSync("carts", carts);
    // 6 计算数据
    this.countData(carts);

  },
  // 数量的编辑事件
  async handleNumUpdate(e) {


    // console.log(e);
    // 获取用户点击的按钮
    const { operation, index } = e.target.dataset;
    let { carts } = this.data;

    // 判断 要执行 删除操作还是 正常的修改数据
    if (operation === -1 && carts[index].num === 1) {
      // 删除
      // 弹出窗口
      const res = await showModal({ title: "警告", content: "您确定要删除吗？" });
      if (res) {
        // 删除数组中的这个商品
        console.log("删除数组中的这个商品");
        carts.splice(index, 1);
      } else {
        return;
      }
    } else {
      carts[index].num += operation;
    }


    this.setData({
      carts
    })
    // 5 填充回缓存中
    wx.setStorageSync("carts", carts);
    // 6 计算数据
    this.countData(carts);

  },
  // 结算按钮的点击事件
  async handleOrderPay() {
    // 1 判断 用户有没有选中有购买的商品 totalNums
    // 2 判断 用户有没有 选择 收货地址  address.cityName 
    // 3 都满足了 跳转页面 跳转到 “支付页面”

    const { totalNum, address } = this.data;
    if (totalNum === 0) {
      await showToast({
        title: "您还没选购商品",
        icon: 'none',
        mask: true
      });
      return;
    }
    if (address === "") {
      await showToast({
        title: "请选择收货地址",
        icon: 'none',
        mask: true
      });
      return;
    }
    // console.log("可以跳转页面");
    wx.navigateTo({
      url: '/pages/pay/index'
    });
      
  }

})