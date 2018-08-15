<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>部门列表</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: departmentListHeight}">
      <div>
        <v-search :selectShow="true" :deleteShow="false" :searchBoxShow="false" :selectList="countyList" :buildShow="false" @on-search="search" @on-reset="reset" @on-import="openImportModal" />
        <div class="tableSize">
          <Row>
            <Col span="9" class="departmentTree" :style="{overflow:'auto',height:departmentTreeHeight}">
            <el-tree :data="departmentData" :default-expanded-keys="[-1]" :props="defaultProps" node-key="id" :render-content="renderContent" @node-click="handleNodeClick" :highlight-current="highlightcurrent" :expand-on-click-node="expandonclicknode"></el-tree>
            </Col>
            <Col span="14" class="departmentInfo" :style="{height:departmentTreeHeight}">
            <div class="fontSize">{{operationType}}</div>
            <Form :model="departmentInfoForm" label-position="left">
              <FormItem label="部门名" :label-width="100">
                <Input v-model="departmentInfoForm.name"></Input>
              </FormItem>
              <FormItem label="部门简称" :label-width="100">
                <Input v-model="departmentInfoForm.nameA"></Input>
              </FormItem>
              <FormItem label="部门编码" :label-width="100">
                <Input v-model="departmentInfoForm.id"></Input>
              </FormItem>
              <FormItem label="父级编码" :label-width="100">
                <Input v-model="departmentInfoForm.parentid"></Input>
              </FormItem>
              <FormItem label="序号" :label-width="100">
                <Input v-model="departmentInfoForm.listorder"></Input>
              </FormItem>
              <FormItem>
                <div style="text-align:center;width:100%">
                  <Button type="primary" icon="document" @click="saveDepartment">保存</Button>
                </div>
              </FormItem>
            </Form>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
    <Modal v-model="importModal" title='导入部门' @on-ok="saveImport">
      <Form :model="importForm" label-position="left" :label-width="100" ref="file_form">
        <FormItem label="导入类型">
          <Select v-model="importForm.type">
            <Option value="1">增量导入</Option>
            <Option value="2">全量导入</Option>
          </Select>
        </FormItem>
        <FormItem label="选择文件">
          <div>
            <Upload :action="`${uploadUrl}/sys/msBranchStruct/importFile.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="departmentUpload">
              <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
            </Upload>
          </div>
        </FormItem>
        <div class="importSlot">
          <div class="importSlotTitle">导入须知</div>
          <p>1、导入文件大小不超过2MB.</p>
          <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板
            <a :href="`${uploadUrl}/sys/msBranchStruct/downloadImportedFile.do`">点此下载.</a>
          </p>
        </div>
      </Form>
    </Modal>
    <!-- <span style="float:right;padding-right:5px;display:block">
            <i
              on-click={() => this.append(data)}
              class="el-icon-circle-plus"
              style="color:#20a0ff"
            />
            &nbsp;
            <i
              on-click={() => this.remove(node, data)}
              class="el-icon-circle-close"
              style="color:#ff3800"
            />
      </span> -->
  </Content>
</template>

<script>
import {getDepartmentList, addAndUpdateDepartment, importDepartment } from "@/api/department-service";
import {getAreaCode} from '@/api/user-service'
import vSearch from '@/components/search/index'
import { url } from '@/api/config.js'
export default {
  components: {
    vSearch
  },
  data() {
    return {
      searchName: "",
      areacode:500000,
      departmentListHeight: window.innerHeight - 174 + "px",
      departmentTreeHeight: window.innerHeight - 260 + "px",
      departmentData: [],
      countyList:[],
      uploadUrl: url,
      defaultProps: {
        label: "name",
        children: "list"
      },
      highlightcurrent: true,
      expandonclicknode: true,
      importModal: false,
      importForm: {
        type: '',
        file: ''
      },
      departmentInfoForm: {
        name: "",
        id: "",
        parentid: "",
        nameA: "",
        listorder: ""
      },
      operationType: "部门详情"
    };
  },
  created() {
    this._getDepartmentList();
    this._getAreacode();
  },
  methods: {
    //向树上绑定按钮
    renderContent(h, { node, data, store }) {
      return (
        <span style="font-size: 14px;width:100%;">
          <span style="float:left">
            <span title={node.label}>{node.label}</span>
          </span>
        </span>
      );
    },
    //获取树形数据
    _getDepartmentList() {
      getDepartmentList(this.areacode).then(res => {
        let data = res.data;
        this.departmentData = [
          {
            id: -1,
            list: [],
            name: "部门列表",
            nameA: "部门列表",
            parentid: ""
          }
        ];
        for (let i in data) {
          this.departmentData[0].list.push(data[i]);
        }
      });
    },
    //树节点点击
    handleNodeClick(data) {
      for (let i in data) {
        this.operationType = "部门详情" + "--" + data.name;
        this.departmentInfoForm[i] = data[i];
      }
    },
    //当前节点下创建节点
    append(data) {
      event.cancelBubble = true;
      this.operationType = "部门添加";
      for (let i in data) {
        this.departmentInfoForm[i] = "";
      }
      this.departmentInfoForm.parentid = data.id;
    },
    //删除节点
    remove(node, data) {
      event.cancelBubble = true;
      this.$Modal.confirm({
        content: "删除时该节点下的所有子节点也将删除，是否继续？",
        onOk: () => { },
        onCancel: () => { }
      });
    },
    //点击保存
    saveDepartment() {
      let data = {
        name: this.departmentInfoForm.name,
        id: this.departmentInfoForm.id,
        parentid: this.departmentInfoForm.parentid,
        nameA: this.departmentInfoForm.nameA,
        listorder: this.departmentInfoForm.listorder
      };
      addAndUpdateDepartment(data).then(res => {
        if ((res.code = 20000)) {
          this.$Message.success("保存成功");
          this._getDepartmentList();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //打开导入文件模态框
    openImportModal() {
      this.importModal = true
      for (let i in this.importForm) {
        this.importForm[i] = ""
      }
      if (this.$refs.departmentUpload._data.fileList) {
        this.$refs.departmentUpload._data.fileList = []
      }
    },
    boforeUpload(file) {
      this.importForm.file = file
    },
    //导入文件保存
    saveImport() {
      if (this.importForm.type === '') {
        this.$Message.error('请选择导入类型')
      } else if (this.importForm.file === '') {
        this.$Message.error('请选择上传文件')
      } else {
        let formData = new FormData(this.$refs.file_form)
        formData.append('type', this.importForm.type)
        formData.append('file', this.importForm.file)
        this._importDepartment(formData)
      }
    },
    //导入文件
    _importDepartment(data) {
      importDepartment(data).then(res => {
        if (res.code == 20000) {
          this.$Message.success("添加成功")
          this._getDepartmentList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _getAreacode() {
       getAreaCode().then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            this.countyList.push({
              value: v.areacode,
              label: v.areaname
            })
          })
        }
      })
    },
    //查询
    search(searchName, areacode) {
      this.searchName = searchName
      this.areacode = areacode
      this._getDepartmentList()
    },
    //重置
    reset(){
      this.areacode = 500000
      this._getDepartmentList()
    }
  }
};
</script>

<style>
.departmentTree {
  padding: 10px;
  border: 1px solid #ccc;
}
.departmentInfo {
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  margin-left: 20px;
}
.ivu-form-item-label {
  font-size: 14px;
}
.fontSize {
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
