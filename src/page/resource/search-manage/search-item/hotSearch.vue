<template>
    <div>
        <v-search :delete-show="false" @on-search="search" @on-reset="reset"  @on-build="openAddModal" @on-import="openImportModal"/>
        <el-table :data="hotSearchData" border style="width: 100%">
            <el-table-column prop="dataCode" label="数据编码" sortable>
            </el-table-column>
            <el-table-column prop="dataname" label="热搜内容">
            </el-table-column>
            <el-table-column prop="parentsCode" label="父级编码">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small" class="marginRight" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" show-total show-elevator ref="searchPage"></Page>
        </div>
        <Modal v-model="hotSearchModal" :title=modalTitle @on-ok="addOrUpdate" ref="hotSearchModal">
            <Form :model="hotSearchForm" :label-width="80" :rules="hotSearchRule" ref="hotSearchRule">
                <FormItem label="热搜名" prop="dataname">
                    <Input v-model="hotSearchForm.dataname" placeholder="请输入热搜名..." maxlength="10"></Input>
                </FormItem>
                <FormItem label="父级编码" prop="parentsCode">
                    <Input v-model="hotSearchForm.parentsCode" placeholder="请输入父级编码..." maxlength="20"></Input>
                </FormItem>
                <FormItem label="数据编码" prop="dataCode">
                    <Input v-model="hotSearchForm.dataCode" placeholder="请输入数据编码..."  maxlength="20"></Input>
                </FormItem>
                <FormItem label="序号" prop="listorder">
                    <Input v-model="hotSearchForm.listorder" placeholder="请输入序号..." maxlength="5"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入热搜' @on-ok="saveImport">
          <Form :model="importForm" label-position="left" :label-width="100" ref="file_form">
              <FormItem label="导入类型">
                  <Select v-model="importForm.type">
                      <Option value="1">增量导入</Option>
                      <Option value="2">全量导入</Option>
                  </Select>
              </FormItem>
              <FormItem label="选择文件">
                    <Upload :action="`${uploadUrl}/sys/hotSearch/importFile.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="searchUpload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                    </Upload>
              </FormItem>
                  <div class="importSlot">
                  <div class="importSlotTitle">导入须知</div>
                  <p>1、导入文件大小不超过2MB.</p>
                  <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板<a :href="`${uploadUrl}/sys/hotSearch/downloadImportedFile.do`">点此下载.</a></p>
              </div>
          </Form>
        </Modal>
    </div>
</template>
<script>
import {
  getHotSearch,
  addHotSearch,
  updateHotSearch,
  deleteHotSearch,
  importHotSearch
} from "@/api/search-service";
import vSearch from "@/components/search/index";
import { url } from "@/api/config.js";
export default {
  components: {
    vSearch
  },
  data() {
    return {
      searchName: "",
      hotSearchData: [],
      pageLength: 0,
      hotSearchModal: false,
      importModal: false,
      isAdd: true,
      uploadUrl: url,
      modalTitle: "",
      nowPage: 1,
      hotSearchForm: {
        dataname: "",
        parentsCode: "",
        dataCode: "",
        listorder: "",
        id: ""
      },
      importForm: {
        type: "",
        file: ""
      },
      hotSearchRule: {
        dataname: [
          { required: true, message: "热搜名称不能为空", trigger: "blur" }
        ],
        parentsCode: [
          { required: true, message: "父级编码不能为空", trigger: "blur" }
        ],
        dataCode: [
          { required: true, message: "数据编码不能为空", trigger: "blur" }
        ],
        listorder: [
          { required: true, message: "序号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this._getHotSearch(1);
  },
  methods: {
    //获取热搜数据
    _getHotSearch(Page) {
      let data = {
        method: "list",
        pageNo: Page,
        pageSize: 10,
        dataname: this.searchName
      };
      getHotSearch(data).then(res => {
        this.hotSearchData = res.data.list;
        this.pageLength = res.data.total;
      });
    },
    //分页点击
    pageChange(Page) {
      this.nowPage = Page;
      this._getHotSearch(Page);
    },
    //打开新增模态框
    openAddModal() {
      this.isAdd = true;
      this.hotSearchModal = true;
      this.$refs.hotSearchRule.resetFields()
      for (let i in this.hotSearchForm) {
        this.hotSearchForm[i] = "";
      }
      this.modalTitle = "新增热搜";
    },
    //打开编辑模态框
    openEditModal(params) {
      this.isAdd = false;
      this.hotSearchModal = true;
      this.$refs.hotSearchRule.resetFields()
      for (let i in this.hotSearchForm) {
        this.hotSearchForm[i] = "";
        if (params.row[i]) {
          this.hotSearchForm[i] = params.row[i];
        }
      }
      this.modalTitle = "修改热搜";
    },
    //点击确定
    addOrUpdate() {
      this.$refs["hotSearchRule"].validate(valid => {
        if (valid) {
          let data = {
            dataname: this.hotSearchForm.dataname,
            parentsCode: this.hotSearchForm.parentsCode,
            dataCode: this.hotSearchForm.dataCode,
            listorder: this.hotSearchForm.listorder
          };
          if (this.isAdd) {
            addHotSearch(data).then(res => {
              if (res.code == 20000) {
                this.$Message.success("添加成功");
                this._getHotSearch(this.nowPage);
              } else {
                this.$Message.error(res.message);
              }
            });
          } else {
            data.id = this.hotSearchForm.id;
            updateHotSearch(data).then(res => {
              if (res.code == 20000) {
                this.$Message.success("修改成功");
                this._getHotSearch(this.nowPage);
              } else {
                this.$Message.error(res.message);
              }
            });
          }
        } else {
            this.$refs.hotSearchModal.visible = true
            this.hotSearchModal = true 
        }
      });
    },
    search(searchName) {
      this.searchName = searchName;
      this._getHotSearch(1);
    },
    reset() {
      this.searchName = "";
      this._getHotSearch(1);
    },
    //删除
    remove(params) {
      let data = {};
      this.$Modal.confirm({
        content: "删除后数据无法恢复，是否继续？",
        onOk: () => {
          this.hotSearchData.splice(params.$index, 1);
          data = { id: params.row.id, method: "delete" };
          deleteHotSearch(data).then(res => {
            if (res.code == 20000) {
              this.$Message.success("删除成功");
              this._getHotSearch(1)
              this.$refs.searchPage.currentPage = 1
            } else {
              this.$Message.error(res.message);
            }
          });
        },
        onCancel: () => {}
      });
    },
    boforeUpload(file) {
      this.importForm.file = file;
    },
    //打开导入文件模态框
    openImportModal() {
      this.importModal = true;
      for (let i in this.importForm) {
        this.importForm[i] = "";
      }
      if (this.$refs.searchUpload._data.fileList) {
        this.$refs.searchUpload._data.fileList = [];
      }
    },
    //导入文件保存
    saveImport() {
      if (this.importForm.type === "") {
        this.$Message.error("请选择导入类型");
      } else if (this.importForm.file === "") {
        this.$Message.error("请选择上传文件");
      } else {
        let formData = new FormData(this.$refs.file_form);
        formData.append("type", this.importForm.type);
        formData.append("file", this.importForm.file);
        this._importHotSearch(formData);
      }
    },
    //导入文件
    _importHotSearch(data) {
      importHotSearch(data).then(res => {
        if (res.code == 20000) {
          this.$Message.success("添加成功");
          this._getHotSearch(1);
          this.$refs.searchPage.currentPage = 1
        } else {
          this.$Message.error(res.message);
        }
      });
    }
  }
};
</script>
<style>
</style>
