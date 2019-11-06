// 本地数据初始化，开启一次即可
// loadData();

// Vue所有逻辑
const app = new Vue({
  el: '#app',
  data: {
    //输入框数据
    txt: "",
    // 保存首次进入编辑模式的txt数据
    saveTxt: "",
    //本地获取每条数据所有信息,flag标记是否显示  -->数据持久化
    lists: localStorage.getItem('lists') ? JSON.parse(localStorage.getItem('lists')) : [],
    // 全选
    everyFlat: false,
    // 显示或隐藏
    showFlatT: true,
    showFlatF: true,
    activeNum: 1
  },
  methods: {
    //   回车
    ent() {
      if (!this.txt) {
        alert("内容不能为空");
        return;
      }
      this.lists.unshift({ msg: this.txt, flat: false, editingFlat: false });
      this.txt = "";
    },
    // 改变
    ckChange() {
      // 改变自己是否显示的标志
      // 使用节点操作
      //   event.target.checked ? event.target.parentNode.parentNode.classList.add("completed") : event.target.parentNode.parentNode.classList.remove("completed");
      // 获取checked值操作
      // event.target.checked ? this.lists[index].flat = true : this.lists[index].flat = false;

      /*节点使用v-model绑定lists[index].flat以上操作都不需要*/
      // 将全选显示按钮关闭
      this.everyFlat = false;
    },
    // 删除
    del(index) {
      this.lists.splice(index, 1);
    },
    // 显示隐藏
    everyShow() {
      // 解决当一个一个点选中时，再点全选失灵，需要点第二次才生效（原因：在单个操作是否选中时，全选按钮是关闭的false，此时点击令其变为true，可原本所有元素已经是true，所以点击时看不到效果，点击第二次时变为false，才看到效果）

      this.num ? this.everyFlat = !this.everyFlat : this.everyFlat = false;
      // 同步所有标记
      this.lists.forEach(item => item.flat = this.everyFlat);
    },
    // 清空完成数据
    cls() {
      for (let index = 0; index < this.lists.length; index++) {
        const item = this.lists[index];
        if (item.flat == true) {
          this.del(index);
          // 保持索引位置
          index--;
        }
      }
    },
    // 所有数据
    all() {
      this.showFlatT = true;
      this.showFlatF = true;
      this.activeNum = 1;
    },
    // 完成数据
    complete() {
      this.showFlatT = true;
      this.showFlatF = false;
      this.activeNum = 3;
    },
    // 未完成
    active() {
      this.showFlatT = false;
      this.showFlatF = false;
      this.activeNum = 2;
    },
    // 双击编辑
    editing(index) {
      this.saveTxt = this.lists[index].msg;
      this.lists[index].editingFlat = true;
    },
    // 编辑失去焦点
    blurEdit(index) {
      this.lists[index].editingFlat = false;
    },
    // 回车失去焦点
    enterEdit(event) {
      event.target.blur();
    },
    // esc退出编辑
    escEdit(event, index) {
      this.lists[index].msg = this.saveTxt;
      event.target.blur();
    }
  },
  computed: {
    // 未完成条数
    num() {
      return this.lists.filter(item => item.flat == false).length;
    },
    // 清除按钮是否隐藏
    clsShow() {
      return this.lists.some(item => item.flat == true);
    }
  },
  // 监听
  watch: {
    // 数据lists
    lists() {
      // 本地数据同步
      localStorage.setItem("lists", JSON.stringify(this.lists));
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
});

// 本地数据函数
function loadData() {
  localStorage.setItem('lists', JSON.stringify([{
    msg: "我是一条小数据",
    flat: true,
    editingFlat: false
  }, {
    msg: "我是第二条小数据",
    flat: false,
    editingFlat: false
  }]));
}