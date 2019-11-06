// 数据过滤方法
const dataFilter = new Map();

dataFilter.set("All", (lists) => {
  return lists.filter(() => true);
})
dataFilter.set("Active", (lists) => {
  return lists.filter(item => !item.done);
})
dataFilter.set("Completed", (lists) => {
  return lists.filter(item => item.done);
})

/*主要原用的是复杂数据的存储规则实现数据互通*/
/*****Vue主要逻辑代码********/
const app = new Vue({
  el: '#app',
  data: {
    // 输入框数据
    inputTxt: '',
    // 每条数据对象数组
    lists: JSON.parse(localStorage.getItem("lists")) || [],
    // 点击对象
    current: null,
    // 初始化列表状态
    filterStatus: localStorage.getItem('filterStatus') || 'All'
  },
  computed: {
    //未完成数量
    activeNum() {
      return this.lists.filter(item => !item.done).length;
    },
    // 清空完成按钮显示隐藏
    clsShow() {
      return this.lists.some(item => item.done);
    },
    // 全选按钮状态
    everyDone() {
      return this.lists.every(item => item.done);
    },
    //  渲染数组
    showLists() {
      return dataFilter.get(this.filterStatus)(this.lists);
    }
  },
  methods: {
    // 数据回车输入
    onEnter() {
      if (!this.inputTxt) {
        alert("数据为空");
        return;
      }
      this.lists.unshift({ id: (Date.now().toString() + Math.random()).replace(/D/g, ""), msg: this.inputTxt, done: false });
      this.inputTxt = "";
      // 本地数据同步
      localStorage.setItem('lists', JSON.stringify(this.lists));
    },
    // 单个删除
    onDelete(item) {
      this.lists.splice(this.lists.indexOf(item), 1);
    },
    // 清除所有已完成
    clsCompleted() {
      for (let index = 0; index < this.lists.length; index++) {
        const element = this.lists[index];
        if (element.done) {
          this.onDelete(element);
          index--;
        }
      }
    },
    // 全选按钮
    onEveryDone(event) {
      this.lists.forEach(item => item.done = event.target.checked);
    },
    // 双击编辑
    onEdit(item) {
      this.current = item;
    },
    // 失焦保存编辑
    onSaveBlur(event, item) {
      item.msg = event.target.value;
      this.current = null;
    },
    // 回车保存编辑
    onSaveEnter(event, item) {
      event.target.blur();
    },
    // esc退出编辑
    onEsc() {
      this.current = null;
    },
    // 数据过滤
    onFilter(event) {
      // console.log(event.target.text);  //获取按钮内容
      // console.log(window.location.hash);  //获取锚点
      this.filterStatus = event.target.text;
    }
  },
  watch: {
    // 深度监听lists,保证改变对象内属性done改变也就触发
    lists: {
      handler() {
        localStorage.setItem('lists', JSON.stringify(this.lists));
      },
      deep: true
    },
    // 数据过滤状态
    filterStatus() {
      localStorage.setItem('filterStatus', this.filterStatus);
    }
  },
  //使用钩子
  directives: {
    focus: {
      inserted(element) {
        element.focus();
      }
    }
  }
})