<template>
    <div class="layout">
      <Layout>
        <Header>
          <div class="navbar-logo">
            <div class="layout-logo"></div>
            <span class="navbar-title">重庆市综合市情管理系统—<small>管理平台</small></span>
          </div>
          <div class="layout-nav">
            <div class="user-info">
              <span class="user-img"></span>
              <Dropdown trigger="hover" style="margin: 0 10px">
                  <a href="javascript:void(0)" style="color: #fff;">
                      超级管理员
                      <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                      <DropdownItem>修改密码</DropdownItem>
                      <DropdownItem>安全退出</DropdownItem>
                  </DropdownMenu>
              </Dropdown>
              <span class="msg-icon">
                <i>99+</i>
              </span>
            </div>
          </div>
        </Header>
        <Menu 
          :style="{padding: '0 50px'}" 
          mode="horizontal" 
          :theme="theme1" 
          active-name="1" 
          @on-select="handleMenuClick"
        >
          <MenuItem name="1">
            <Icon type="ios-paper"></Icon>
            首页
          </MenuItem>
          <Submenu name="2">
            <template slot="title">
              <Icon type="grid"></Icon>
                产品管理
            </template>
            <MenuItem name="2-1">系统列表</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              <Icon type="ios-people"></Icon>
                用户管理
            </template>
            <MenuItem name="3-1">用户列表</MenuItem>
            <MenuItem name="3-2">部门列表</MenuItem>
            <MenuItem name="3-3">管理员列表</MenuItem>
          </Submenu>
          <Submenu name="4">
            <template slot="title">
              <Icon type="document-text"></Icon>
                资源管理
            </template>
            <MenuItem name="4-1">数据资源管理</MenuItem>
            <MenuItem name="4-2">搜索管理</MenuItem>
          </Submenu>
          <Submenu name="5">
            <template slot="title">
              <Icon type="loop"></Icon>
                交互管理
            </template>
            <MenuItem name="5-1">推送管理</MenuItem>
            <MenuItem name="5-2">短信管理</MenuItem>
          </Submenu>
          <Submenu name="6">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
                行为分析
            </template>
            <MenuItem name="6-1">用户访问</MenuItem>
            <MenuItem name="6-2">数据访问</MenuItem>
            <MenuItem name="6-3">用户轨迹</MenuItem>
          </Submenu>
          <Submenu name="7">
            <template slot="title">
              <Icon type="disc"></Icon>
                系统监控
            </template>
            <MenuItem name="7-1">服务监控</MenuItem>
            <MenuItem name="7-2">硬件监控</MenuItem>
          </Submenu>
          <Submenu name="8">
            <template slot="title">
              <Icon type="gear-a"></Icon>
                系统配置
            </template>
            <MenuItem name="8-1">功能配置</MenuItem>
            <MenuItem name="8-2">数据访问</MenuItem>
          </Submenu>
        </Menu>
            <Content :style="{padding: '0 50px'}">
                <Breadcrumb :style="{margin: '20px 0'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
                </Breadcrumb>
                <Card>
                    <div style="min-height: 200px;">
                        <router-view/>
                    </div>
                </Card>
            </Content>
            <Footer class="layout-footer-center">
              <p>建设单位：重庆市地理信息中心 | 技术支持：重庆知行宏图科技有限公司</p>
              <p>邮箱：cqzhsq@qq.com | 联系电话：023-67033881 | 地址：重庆市渝北区冉家坝规划测绘创新基地1001室</p>
            </Footer>
        </Layout>
    </div>
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
      console.log(name)
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-layout-header {
  display: flex;
}
.ivu-select-dropdown {
  z-index: 999;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  color: #fff;
}
.navbar-logo {
  display: flex;
  align-items: center;
  .layout-logo {
    width: 85px;
    height: 46px;
    background: url("../assets/logo.png") no-repeat;
  }
  .navbar-title {
    font-size: 18px;
    font-weight: bold;
    margin-left: 14px;
  }
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .user-img {
    display: block;
    width: 39px;
    height: 39px;
    background-color: #fff;
    border-radius: 100%;
  }
  .user-name {
    font-weight: bold;
    margin-left: 10px;
    margin-right: 30px;
    position: relative;
    color: #fff;
    &:after {
      content: "";
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #fff;
      position: absolute;
      top: 29px;
      right: -12px;
    }
  }
  .msg-icon {
    display: flex;
    width: 22px;
    height: 22px;
    background: url("../assets/msg.png") no-repeat;
    background-size: 100%;
    position: relative;
    i {
      position: absolute;
      top: -4px;
      left: 20px;
      padding: 2px;
      display: block;
      font-size: 12px;
      line-height: 14px;
      color: #fff;
      background-color: #fd9828;
      border-radius: 2px;
    }
  }
}
</style>