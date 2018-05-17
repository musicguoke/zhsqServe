<template>
  <Content :style="{padding: '0 50px'}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>资源列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="card-content">
        <Menu theme="light" active-name="1">
          <MenuItem name="1">数据资源目录</MenuItem>
          <MenuItem name="2">720资源</MenuItem>
          <MenuItem name="3">图片资源</MenuItem>
          <MenuItem name="4">区域概况</MenuItem>
          <MenuItem name="5">扶贫信息</MenuItem>
          <MenuItem name="6">专题配置</MenuItem>
          <MenuItem name="7">地图配置</MenuItem>
        </Menu>
      </div>
    </Card>
  </Content>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.ivu-tree-arrow {
  color: #495060;
}
.card-content {
  display: flex;
}
</style>
