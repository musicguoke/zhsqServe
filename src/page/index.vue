<template>
  <div class="layout">
    <Layout>
      <Header>
        <div class="navbar-logo">
          <div class="layout-logo"></div>
          <span class="navbar-title">重庆市综合市情管理系统—
            <small>管理平台</small>
          </span>
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
      <div class="content">
        <div class="navbar">
          <div class="container">
            <v-menu/>
          </div>
        </div>
        <div class="container">
          <router-view/>
        </div>
      </div>
      <Footer class="layout-footer-center">
        <p>建设单位：重庆市地理信息中心 | 技术支持：重庆知行宏图科技有限公司</p>
        <p>邮箱：cqzhsq@qq.com | 联系电话：023-67033881 | 地址：重庆市渝北区冉家坝规划测绘创新基地1001室</p>
      </Footer>
    </Layout>
  </div>
</template>
<script>
import vMenu from '@/components/menu/index'

export default {
  components: {
    vMenu
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
.ivu-layout-header {
  display: flex;
}
.ivu-menu {
  z-index: 899;
}
.layout {
  width: 100%;
  height: 100%;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.content {
  width: 100%;
  height: 100%;
}
.ivu-layout {
  width: 100%;
  height: 100%;
  justify-content: space-between;
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
    color: #fff;
  }
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
  background-color: #4c5260;
  color: #fff;
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
.navbar {
  width: 100%;
  margin: 17px 0;
  border-top: 1px solid #d8dcdf;
  border-bottom: 1px solid #d8dcdf;
  background: #fff;
}
</style>