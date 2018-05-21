<template>
  <div class="login-container">
    <header>
      <div class="wrap">
        <!-- <img src="./images/login/3.png"> -->
        <h2>重庆市综合市情系统</h2>
      </div>
    </header>
    <div id="login">
      <!-- <img class="login-bg" src="./images/login/leftImg.png"> -->
      <form action="" class="clearfix">
        <h1 class="title">
          <span class="triangle"></span>账户登录</h1>
        <div class="form-group username">
          <input type="text" v-model="loginInfo.username" id="name" placeholder="用户名" />
        </div>
        <div class="form-group password">
          <input type="password" v-model="loginInfo.password" id="password" placeholder="密码" />
        </div>
        <div class="form-group">
          <span id="tip"></span>
        </div>
        <div class="form-group loginBtn">
          <button type="button" class="btn" @click="login()">登录</button>
        </div>
      </form>
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
import axios from '@/util/http'
import qs from 'qs'

export default {
  data() {
    return {
      loginInfo: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      axios.post('http://192.168.21.37:8080/zhsq_business/sys/sysUser/login.do', qs.stringify(this.loginInfo), {withCredentials: true}).then(res => {
        console.log(res)
      })
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
