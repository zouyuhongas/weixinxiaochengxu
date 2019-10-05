// components/YGTabs/index.js
Component({
  properties: {
    titleList: {
      type: Array,
      value: []
    },
    currentIndex: {
      type: Number,
      value: 0
    }
  },
  // 组件中要加事件的时候 需要在methods里面加
  methods:{
    handleTap(e){
      // console.log(e.target.dataset.index);
      const {index}=e.target.dataset;
      // 在子组件中 触发父组件中的自定义事件
      this.triggerEvent("itemChange",{index});
    }
  }
})
