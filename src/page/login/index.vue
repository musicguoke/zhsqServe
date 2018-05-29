<template>
  <div class="container">
    <header>
      <div class="wrap">
        <img src="static/images/3.png">
        <h2>重庆市综合市情系统</h2>
      </div>
    </header>
    <div class="login">
      <img class="login-bg" src="static/images/leftImg.png">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <h1 class="title">
          <span class="triangle"></span>
          账户登录
        </h1>
        <div class="input">
          <FormItem prop="user">
            <Input type="text" v-model="formInline.username" placeholder="请输入用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="请输入密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </div>
        <FormItem>
          <Button type="primary" long @click="_login()">登录</Button>
        </FormItem>
      </Form>
    </div>
    <footer>
      <div class="companyName">
        <span>建设单位:重庆市地理信息中心</span>
        <span class="footer_line">|</span>
        <span> 技术支持:重庆知行宏图科技有限公司</span>
      </div>
      <div class="baseInfo">
        <span>邮箱：cqzhsq@qq.com </span>
        <span class="footer_line">|</span>
        <span>联系电话：023-67033881</span>
        <span class="footer_line">|</span>
        <span> 地址：重庆市渝北区冉家坝规划测绘创新基地1001室</span>
      </div>
    </footer>
  </div>
</template>
<script>
import { login } from '@/api/service'

export default {
  data() {
    return {
      formInline: {
        username: '',
        password: ''
      },
      ruleInline: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能低于6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    document.title = '系统登录'
  },
  methods: {
    _login() {
      login(this.formInline).then(res => {
        if(res.code) {
          if(res.data.userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
          }
          if(res.data.sysUserChildList.length > 0) {
            localStorage.setItem('sysUserList', JSON.stringify(res.data.sysUserChildList))
            this.$router.replace('/system-list')
          } else {
            // 单个系统自动选择
            this.$router.replace('/zhsq_admin')
          }
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>
header {
  width: 100%;
  height: 74px;
  background-color: #3a4255;
}

.wrap {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.logo {
  height: 100%;
  color: #fff;
  margin-left: 160px;
  font-size: 22px;
  letter-spacing: 1px;
  font-weight: bold;
}

.logo p {
  height: 100%;
  line-height: 74px;
}

.logo p img {
  display: inline-block;
  margin-right: 14px;
  padding-bottom: 6px;
  vertical-align: middle;
}

.navbar {
  height: 100%;
}

.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.tab_item {
  position: relative;
  height: 100%;
  line-height: 74px;
  color: #fff;
}

.tab_item a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
}

.tab_item .tab_item_link {
  padding: 6px 23px;
}

.tab_item span {
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.tab_item img {
  padding-right: 6px;
  padding-left: 23px;
  vertical-align: middle;
}

.tab_item .tab_item_login {
  display: inline-block;
  line-height: 74px;
  height: 100%;
}

.system_link_list {
  width: 410px;
  /* height: 300px; */
  background-color: #3a4255;
  position: absolute;
  top: 76px;
  left: 15px;
  padding: 10px 4px 20px 4px;
  display: none;
}

.system_link {
  width: 100%;
  height: 40px;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.system_link span {
  font-size: 14px;
  margin-left: 5px;
}

.system_link_active {
  background-color: #283142;
}

.active {
  background-color: #283142;
  background-size: inherit;
  border: 1px solid #6b7485;
}

.main {
  width: 100%;
}

.jumbotron {
  width: 100%;
  background-color: #056cb7;
}

.jumbotron_box {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.description {
  color: #fff;
  width: 420px;
  margin-right: 50px;
}

.description span {
  font-size: 26px;
}

.description p {
  margin-top: 20px;
  line-height: 30px;
}

.companyName,
.baseInfo {
  width: 100%;
  display: flex;
  line-height: 36px;
  justify-content: center;
}

.footer_line {
  margin: 0 10px;
  color: #b7bac1;
}
.container {
  width: 100%;
  height: 100%;
  background: url(../../assets/bg.png) no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container header {
  background-color: #f8fbfc;
  height: 100px;
}

.wrap {
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
}

.wrap h2 {
  margin-left: 30px;
  font-size: 40px;
  text-align: center;
  color: #036eb7;
}

.login {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

form {
  width: 300px;
  height: 300px;
  border-radius: 4px;
  background-color: #fff;
}

form .input {
  margin-top: 50px;
}

.ivu-form-item {
  padding: 0 20px;
}

.title {
  height: 50px;
  background-color: #2399ea;
  text-align: center;
  font-size: 24px;
  line-height: 50px;
  color: #fff;
  font-weight: inherit;
  position: relative;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.triangle {
  position: absolute;
  bottom: -10px;
  left: 142px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 10px solid #2399ea;
}

.loginBtn {
  padding: 0 50px;
  margin-top: 30px;
}

.login-container footer {
  background-color: rgba(0, 0, 0, 0);
  color: #4c5260;
}
</style>
