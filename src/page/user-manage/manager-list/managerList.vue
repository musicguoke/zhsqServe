<template>
<Content :style="{maxHeight:managerHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>管理员列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <v-search :searchShow="false" :deleteShow="false" :importShow="false" @on-build="managerAddOpen" />
      <div class="tableSize">
        <el-table :data="userData" border style="width: 100%"  @filter-change="filterChange">
            <!-- <el-table-column prop="id" label="Id" width="60" sortable>
            </el-table-column> -->
            <el-table-column prop="userName" label="用户名">
            </el-table-column>
            <el-table-column prop="realName" label="姓名">
            </el-table-column>
            <el-table-column prop="tel" label="电话">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="roleName" label="角色" :filters="managerTypeFilterList" column-key="roleName">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="primary" @click="managerEditOpen(scope)" size="small" class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope)" size="small" >删除</Button>
                </template>
            </el-table-column>
        </el-table>   
      </div>
      <div class="tablePage">
        <Page :total="pageLength" v-show="pageLength>10" @on-change="pageChange" show-total show-elevator ref="managerPage"></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="managerModal" :title=modalTitle @on-ok="addOrUpdate" ref="managerModal" width="540">
      <Tabs ref="managerTab">
        <Tab-pane label="基本信息" name="baseInfo">
            <Form :model="managerForm" :label-width="100"  :rules="manageRule" ref="manageRule">
                <FormItem label="用户名" prop="userName">
                    <Input v-model="managerForm.userName" placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="真实姓名" prop="realName">
                    <Input v-model="managerForm.realName" placeholder="请输入真实姓名"></Input>
                </FormItem>
                <FormItem label="密码" prop="password" v-show="isAdd">
                    <Input v-model="managerForm.password" placeholder="请输入密码" type="password"></Input>
                </FormItem>
                <FormItem label="密码" v-show="!isAdd">
                    <Input v-model="managerForm.editPassword" placeholder="无新密码输入则保持原密码不变" type="password"></Input>
                </FormItem>
                <FormItem label="管理员类型" prop="role">
                    <Select v-model="managerForm.role" @on-change="managerChange">
                        <Option v-for="item in managerTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="手机号" prop="tel">
                    <Input v-model="managerForm.tel" placeholder="请输入手机号"></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="managerForm.email" placeholder="请输入邮箱"></Input>
                </FormItem>
            </Form>
        </Tab-pane>
        <Tab-pane label="选择系统" name="systemChoose" :disabled="tabPaneDisable">
            <div class="chooseSystemTitle">
                <span class="chooseSystemSpan">系统选择&nbsp;&nbsp;
                    <small style="color:red">(注:同种类型下系统不能重复选择)</small>
                </span>
                <Button type="info" icon="plus" title="新增系统选择" class="chooseSystemAdd" @click="addChooseSystem">添加</Button>
            </div>
            <Form>
                <FormItem v-for="(item,$index) in sysTypeAndsysList" :key="$index" style="display:flex; justify-content: flex-start">
                     <Select v-model="item.sysType" @on-change="typeChange(item.sysType,$index)" style="width:220px" :ref="'sysType'+$index">
                        <Option v-for="item in systemTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="item.sysId" @on-change="sysIdSelect(item.sysId,$index)" style="width:220px;margin-left:5px;" :ref="'sysId'+$index">
                        <Option v-for="item in systemFilterList[$index]" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Button type="error" icon="close-round" title="移除" @click="removeChooseSystem($index)" style="padding:4px 10px;margin-left:5px;" v-show="$index != 0"></Button>
                </FormItem>
            </Form>
        </Tab-pane>
      </Tabs>
  </Modal>
  </Content>
</template>

<script>
import {
  getManagerList,
  addManager,
  updateManager,
  deleteManager
} from "@/api/manager-service.js";
import { getSystemList } from "@/api/system.js";
import MD5 from "crypto-js/md5";
import vSearch from "@/components/search/index";
export default {
  components: {
    vSearch
  },
  data() {
    return {
      managerHeight: window.innerHeight - 174 + "px",
      searchName: "",
      searchManagerType: "",
      managerModal: false,
      modalTitle: "",
      pageLength: 0,
      nowPage: 1,
      forEachNum: 0,
      managerNowType:0,
      tabPaneDisable:true,
      managerForm: {
        userName: "",
        realName: "",
        password: "",
        editPassword: "",
        tel: "",
        email: "",
        role: "",
        id: ""
      },
      sysId: [],
      sysType: [],
      userData: [],
      systemList: [],
      systemFilterList: [],
      sysTypeAndsysList: [{ sysType: "", sysId: "" }],
      roleList: [],
      systemTypeList: [
        {
          value: 1,
          label: "综合市情"
        },
        {
          value: 2,
          label: "规划定位"
        },
        {
          value: 3,
          label: "综合区情"
        }
      ],
      isAdd: true,
      managerTypeList:[],
      managerTypeFilterList: [
        {
          value: 1,
          label: "超级管理员",
          text: "超级管理员"
        },
        {
          value: 2,
          label: "市级管理员",
          text: "市级管理员"
        },
        {
          value: 3,
          label: "普通管理员",
          text: "普通管理员"
        }
      ],
      manageRule: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ],
        tel: [{ required: true, message: "用户手机不能为空", trigger: "blur" }],
        email: [
          { required: true, message: "用户邮箱不能为空", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        role: [
          {
            required: true,
            message: "请选择用户类型",
            trigger: "change",
            type: "number"
          }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码不能少于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this._getManagerList(1);
    this.managerNowType = JSON.parse(localStorage.userInfo).role
    if(this.managerNowType == 1){
        this.managerTypeList = this.managerTypeFilterList
      }else if(this.managerNowType ==2){
        this.managerTypeList = [{
            value: 3,
            label: "普通管理员",
            text: "普通管理员"
        }]
    }
    getSystemList(1).then(res => {
      let data = res.data.list;
      for (let i in data) {
        this.systemList.push({
          value: data[i].id,
          label: data[i].sysName,
          type: data[i].type
        });
      }
    });
  },
  methods: {
    _getManagerList(page) {
      let data = {
        pageNo: page,
        pageSize: 10,
        roleList: this.roleList.join(',')
      };
      getManagerList(data).then(res => {
        this.userData = res.data.list;
        this.userData.map(v => {
          if (v.role == 1) {
            v.roleName = "超级管理员";
          } else if (v.role == 2) {
            v.roleName = "市级管理员";
          } else if (v.role == 3) {
            v.roleName = "普通管理员";
          }
        });
        this.pageLength = res.data.total;
      });
    },
    managerAddOpen() {
      this.sysTypeAndsysList = [{ sysType: "", sysId: "" }]
      this.systemFilterList = []
      this.$refs.manageRule.resetFields();
      this.$refs.managerTab.activeKey = 'baseInfo'
      this.isAdd = true;
      this.managerModal = true;
      this.tabPaneDisable = true;
      this.modalTitle = "新增管理员";
      this.sysId = [];
      for (var i in this.managerForm) {
        this.managerForm[i] = "";
      }
    },
    managerEditOpen(params) {
      this.sysTypeAndsysList = []
      this.systemFilterList = []
      this.$refs.manageRule.resetFields();
      this.$refs.managerTab.activeKey = 'baseInfo'
      this.isAdd = false;
      this.managerModal = true;
      this.modalTitle = "修改管理员";
      this.sysId = [];
      for (var i in this.managerForm) {
        if (params.row[i]) {
          this.managerForm[i] = params.row[i];
        }
      }
      if(this.managerForm.role == 3){
          this.tabPaneDisable = false
      }
      this.managerForm.editPassword = "";
      if (params.row.list.length > 0) {
          for(let i=0;i<params.row.list.length;i++ ){
              this.sysTypeAndsysList.push({ sysType: params.row.list[i].type, sysId: params.row.list[i].id })
              this.typeChange(params.row.list[i].type,i)
          }
      }
    },
    managerChange() {
      this.sysId = [];
      if(this.managerForm.role == 3){
          this.tabPaneDisable = false
      }else{
          this.tabPaneDisable = true
          this.sysTypeAndsysList = [{ sysType: "", sysId: "" }]
      }
    },
    typeChange(type,index) {
        let array = [];
        this.systemList.map(v => {
            if (v.type == type) {
              array.push(v);
            }
        });
        this.systemFilterList[index] = array;
    },
    addOrUpdate() {
      let sysIdStr = []
      this.sysTypeAndsysList.map(v=>{
          sysIdStr.push(v.sysId)
      })
      let data = {
        userName: this.managerForm.userName,
        realName: this.managerForm.realName,
        password: "",
        tel: this.managerForm.tel,
        email: this.managerForm.email,
        role: this.managerForm.role,
        sysIdStr: sysIdStr.join(",")
      };
      this.$refs.manageRule.validate(valid => {
        if (!valid) {
          this.$refs.managerModal.visible = true;
          this.managerModal = true;
          this.$refs.managerTab.activeKey = 'baseInfo'
        } else {
          if (this.managerForm.role == 3 && sysIdStr[0] == "") {
            this.$Message.error("请至少选择一个系统");
            this.$refs.managerModal.visible = true;
            this.managerModal = true;
            this.$refs.managerTab.activeKey = 'systemChoose'
          } else {
            if (this.isAdd) {
              data.password = MD5(this.managerForm.password).toString();
              addManager(data).then(res => {
                if (res.code == 20000) {
                  this.$Message.success("添加成功");
                  this._getManagerList(this.nowPage);
                } else {
                  this.$Message.error(res.message);
                }
              });
            } else {
              if (this.managerForm.editPassword) {
                data.password = MD5(this.managerForm.editPassword).toString();
              } else {
                data.password = this.managerForm.password;
              }
              data.id = this.managerForm.id;
              updateManager(data).then(res => {
                if (res.code == 20000) {
                  this.$Message.success("修改成功");
                  this._getManagerList(this.nowPage);
                } else {
                  this.$Message.error(res.message);
                }
              });
            }
          }
        }
      });
    },
    pageChange(page) {
      this.nowPage = page;
      this._getManagerList(page);
    },
    remove(params) {
      this.$Modal.confirm({
        content: "删除后数据无法恢复，是否继续？",
        onOk: () => {
          let data = {
            id: params.row.id
          };
          deleteManager(data).then(res => {
            if (res.code == 20000) {
              this.userData.splice(params.$index, 1);
              this.$Message.success("删除成功");
              this._getManagerList(1);
              this.$refs.managerPage.currentPage = 1;
            } else {
              this.$Message.error(res.message);
            }
          });
        },
        onCancel: () => {}
      });
    },
    filterByRole(value, row, column) {
      this.roleList.push(value);
      this.roleList = Array.from(new Set(this.roleList));
      return row.role == value;
    },
    filterChange(params) {
      this.roleList = params.roleName;
      this._getManagerList(1);
      this.$refs.managerPage.currentPage = 1;
    },
    //点击添加，新增一行系统角色选择
    addChooseSystem() {
        this.sysTypeAndsysList.push({ sysType: "", sysId: "" })
    },
    //移除当前行的选择框
    removeChooseSystem(index) {
      this.sysTypeAndsysList.splice(index, 1);
      this.systemFilterList.splice(index, 1);
    },
    //验证当前是否重复选择系统
    sysIdSelect(id,index){
      let list = [];
      this.sysTypeAndsysList.map(v => {
        list.push(v.sysId);
      });
      let setList = Array.from(new Set(list));
      if (list.length > setList.length) {
            this.$Message.warning("相同系统请勿重复选择");
            this.$refs["sysType" + index][0].values = [];
            this.$refs["sysId" + index][0].values = [];
            this.sysTypeAndsysList[index] = { sysType: "", sysId: "" }   
        }
    }
  }
};
</script>

<style>
</style>
