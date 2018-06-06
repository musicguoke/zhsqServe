<template>
  <Header>
    <div class="container">
      <div class="navbar-logo">
        <div class="layout-logo"></div>
        <span class="navbar-title">
          {{title}} —
          <small>管理平台</small>
        </span>
      </div>
      <div class="layout-nav">
        <div class="user-info">
          <span class="user-img"></span>
          <Dropdown trigger="hover" @on-click="userClick" style="margin: 0 10px">
            <a href="javascript:void(0)" style="color: #fff;">
              {{userInfo.realName}}
              <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="personal-center">个人中心</DropdownItem>
              <DropdownItem name="logout">安全退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Badge dot>
            <Icon type="ios-bell-outline" size="26"></Icon>
          </Badge>
        </div>
      </div>
    </div>
  </Header>
</template>

<script>
import { logout } from '@/api/service'

export default {
  data() {
    return {
      userInfo: ''
    }
  },
  props: {
    title: {
      type: String,
      default: '重庆市综合市情管理系统'
    }
  },
  created() {
    // 用户权限信息
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
  },
  methods: {
    userClick(name) {
      if (name === 'logout') {
        this.$Modal.confirm({
          title: '提示',
          content: '确实退出吗？',
          onOk: () => {
            this._logout()
          }
        })
      }
      if(name === 'personal-center') {
        this.$router.push(`/zhsq_admin/${name}`)
      }
    },
    _logout() {
      logout(this.formInline).then(res => {
        if(res.code === 20000) {
          this.$router.replace('/')
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-menu {
  z-index: 901;
}
.container {
  display: flex;
  justify-content: space-between;
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #fff;
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
    background: url("../../assets/msg.png") no-repeat;
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
