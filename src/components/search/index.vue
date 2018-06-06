<template>
  <div class="seach-condition">
    <div class="search-box" v-if="searchShow">
      <Input v-model="searchContent" placeholder="请输入搜索内容..." style="width: 200px" />
      <span @click="handleSearch" style="margin: 0 10px;">
        <Button type="primary" icon="search">搜索</Button>
      </span>
      <Button @click="handleReset" type="ghost">清空</Button>
    </div>
    <div class="features-button">
      <i-button class="marginRight" v-if="buildShow" @click="build">新增</i-button>
      <i-button v-if="importShow" @click="importFile">导入</i-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchShow: {
      type: Boolean,
      default: true
    },
    buildShow: {
      type: Boolean,
      default: true
    },
    importShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchContent: ''
    }
  },
  methods: {
    handleSearch() {
      if(this.searchContent === '') {
        this._mm.errorTips('请输入搜索内容')
        return
      }
      this.$emit('on-search', this.searchContent)
    },
    handleReset() {
      // 清空搜索条件
      this.searchContent = ''
      this.$emit('on-reset')
    },
    build() {
      this.$emit('on-build')
    },
    importFile() {
      this.$emit('on-import')
    }
  }
}
</script>

<style lang="scss" scoped>
.seach-condition {
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
}
</style>
