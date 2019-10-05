/* 
1 给输入框绑定一个事件   input事件 
  1 在事件中 获取 输入框的值
  1.5 简单做个非空的验证
  2 把输入框的值发送到后台 
  3 把返回的数据 渲染到页面中即可
2 在用户的输入 一秒后 再发送请求  防抖 防止抖动  （ 通过定时器来清除上一次的输入）
  huawei
  1 h 
  2 u 
3 点击取消按钮
  1 隐藏自己
  2 清除 数组数据
  3 清除 输入框的值
4 点击超链接 跳转到详情页面
 */

import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
  data: {
    list: [],
    // 是否是输入状态
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  timeId: -1,

   handleInput(e) {
    const { value } = e.detail;
    if (value.trim()) {
      this.setData({
        isFocus: true
      })

      // 用来清除上一次的输入 
      clearTimeout(this.timeId);

      this.timeId = setTimeout(() => {
        this.getQueryList(value);
      }, 1000);
    }
  },
  async getQueryList(value) {

    const res = await request({ url: "/goods/qsearch", data: { query: value } });
    this.setData({
      list: res
    })


  },
  // 点击取消按钮
  handleCancel() {
    this.setData({
      list: [],
      isFocus: false,
      inpValue: ""
    })
  }
})