<template>
  <Menu 
    mode="horizontal" 
    :theme="theme1" 
    active-name="1" 
    @on-select="handleMenuClick"
  >
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-paper"></Icon>
          目录管理
      </template>
      <MenuItem name="content-list">资源目录</MenuItem>
      <MenuItem name="release">发布目录</MenuItem>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon type="loop"></Icon>
          权限管理
      </template>
      <MenuItem name="user-list">用户管理</MenuItem>
      <MenuItem name="role-list">角色管理</MenuItem>
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
        <Icon type="loop"></Icon>
          版本管理
      </template>
      <MenuItem name="software-version">软件版本</MenuItem>
      <!-- <MenuItem name="version-description">版本描述</MenuItem> -->
    </Submenu>
    <Submenu name="5">
      <template slot="title">
        <Icon type="stats-bars"></Icon>
          行为分析
      </template>
      <MenuItem name="user-statistics">用户访问</MenuItem>
      <MenuItem name="data-statistics">数据访问</MenuItem>
      <MenuItem name="search-statistics">搜索访问</MenuItem>
      <MenuItem name="5-3">用户轨迹</MenuItem>
    </Submenu>
    <Submenu name="6">
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
  props: {
    query: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      theme1: 'light'
    }
  },
  methods: {
    handleMenuClick(name) {
      this.$router.push({
        path: `${name}`,
        query: this.query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-menu {
  display: flex;
  justify-content: space-between;
  z-index: 901;
  &::after {
    background: transparent;
  }
}
.ivu-menu-horizontal {
  height: 36px;
  line-height: 36px;
}
</style>
