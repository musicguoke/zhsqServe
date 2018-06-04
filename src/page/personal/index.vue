<template>
  <div style="margin-top: 17px">
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        个人信息
      </p>
      <div>
        <Form ref="userForm" :model="userForm" :label-width="100" label-position="right" :rules="inforValidate">
          <FormItem label="用户姓名：" prop="name">
            <div style="display:inline-block;width:300px;">
              <Input v-model="userForm.name"></Input>
            </div>
          </FormItem>
          <FormItem label="登录名：">
            <span>{{userForm.username}}</span>
          </FormItem>
          <FormItem label="用户手机：" prop="cellphone">
            <div style="display:inline-block;width:204px;">
              <Input v-model="userForm.cellphone" @on-keydown="hasChangePhone"></Input>
            </div>
          </FormItem>
          <FormItem label="email：">
            <span>{{ userForm.email?userForm.email:'暂无'}}</span>
          </FormItem>
          <FormItem label="登录密码：">
            <Button type="primary" size="small" @click="showEditPassword">修改密码</Button>
          </FormItem>
          <div>
            <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
            <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
          </div>
        </Form>
      </div>
    </Card>
    <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <FormItem label="原密码" prop="oldPass" :error="oldPassError">
          <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPass">
          <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符"></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="rePass">
          <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'ownspace_index',
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/;
      if (!re.test(value)) {
        callback(new Error('请输入正确格式的手机号'));
      } else {
        callback();
      }
    };
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        name: '',
        cellphone: '',
        username: '',
        email: ''
      },
      phoneHasChanged: false, // 是否编辑了手机
      save_loading: false,
      editPasswordModal: false, // 修改密码模态框显示
      savePassLoading: false,
      oldPassError: '',
      inforValidate: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        cellphone: [
          { required: true, message: '请输入手机号码' },
          { validator: validePhone }
        ]
      },
      editPasswordForm: {
        oldPass: '',
        newPass: '',
        rePass: ''
      },
      passwordValidate: {
        oldPass: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
          { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        rePass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: valideRePassword, trigger: 'blur' }
        ]
      },
      initPhone: ''
    }
  },
  methods: {
    showEditPassword() {
      this.editPasswordModal = true;
    },
    cancelEditUserInfor() {
      this.$router.go(-1)
    },
    saveEdit() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.saveInfoAjax()
        }
      });
    },
    cancelEditPass() {
      this.editPasswordModal = false;
    },
    saveEditPass() {
      this.$refs['editPasswordForm'].validate((valid) => {
        if (valid) {
          this.savePassLoading = true;
          // you can write ajax request here
        }
      });
    },
    init() {
      let userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
      this.userForm.name = userInfo.realName;
      this.userForm.username = userInfo.userName;
      this.userForm.cellphone = userInfo.tel;
      this.initPhone = userInfo.tel;
      this.userForm.email = userInfo.email;
    },
    cancelInputCodeBox() {
      this.inputCodeVisible = false;
      this.userForm.cellphone = this.initPhone;
    },
    hasChangePhone() {
      this.phoneHasChanged = true;
      this.hasGetIdentifyCode = false;
      this.identifyCodeRight = false;
    },
    saveInfoAjax() {
      this.save_loading = true;
      setTimeout(() => {
        this.$Message.success('保存成功');
        this.save_loading = false;
      }, 1000);
    }
  },
  mounted() {
    this.init()
  }
};
</script>