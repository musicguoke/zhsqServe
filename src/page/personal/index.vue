<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>个人中心</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        个人信息
      </p>
      <div>
        <Form 
          ref="userForm" 
          :model="userForm" 
          :label-width="100" 
          label-position="right" 
          :rules="inforValidate"
        >
          <FormItem label="用户姓名：" prop="realName">
            <div style="display:inline-block;width:300px;">
              <Input v-model="userForm.realName"></Input>
            </div>
          </FormItem>
          <FormItem label="登录名：">
            <div style="display:inline-block;width:300px;">
              <Input v-model="userForm.userName" readonly></Input>
            </div>
          </FormItem>
          <FormItem label="用户手机：" prop="tel">
            <div style="display:inline-block;width:300px;">
              <Input v-model="userForm.tel" @on-keydown="hasChangePhone"></Input>
            </div>
          </FormItem>
          <FormItem label="email：">
            <div style="display:inline-block;width:300px;">
              <Input v-model="userForm.email" @on-keydown="hasChangeEmail"></Input>
            </div>
          </FormItem>
          <FormItem label="新密码" prop="password">
            <div style="display:inline-block;width:300px;">
              <Input type="password" v-model="userForm.password" placeholder="请输入新密码，至少6位字符"></Input>
            </div>
          </FormItem>
          <div>
            <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
            <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
          </div>
        </Form>
      </div>
    </Card>
  </Content>
</template>

<script>
import { updateManager, getManagerById } from '@/api/manager-service'
import MD5 from 'crypto-js/md5'

export default {
  name: 'ownspace_index',
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/
      if (!re.test(value)) {
        callback(new Error('请输入正确格式的手机号'))
      } else {
        callback()
      }
    }
    const valideEmail = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/
      if (!re.test(value)) {
        callback(new Error('请输入正确格式的email'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        id: 1,
        name: '',
        password: '',
        realName: '',
        tel: '',
        userName: '',
        email: '',
        role: '',
        sysIdStr: []
      },
      password: '',
      userInfo: '',
      save_loading: false,
      inforValidate: {
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入手机号码' },
          { validator: validePhone }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ]
      },
      initPhone: ''
    }
  },
  methods: {
    _updateManager(data) {
      updateManager(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`保存${res.message}`)
        } else {
          this.$Message.error(`保存${res.message}`)
        }
      })
    },
    _getManagerById(id) {
      getManagerById(id).then(res => {
        if (res.code === 20000) {
          this.sysIdStr = []
          res.data.list.map(v => this.sysIdStr.push(v.sysId))
          this.userForm = res.data
          this.password = res.data.password
        } else {
          this.$Message.error(`${res.message}`)
        }
      })
    },
    cancelEditUserInfor() {
      this.$router.go(-1)
    },
    saveEdit() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          let data = {
            id: this.userForm.id,
            password: this.password,
            realName: this.userForm.realName,
            tel: this.userForm.tel,
            userName: this.userForm.userName,
            email: this.userForm.email,
            role: this.userForm.role,
          }
          data.sysIdStr = this.userForm.sysIdStr ? this.userForm.sysIdStr.toString() : ''
          if(this.password !== this.userForm.password) {
            data.password = MD5(this.userForm.password).toString()
          }
          this._updateManager(data)
        }
      })
    },
    cancelInputCodeBox() {
      this.inputCodeVisible = false
      this.userForm.cellphone = this.initPhone
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
    this._getManagerById(this.userInfo.id)
  }
}
</script>