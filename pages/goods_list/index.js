
/* 
1 上拉加载下一页数据
  1 先找到 上拉-滚动条触底事件（在页面的生命周期事件中见过 onReachBottom）
  2 先判断 有没有下一页数据  （页码，页容量，总条数）
    1 获取到总页数  9页  
      总页数 = Math.ceil(总条数 / 页容量  )
              21 / 10=2.1 Math.ceil(2.1)=3
      页容量：10，
      总条数：21 
      总页数：3 
    2 只要拿 当前的页码 1  和 总页数做个判断
  3 当当前的页码 大于或者等于 总页码  
    没下一页数据
    否侧 还有下一页数据 
  4 确定有下一页数据
    1 页码 ++
    2 重新发送异步请求 （bug！  需要拿新旧数组做一个拼接即可 ）
  5 没有 下一页数据
    弹窗提示用户即可！！！
2 下拉刷新
  1 需要在页面的json文件中 开启 下拉刷新  
    "enablePullDownRefresh": true
    "backgroundTextStyle": "dark"
  2 监听事件 onPullDownRefresh
  3 事件触发
    1 重置页面  -> 重置数据  
      1 重置页面   pagenum: 1,goodsList =[]
      2 发送异步请求 获取数据 （）
    2 等待数据都回来 手动关闭 下拉组件！！  
      wx.stopPullDownRefresh()

 */
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";

Page({
  data: {
    titleList: [
      { id: 0, text: "综合" },
      { id: 1, text: "销量" },
      { id: 2, text: "价格" }
    ],
    currentIndex: 0,
    // 页面显示的数组
    goodsList: [],
    // 还有没有数据
    isNoMore: false
  },
  // 全局的请求参数对象
  QueryParams: {
    // 查询的关键字  可以为空
    query: "",
    // 分类id  从分类页面 传递过来
    cid: "",
    // 页码 第几页
    pagenum: 1,
    // 页容量 一页可以放几条数据 
    pagesize: 10
  },
  // 总页数
  TotalPages: 1,

  onLoad(options) {
    const { cid } = options;
    this.QueryParams.cid = cid;

    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {

    const res = await request({ url: "/goods/search", data: this.QueryParams });
    const newGoodsList = res.goods;
    const beforeGoodsList = this.data.goodsList;
    const total = res.total;
    this.TotalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      goodsList: [...beforeGoodsList, ...newGoodsList]
    })
    wx.stopPullDownRefresh();

    // request({
    //   url: "/goods/search",
    //   data: this.QueryParams
    // }).then(res => {
    //   // 接口返回新数组
    //   const newGoodsList = res.data.message.goods;
    //   // 获取data中的旧数组
    //   const beforeGoodsList = this.data.goodsList;
    //   // 总条数
    //   const total = res.data.message.total;
    //   // 计算总页数
    //   this.TotalPages = Math.ceil(total / this.QueryParams.pagesize);
    //   // console.log(this.TotalPages);
    //   // 当要实现加载下一页数据的时候 需要的是拿旧数组和新数组进行 拼接

    //   this.setData({
    //     goodsList: [...beforeGoodsList, ...newGoodsList]
    //   })

    //   // 关闭下拉刷新组件 
    //   wx.stopPullDownRefresh();
    // })



  },

  // 滚动条触底事件
  onReachBottom() {

    // 1 判断有没有下一页数据
    if (this.QueryParams.pagenum >= this.TotalPages) {
      // 没有下一页
      // console.log("不要再滑动了 没有数据 ");
      wx.showToast({
        title: '不要再滑动了',
        icon: "none"
      });

      this.setData({
        isNoMore: true
      })

    } else {
      // 有下一页数据
      this.QueryParams.pagenum++;
      // 重新发送异步请求。
      this.getGoodsList();
    }
  },

  // 页面下拉刷新事件
  onPullDownRefresh() {
    // 1 重置 页码 
    this.QueryParams.pagenum = 1;
    // 2 重置 data中的商品数组
    this.setData({
      goodsList: []
    })
    // 3 重新发送异步请求
    this.getGoodsList();

  },

  handleItemChange(e) {
    this.setData({
      currentIndex: e.detail.index
    })
  }
})