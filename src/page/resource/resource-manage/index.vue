<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>资源列表</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div class="card-content">
        <div class="left-menu">
          <Menu theme="light" width="100%" active-name="data-type" @on-select="menuChange">
            <MenuItem name="data-type">数据类型</MenuItem>
            <MenuItem name="resource-catalog">数据资源目录</MenuItem>
            <MenuItem name="720-resource">720资源</MenuItem>
            <MenuItem name="image-resource">图片资源</MenuItem>
            <MenuItem name="area-target">区域指标</MenuItem>
            <MenuItem name="data-target">数据指标</MenuItem>
            <!-- <MenuItem name="fp-info">扶贫信息</MenuItem> -->
            <MenuItem name="map-configure">地图配置</MenuItem>
            <MenuItem name="macro-data">宏观数据</MenuItem>
            <MenuItem name="area-text">区域文本</MenuItem>
            <MenuItem name="STopic-type">专题类型</MenuItem>
            <MenuItem name="authority-config">功能模块</MenuItem>
            <MenuItem name="statistics">统计配置</MenuItem>
            <MenuItem name="zh-en">中英文对照</MenuItem>
            <MenuItem name="area-overview">区域概况</MenuItem>
            <MenuItem name="file-upload">文本文件上传</MenuItem>
          </Menu>
        </div>
        <div class="table">
          <keep-alive>
            <router-view class="router" />
          </keep-alive>
          <!-- <router-view v-if="!$route.meta.keepAlive" class="router" /> -->
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
export default {
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px'
    }
  },
  methods: {
    //menu改变
    menuChange(name) {
      this.$router.push(`${name}`)
    },
  }
}
</script>

<style lang="scss" scoped>
.ivu-tree-arrow {
  color: #495060;
}
.left-menu {
  width: 240px;
  overflow-x: hidden;
  overflow-y: auto;
}
.table {
  width: 900px;
  margin-left: 16px;
}
.ivu-table-wrapper {
  width: 100%;
}
.card-content {
  display: flex;
  justify-content: space-between;
}
</style>
