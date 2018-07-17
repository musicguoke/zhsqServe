<template>
  <div class="seach-condition">
    <div class="search-box" v-if="searchShow">
      <Input v-model="searchContent" placeholder="请输入搜索内容..." style="width: 200px" />
      <Select v-model="selectFilter" v-if="selectShow" style="width:200px" placeholder="请选择...">
        <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span @click="handleSearch" style="margin: 0 10px;">
        <Button type="primary" icon="search">搜索</Button>
      </span>
      <Button @click="handleReset" type="ghost">清空</Button>
    </div>
    <div class="features-button">
      <Button class="marginRight" v-if="buildShow" @click="build">新增</Button>
      <Button class="marginRight" v-if="importShow" @click="importFile">导入</Button>
      <Button class="marginRight" v-if="conditionExportShow" @click="exportFile">导出</Button>
      <a class="ivu-btn marginRight" v-if="exportShow" :href="`${uploadUrl}${exportUrl}`">导出</a>
      <Button v-if="deleteShow" type="error" :disabled="disabled" @click="deleteSomething">删除</Button>
    </div>
  </div>
</template>

<script>
import { url } from '@/api/config'

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
    },
    exportShow: {
      type: Boolean,
      default: false
    },
    deleteShow: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: true
    },
    selectShow:{
      type:Boolean,
      default:false
    },
    conditionExportShow:{
      type:Boolean,
      default:false
    },
    exportUrl: '',
    selectList:''
  },
  data() {
    return {
      searchContent: '',
      uploadUrl: url,
      selectFilter:''
    }
  },
  methods: {
    handleSearch() {
      if(this.searchContent === '' && this.selectFilter == '') {
        this.$Message.error('请输入搜索内容')
        return
      }
      this.$emit('on-search', this.searchContent,this.selectFilter)
    },
    handleReset() {
      // 清空搜索条件
      this.searchContent = ''
      this.selectFilter = ''
      this.$emit('on-reset')
    },
    build() {
      this.$emit('on-build')
    },
    importFile() {
      this.$emit('on-import')
    },
    exportFile(){
      this.$emit('on-export')
    },
    deleteSomething() {
      this.$emit('on-delete')
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
