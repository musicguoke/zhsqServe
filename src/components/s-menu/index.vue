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
      <MenuItem name="content-list" v-if="userinfo.role!==3">资源目录</MenuItem>
      <MenuItem
        name="release"
        v-if="userinfo.role!==3&&Number(query.type)!==2"
      >
        发布目录
      </MenuItem>
      <MenuItem name="featured-catalog">专题目录</MenuItem>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon type="loop"></Icon>
          权限管理
      </template>
      <MenuItem name="user-list">用户管理</MenuItem>
      <MenuItem name="role-list">角色管理</MenuItem>
    </Submenu>
    <Submenu name="3" v-if="userinfo.role!==3">
      <template slot="title">
        <Icon type="loop"></Icon>
          交互管理
      </template>
      <MenuItem name="push-manage">推送管理</MenuItem>
      <MenuItem name="message-manage">短信管理</MenuItem>
    </Submenu>
    <MenuGroup title="交互管理" v-else></MenuGroup>
    <!-- <Submenu name="4" v-if="userinfo.role!==3">
      <template slot="title">
        <Icon type="loop"></Icon>
          版本管理
      </template>
      <MenuItem name="software-version">软件版本</MenuItem>
      <MenuItem name="version-description">版本描述</MenuItem>
    </Submenu>
    <MenuGroup title="版本管理" v-else></MenuGroup> -->
    <Submenu name="5" v-if="userinfo.role!==3">
      <template slot="title">
        <Icon type="stats-bars"></Icon>
          行为分析
      </template>
      <MenuItem name="user-statistics">用户访问</MenuItem>
      <MenuItem name="data-statistics">数据访问</MenuItem>
      <MenuItem name="search-statistics">搜索访问</MenuItem>
      <!-- <MenuItem name="5-3">用户轨迹</MenuItem> -->
    </Submenu>
    <MenuGroup title="行为分析" v-else></MenuGroup>
    <!-- <Submenu name="6">
      <template slot="title">
        <Icon type="disc"></Icon>
          系统监控
      </template>
      <MenuItem name="sever-monitor">服务监控</MenuItem>
      <MenuItem name="7-2">硬件监控</MenuItem>
    </Submenu> -->
  </Menu>  
</template>

<script>
export default {
  data() {
    return {
      theme1: 'light'
    }
  },
  computed: {
    userinfo() {
      return JSON.parse(localStorage.getItem('userInfo'))
    },
    query() {
      return this.$store.state.params
    }
  },
  methods: {
    handleMenuClick(name) {
      this.$router.push({path: `${name}`})
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
.ivu-menu-horizontal, .ivu-menu-item-group-title {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
}
</style>
