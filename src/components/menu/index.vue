<template>
  <Menu 
    mode="horizontal" 
    :theme="theme1" 
    active-name="1" 
    @on-select="handleMenuClick"
  >
    <MenuItem name="index">
      <Icon type="ios-paper"></Icon>
      首页
    </MenuItem>
    <MenuItem name="system-manage">
      <Icon type="pricetags"></Icon>
      产品管理
    </MenuItem>
    <Submenu name="3">
      <template slot="title">
        <Icon type="ios-people"></Icon>
          用户管理
      </template>
      <MenuItem name="user-list">用户列表</MenuItem>
      <MenuItem name="department-list">部门列表</MenuItem>
      <MenuItem name="manager-list">管理员列表</MenuItem>
      <MenuItem name="contacts-list">联系人列表</MenuItem>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <Icon type="document-text"></Icon>
          资源管理
      </template>
      <MenuItem name="resource-manage">数据资源管理</MenuItem>
      <MenuItem name="search-manage">搜索管理</MenuItem>
    </Submenu>
    <Submenu name="5">
      <template slot="title">
        <Icon type="loop"></Icon>
          交互管理
      </template>
      <MenuItem name="push-manage">推送管理</MenuItem>
      <MenuItem name="message-manage">短信管理</MenuItem>
      <MenuItem name="technical-support">技术支持</MenuItem>
      <MenuItem name="software-version">软件版本</MenuItem>
    </Submenu>
    <Submenu name="6">
      <template slot="title">
        <Icon type="stats-bars"></Icon>
          行为分析
      </template>
      <MenuItem name="user-statistics">用户访问</MenuItem>
      <MenuItem name="data-statistics">数据访问</MenuItem>
      <MenuItem name="search-statistics">搜索访问</MenuItem>
      <!-- <MenuItem name="6-3">用户轨迹</MenuItem> -->
    </Submenu>
    <Submenu name="7">
      <template slot="title">
        <Icon type="disc"></Icon>
          系统监控
      </template>
      <MenuItem name="sever-monitor">服务监控</MenuItem>
      <!-- <MenuItem name="7-2">硬件监控</MenuItem> -->
    </Submenu>
    <Submenu name="8">
      <template slot="title">
        <Icon type="gear-a"></Icon>
          系统配置
      </template>
      <MenuItem name="parameter-configure">参数配置</MenuItem>
      <MenuItem name="data-visit">数据访问</MenuItem>
    </Submenu>
  </Menu>  
</template>

<script>
export default {
  data() {
    return {
      theme1: 'light',
      userInfo: ''
    }
  },
  created() {
    // 用户权限信息
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
  },
  methods: {
    handleMenuClick(name) {
      this.$router.push(`${'/'+ 'zhsq_admin'+'/' + name}`)
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
