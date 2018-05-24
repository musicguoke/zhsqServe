<template>
  <Menu 
    mode="horizontal" 
    :theme="theme1" 
    active-name="1" 
    @on-select="handleMenuClick"
  >
    <MenuItem name="content-list">
      <Icon type="ios-paper"></Icon>
      目录管理
    </MenuItem>
    <Submenu name="2">
      <template slot="title">
        <Icon type="loop"></Icon>
          权限管理
      </template>
      <MenuItem name="user-list">用户管理</MenuItem>
      <MenuItem name="suser-group-list">用户组管理</MenuItem>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon type="loop"></Icon>
          交互管理
      </template>
      <MenuItem name="push-manage">推送管理</MenuItem>
      <MenuItem name="message-manage">短信管理</MenuItem>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <Icon type="stats-bars"></Icon>
          行为分析
      </template>
      <MenuItem name="user-statistics">用户访问</MenuItem>
      <MenuItem name="data-statistics">数据访问</MenuItem>
      <MenuItem name="search-statistics">搜索访问</MenuItem>
      <MenuItem name="6-3">用户轨迹</MenuItem>
    </Submenu>
    <Submenu name="5">
      <template slot="title">
        <Icon type="disc"></Icon>
          系统监控
      </template>
      <MenuItem name="7-1">服务监控</MenuItem>
      <MenuItem name="7-2">硬件监控</MenuItem>
    </Submenu>
  </Menu>  
</template>

<script>
export default {
  data() {
    return {
      theme1: 'light'
    }
  },
  methods: {
    handleMenuClick(name) {
      this.$router.push(`${name}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-menu {
  display: flex;
  justify-content: space-between;
  &::after {
    background: transparent;
  }
}
.ivu-menu-horizontal {
  height: 30px;
  line-height: 30px;
}
</style>
