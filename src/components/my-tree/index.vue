<template>
  <div :style="{width:tableWidth}" class='autoTbale'>
    <table class="table table-bordered" id='hl-tree-table'>
      <thead>
        <tr>
          <th v-for="(column,index) in cloneColumns" :key="index">
            <label v-if="column.type === 'selection'">
              <input type="checkbox" v-model="checks" @click="handleCheckAll">
            </label>
            <label v-else>
              {{ renderHeader(column, index) }}
              <span class="ivu-table-sort" v-if="column.sortable">
                <Icon type="arrow-up-b" :class="{on: column._sortType === 'asc'}" @click.native="handleSort(index, 'asc')" />
                <Icon type="arrow-down-b" :class="{on: column._sortType === 'desc'}" @click.native="handleSort(index, 'desc')" />
              </span>
            </label>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in initItems" :key="item.id" v-show="show(item)" :class="{'child-tr':item.parent}">
          <td :class="{'label-box': column.type === 'selection'}" 
            v-for="(column,snum) in columns" :key="column.key" :style="tdStyle(column)">
            <!-- 市县不让选择 -->
            <label v-if="column.type === 'selection'">
              <input type="checkbox" :value="item.id" v-model="checkGroup" @click="handleCheckClick(item,$event,index)">
            </label>
            <div class="btn-td" v-if="column.type === 'action'"> 
              <i-button :type="action.type" size="small" @click="RowClick(item,$event,index,action.text)" v-for='action in (column.actions)' v-if="checkBtn(item, action)" :key="action.text">
                {{action.text}}
              </i-button>
            </div>
            <label @click="toggle(index,item, $event)" v-if="!column.type">
              <span class="icon-box" v-if='snum==iconRow()'>
                <i v-html='item.spaceHtml'></i>
                <span class="item-icon-box" v-if="item.children&&item.children.length>0">
                  <!-- <i class="icon" :class="{'icon-plus':!item.expand,'icon-minus':item.expand }"></i> -->
                  <i class="folder" :class="{'icon-folder':!item.expand,'icon-folder-open':item.expand }"></i>
                </span>
                <span class="item-icon-box" v-else>
                  <!-- <i class="ms-tree-space"></i> -->
                  <i class="folder icon-leaf"></i>
                </span>
              </span>
              <span>{{renderBody(item,column)}}</span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'treeGrid',
  props: {
    columns: Array,
    items: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      initItems: [], //处理后数据数组
      cloneColumns: [], //处理后的表头数据
      checkGroup: [], //复选框数组
      checks: false, //全选
      screenWidth: document.body.clientWidth, //自适应宽
      tdsWidth: 0, //td总宽
      timer: false, //控制监听时长
      dataLength: 0, //树形数据长度
      deepList: []
    }
  },
  computed: {
    tableWidth() {
      return this.tdsWidth > this.screenWidth && this.screenWidth > 0 ? this.screenWidth + 'px' : '100%'
    }
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val
        this.timer = true
        setTimeout(() => {
          this.timer = false
        }, 400)
      }
    },
    items() {
      if (this.items) {
        this.dataLength = this.Length(this.items)
        this.initData(this.deepCopy(this.items), 1, null);
        this.checkGroup = this.renderCheck(this.items)
        if (this.checkGroup.length == this.dataLength) {
          this.checks = true
        } else {
          this.checks = false
        }
      }
    },
    columns: {
      handler() {
        this.cloneColumns = this.makeColumns();
      },
      deep: true
    },
    checkGroup(data) {
      this.checkAllGroupChange(data)
    },
  },
  mounted() {
    if (this.items) {
      this.dataLength = this.Length(this.items)
      this.initData(this.deepCopy(this.items), 1, null);
      this.cloneColumns = this.makeColumns();
      this.checkGroup = this.renderCheck(this.items)
      if (this.checkGroup.length == this.dataLength) {
        this.checks = true
      } else {
        this.checks = false
      }
    }
    // 绑定onresize事件 监听屏幕变化设置宽
    this.$nextTick(() => {
      this.screenWidth = document.body.clientWidth
    })
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    // 判断parentId，显示导入按钮
    checkBtn(row, column) {
      if(column.key && column.key === 'parentId') {
        return row[column.key] === '-1' ? true : false
      } else {
        return true
      }
    },
    // 有无多选框折叠位置优化
    iconRow() {
      for (var i = 0, len = this.columns.length; i < len; i++) {
        if (this.columns[i].type == 'selection') {
          return 1
        }
      }
      return 0
    },
    // 设置td宽度,td的align
    tdStyle(column) {
      var style = {}
      if (column.align) {
        style["text-align"] = column.align;
      }
      if (column.width) {
        style["max-width"] = column.width + 'px';
      }
      return style;
    },
    // 排序事件
    handleSort(index, type) {
      this.cloneColumns.forEach((col) => col._sortType = 'normal');
      if (this.cloneColumns[index]._sortType === type) {
        this.cloneColumns[index]._sortType = 'normal'
      } else {
        this.cloneColumns[index]._sortType = type
      }
      this.$emit('on-sort-change', this.cloneColumns[index]['key'], this.cloneColumns[index]['_sortType'])
    },
    // 点击某一行事件
    RowClick(data, event, index, text) {
      let result = this.makeData(data)
      this.$emit('on-row-click', result, event, index, text)
    },
    // 点击事件 返回数据处理
    makeData(data) {
      const t = this.type(data);
      let o;
      if (t === 'array') {
        o = [];
      } else if (t === 'object') {
        o = {};
      } else {
        return data;
      }
      if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
          o.push(this.makeData(data[i]));
        }
      } else if (t === 'object') {
        for (let i in data) {
          if (i != 'spaceHtml' && i != 'parent' && i != 'level' && i != 'expand' && i != 'isShow' && i !=
            'load') {
            o[i] = this.makeData(data[i]);
          }
        }
      }
      return o;
    },
    // 处理表头数据
    makeColumns() {
      let columns = this.deepCopy(this.columns);
      this.tdsWidth = 0
      columns.forEach((column, index) => {
        column._index = index;
        column._width = column.width ? column.width : '';
        column._sortType = 'normal';
        this.tdsWidth += column.width ? parseFloat(column.width) : 0;
      });
      return columns;
    },
    // 数据处理 增加自定义属性监听
    initData(items, level, parent) {
      this.initItems = []
      let spaceHtml = "";
      for (var i = 1; i < level; i++) {
        spaceHtml += "<i class='ms-tree-space'></i>"
      }
      items.forEach((item, index) => {
        item = Object.assign({}, item, {
          "parent": parent,
          "level": level,
          "spaceHtml": spaceHtml
        });
        if ((typeof item.expand) == "undefined") {
          item = Object.assign({}, item, {
            "expand": false
          });
        }
        if ((typeof item.show) == "undefined") {
          item = Object.assign({}, item, {
            "isShow": true
          });
        }
        if ((typeof item.isChecked) == "undefined") {
          item = Object.assign({}, item, {
            "isChecked": false
          });
        }
        item = Object.assign({}, item, {
          "load": (item.expand ? true : false)
        });
        this.initItems.push(item)
        // this.pushInitItems(item)
        if (item.children && item.expand) {
          this.initData(item.children, level + 1, item);
        }
      })
    },
    pushInitItems(item) {
      this.deepList.findIndex((v, index) => {
        if(v.id === item.id) {
          list.splice(index, 1, item)
        } else if(v.children) {
          v.children.map(h => this.pushInitItems(v.children, h))
        }
      })
      this.initItems = this.deepList
    },
    //  隐藏显示
    show(item) {
      return ((item.level == 1) || (item.parent && item.parent.expand && item.isShow));
    },
    toggle(index, item) {
      let result = this.makeData(item)
      this.$emit('on-expand-click', result, index, event)
      let level = item.level + 1;
      let spaceHtml = "";
      for (var i = 1; i < level; i++) {
        spaceHtml += "<i class='ms-tree-space'></i>"
      }
      if (item.children) {
        if (item.expand) {
          item.expand = !item.expand;
          this.close(index, item);
        } else {
          item.expand = !item.expand;
          if (item.load) {
            this.open(index, item);
          } else {
            item.load = true;
            item.children.forEach((child, childIndex) => {
              this.initItems.splice((index + childIndex + 1), 0, child);
              //设置监听属性
              this.$set(this.initItems[index + childIndex + 1], 'parent', item);
              this.$set(this.initItems[index + childIndex + 1], 'level', level);
              this.$set(this.initItems[index + childIndex + 1], 'spaceHtml', spaceHtml);
              this.$set(this.initItems[index + childIndex + 1], 'isShow', true);
              this.$set(this.initItems[index + childIndex + 1], 'expand', false);
            })
          }
        }
      }
    },
    open(index, item) {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          child.isShow = true;
          if (child.children && child.expand) {
            this.open(index + childIndex + 1, child);
          }
        })
      }
    },
    close(index, item) {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          child.isShow = false;
          child.expand = false;
          if (child.children) {
            this.close(index + childIndex + 1, child);
          }
        })
      }
    },
    //点击check勾选框,判断是否有children节点 如果有就一并勾选
    handleCheckClick(data, status) {
      data.isChecked = !data.isChecked
      this.handleCheck(data, data.isChecked)
    },
    handleCheck(data, status) {
      if(data.children) {
        data.children.map((v, index) => {
          v.isChecked = status
        })
      }
      if (data.isChecked) {
        let index = this.checkGroup.findIndex(v => v === data.id)
        if(index < 0) {
          this.checkGroup.push(data.id)
        }
      } else {
        this.checkGroup.map((v, i) => {
          if (this.checkGroup[i] == data.id) {
            this.checkGroup.splice(i, 1)
          }
        })
      }
      if(data.children) {
        data.children.map(v => this.handleCheck(v, status))
      }
    },
    //checkbox 全选 选择事件
    handleCheckAll() {
      this.checks = !this.checks;
      if (this.checks) {
        this.checkGroup = this.getArray(this.checkGroup.concat(this.All(this.items)))
      } else {
        this.checkGroup = []
      }
      // this.$emit('on-selection-change', this.checkGroup)
    },
    // 数组去重
    getArray(a) {
      var hash = {},
        len = a.length,
        result = [];
      for (var i = 0; i < len; i++) {
        if (!hash[a[i]]) {
          hash[a[i]] = true;
          result.push(a[i]);
        }
      }
      return result;
    },
    checkAllGroupChange(data) {
      if (this.dataLength > 0 && data.length === this.dataLength) {
        this.checks = true;
      } else {
        this.checks = false;
      }
      this.$emit('on-selection-change', this.checkGroup)
    },
    All(data) {
      let arr = []
      data.forEach((item) => {
        arr.push(item.id)
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.All(item.children));
        }
      })
      return arr
    },
    // 返回树形数据长度
    Length(data) {
      let length = data.length
      data.forEach((child) => {
        if (child.children) {
          length += this.Length(child.children)
        }
      })
      return length;
    },
    // 返回表头
    renderHeader(column, $index) {
      if ('renderHeader' in this.columns[$index]) {
        return this.columns[$index].renderHeader(column, $index);
      } else {
        return column.title || '#';
      }
    },
    // 返回内容
    renderBody(row, column, index) {
      if(column.key === 'updatetime') {
        return row[column.key] ? this._mm.formatDate(row[column.key]) : ''
      } else {
        return row[column.key]
      }
    },
    // 默认选中
    renderCheck(data) {
      let arr = []
      data.forEach((item) => {
        if (item._checked) {
          arr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.renderCheck(item.children));
        }
      })
      return arr
    },
    // 深度拷贝函数
    deepCopy(data) {
      var t = this.type(data),
        o, i, ni;
      if (t === 'array') {
        o = [];
      } else if (t === 'object') {
        o = {};
      } else {
        return data;
      }
      if (t === 'array') {
        for (i = 0, ni = data.length; i < ni; i++) {
          o.push(this.deepCopy(data[i]));
        }
        return o;
      } else if (t === 'object') {
        for (i in data) {
          o[i] = this.deepCopy(data[i]);
        }
        return o;
      }
    },
    type(obj) {
      var toString = Object.prototype.toString;
      var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
      };
      return map[toString.call(obj)];
    }
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>
<style lang="scss">
.autoTbale {
  overflow: auto;
}
table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}
.label-box > label > input {
  display: block;
  margin: 0 auto;
}
.table-bordered {
  border: 1px solid #ebebeb;
}
.table > tbody > tr > td,
.table > tbody > tr > th,
.table > thead > tr > td,
.table > thead > tr > th {
  border-top: 1px solid #e7eaec;
  line-height: 1.42857;
  padding: 8px 18px;
  vertical-align: middle;
}
.table-bordered > tbody > tr > td,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > td,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th {
  border: 1px solid #e7e7e7;
}
.btn-td {
  display: flex;
  justify-content: space-around;
}
.table > thead > tr > th {
  border-bottom: 1px solid #ddd;
}
.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th {
  background-color: #f5f5f6;
}
#hl-tree-table > tbody > tr {
  background-color: #fbfbfb;
}
#hl-tree-table > tbody > .child-tr {
  background-color: #fff;
}
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 14px;
  height: 14px;
}
.ms-tree-space::before {
  content: "";
}
#hl-tree-table th > label {
  margin: 0;
}
.table-bordered > tbody > tr > td > label,
.table-bordered > tbody > tr > td > label .icon-box,
.table-bordered > tbody > tr > td > label .item-icon-box {
  display: flex;
  align-items: center;
}
.icon {
  display: block;
  width: 18px;
  height: 24px;
}
.folder {
  display: block;
  width: 16px;
  height: 16px;
  margin: 0 4px;
}
.icon-plus {
  background: url("../../assets/elbow-plus.png") no-repeat;
  background-size: 100%;
}
.icon-minus {
  background: url("../../assets/elbow-minus.png") no-repeat;
  background-size: 100%;
}
.icon-folder {
  background: url("../../assets/folder.png") no-repeat;
  background-size: 100%;
}
.icon-folder-open {
  background: url("../../assets/folder-open.png") no-repeat;
  background-size: 100%;
}
.icon-leaf {
  background: url("../../assets/leaf.png") no-repeat;
  background-size: 100%;
}
.icon-elbow-line {
  background: url("../../assets/elbow-line.png") no-repeat;
  background-size: 100%;
}
.icon-elbow {
  background: url("../../assets/elbow.png") no-repeat;
  background-size: 100%;
}
.icon-elbow-end {
  background: url("../../assets/elbow-end.png") no-repeat;
  background-size: 100%;
}
</style>