<template>
  <div class="container">
    <img class="bg" src="static/images/bg.png" alt="">
    <header>
      <img src="../../assets/logo.png">
      <h2>重庆市综合市情系统</h2>
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
            <Input type="text" v-model="formInline.username" @on-enter="_login('formInline')" placeholder="请输入用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" @on-enter="_login('formInline')" placeholder="请输入密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
        </div>
        <FormItem>
          <Button type="primary" long @click="_login('formInline')">登录</Button>
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
        username: [
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
    _login(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          login(this.formInline).then(res => {
            if (res.code) {
              if (res.data && res.data.userInfo) {
                localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
              }
              if (res.data && res.data.sysUserChildList.length > 0 && res.data.role == 3) {
                localStorage.setItem('sysUserList', JSON.stringify(res.data.sysUserChildList))
                this.$router.replace('/system-list')
              } else {
                // 单个系统自动选择
                this.$router.replace('/zhsq_admin')
              }
            }
          })
        } else {
          this.$Message.error('用户名和密码不能为空！')
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.companyName,
.baseInfo {
  width: 100%;
  display: flex;
  line-height: 36px;
  justify-content: center;
}

.footer_line {
  margin: 0 5px;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container .bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.container header {
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
}
header h2 {
  margin-left: 30px;
  font-size: 32px;
  color: #fff;
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
</style>
