<template>
  <Content>
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>搜索管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="card-content">
        <Menu theme="light" active-name="periphery-hotspot" @on-select="menuChange">
          <MenuItem name="periphery-search">周边搜索</MenuItem>
          <MenuItem name="search-lexicon">搜索词库</MenuItem>
          <MenuItem name="periphery-hotspot">周边热点</MenuItem>
          <MenuItem name="hot-search">热搜</MenuItem>
        </Menu>
        <div class="table">
          <router-view/>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    menuChange(name){
      //menu改变
      this.$router.push(`${name}`)
    }
  }
};
</script>

<style lang="scss" scoped>
.ivu-tree-arrow {
  color: #495060;
}
.table {
  width: 100%;
  margin-left: 16px;
}
.ivu-table-wrapper {
  width: 100%;
}
.card-content {
  display: flex;
}
</style>
