<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>搜索管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="card-content">
        <Menu theme="light" active-name="synthetical-periphery" @on-select="menuChange">
          <!-- <MenuItem name="periphery-search">周边搜索</MenuItem> -->
          <MenuItem name="synthetical-periphery">综合周边</MenuItem>
          <MenuItem name="plan-periphery">规划周边</MenuItem>
          <MenuItem name="search-lexicon">搜索词库</MenuItem>
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
  width: 900px;
  margin-left: 16px;
}
.ivu-table-wrapper {
  width: 100%;
}
.card-content {
  display: flex;
}
</style>
