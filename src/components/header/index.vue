<template>
  <Header>
    <div class="container">
      <div class="navbar-logo">
        <span v-if="query.type==2" class="layout-logo ghdw" @click="linkTo"></span>
        <span v-else-if="query.type==3" class="layout-logo zhqq" @click="linkTo"></span>
        <span v-else class="layout-logo" @click="linkTo"></span>
        <span class="navbar-title">
          {{title}}管理平台
        </span>
      </div>
      <div class="layout-nav">
        <div class="user-info">
          <Avatar style="background-color: #87d068;margin-top:15px;" icon="person" />
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
          <div @click="showMessage" class="message-con">
            <Badge :count="unread">
              <Icon type="ios-bell-outline" size="26"></Icon>
            </Badge>
          </div>
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
      userInfo: '',
      count: 0
    }
  },
  props: {
    title: {
      type: String,
      default: '重庆市综合市情'
    }
  },
  computed: {
    query() {
      return this.$store.state.params
    },
    unread() {
      return this.$store.state.unread
    }
  },
  created() {
    // 用户权限信息
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
  },
  methods: {
    linkTo() {
      if (this.userInfo.role !== 3) {
        this.$store.commit('setParams', {})
        this.$router.push('/zhsq_admin/system-manage')
      }
    },
    showMessage() {
      if (this.$route.params.id) {
        this.$router.push({path: `/system/${this.$route.params.id}/message`})
      } else {
        this.$router.push({ name: 'Message' })
      }
    },
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
      if (name === 'personal-center') {
        if (this.query.id) {
          this.$router.push({path: `/system/${this.query.id}/${name}`})
        } else {
          this.$store.commit('setParams', {})
          this.$router.push(`/zhsq_admin/${name}`)
        }
      }
    },
    _logout() {
      logout(this.formInline).then(res => {
        if (res.code === 20000) {
          this.$store.commit('setParams', {})
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
.navbar-logo span {
  display: inline-block;
}
.message-con {
  cursor: pointer;
}
.user-info {
  display: flex;
  justify-content: flex-end;
  color: #fff;
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
