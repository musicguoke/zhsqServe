<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>短信管理</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight:messageManageHeight}">
      <div>
        <div class="seach_condition" style="margin-bottom:10px">
          <!-- <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input> -->
          <i-button @click="messageAddOpen">发送短信</i-button>
        </div>
        <div class="tableSize">
          <el-table :data="messageData" border style="width: 100%">
            <el-table-column prop="id" label="Id" width="60">
            </el-table-column>
            <el-table-column prop="phone" label="电话">
            </el-table-column>
            <el-table-column prop="message" label="短信内容">
            </el-table-column>
            <el-table-column prop="addTime" label="发送时间">
            </el-table-column>
            <el-table-column prop="typeName" label="发送类型">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <Button type="info" @click="messageEditOpen(scope)" size="small">详情</Button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tablePage">
          <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator></Page>
        </div>
      </div>
  </div>
  </Card>
  <Modal v-model="messageModal" :title=modalTitle ref="modal">
        <Form :model="messageForm"  :label-width="100">
            <FormItem label="电话">
                <Input v-model="messageForm.phone" placeholder="请输入电话号码..." ></Input>
            </FormItem>
            <FormItem label="短信内容">
                <Input v-model="messageForm.message" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..." ></Input>
            </FormItem>
            <FormItem label="发送时间">
                <Input v-model="messageForm.addTime" ></Input>
            </FormItem>
            <FormItem label="发送类型">
                <Input v-model="messageForm.typeName" ></Input>
            </FormItem>
        </Form>
  </Modal>
  <Modal v-model="messageSendModal" :title=modalTitle @on-ok="_sendMessage"> 
        <Form :model="messageSendForm"  :label-width="80">
            <FormItem label="电话">
                <Input v-model="messageSendForm.phoneStr" placeholder="多个电话用英文逗号隔开..." ></Input>
            </FormItem>
            <FormItem label="导入电话">
                <div style="display:flex">
                    <Input v-model="messageSendForm.Fileurl" placeholder="导入文件地址..." style="width:330px;margin-right:5px;"></Input>
                    <Button type="primary" icon="person-add" @click="importModal=true">导入</Button>
                </div>
            </FormItem>
            <FormItem label="短信内容">
                <Input v-model="messageSendForm.message" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..." ></Input>
            </FormItem>
        </Form>
  </Modal>
  <Modal v-model="importModal" title='导入电话' @on-ok="saveImport">
        <Form :model="importForm"  :label-width="100">
            <FormItem label="选择文件">
              <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials  :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="upload">
                <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
              </Upload>
            </FormItem>
            <div class="importSlot">
                <div class="importSlotTitle">导入须知</div>
                <p>1、导入文件大小不超过2MB.</p>
                <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板<a>点此下载.</a></p>
            </div>
        </Form>
    </Modal>
  </Content>
</template>

<script>
import {
  getMessageList,
  sendMessage,
  getMessageById
} from "@/api/interactive-service";
import vSearch from "@/components/search/index";
import { url } from '@/api/config.js'
export default {
  components: {
    vSearch
  },
  data() {
    return {
      searchName: "",
      messageManageHeight: window.innerHeight - 174 + "px",
      messageModal: false,
      messageSendModal: false,
      modalTitle: "",
      uploadUrl: url,
      messageData: [],
      pageLength: 1,
      messageForm: {
        phone: "",
        message: "",
        type: "",
        status: "",
        addTime: "",
        typeName: ""
      },
      messageSendForm: {
        phoneStr: "",
        Fileurl: "",
        message: ""
      },
      importModal: false,
      importForm: {
        file: ""
      }
    };
  },
  created() {
    this._getMessageList(1);
  },
  methods: {
    _getMessageList(page) {
      let data = {
        pageNo: page,
        pageSize: 10
      }
      getMessageList(data).then(res => {
        this.pageLength = res.data.total;
        this.messageData = res.data.list;
        this.messageData.map(v => {
          v.addTime = this._mm.formatDate(v.addTime);
          if (v.type == 1) {
            v.typeName = "手动发送短信";
          } else if (v.type == 2) {
            v.typeName = "注册或登录验证短信发送";
          }
        });
      });
    },
    pageChange(page) {
      this._getMessageList(page)
    },
    messageAddOpen() {
      this.modalTitle = '发送短信'
      for (var i in this.messageForm) {
        this.messageForm[i] = ""
      }
      for (var i in this.messageSendForm) {
        this.messageSendForm[i] = ""
      }
      this.importForm.file = ""
      this.messageSendModal = true
      if (this.$refs.upload._data.fileList) {
        this.$refs.upload._data.fileList = []
      }
    },
    messageEditOpen(params) {
      this.messageModal = true
      this.modalTitle = "短信详情"
      this.$refs.modal.footerHide = true
      for (var i in this.messageForm) {
        if (params.row[i]) {
          this.messageForm[i] = params.row[i]
        }
      }
    },
    handleSuccessUpload(data) {
      if (data.code == 20000) {
        this.importForm.file = data.data
        this.$Message.success(data.message)
      } else {
        this.$Message.error(data.message)
      }
    },
    //发送短信
    _sendMessage() {
      let data = {
        phoneStr: this.messageSendForm.phoneStr,
        message: this.messageSendForm.message,
        fileurl: this.messageSendForm.Fileurl
      }
      sendMessage(data).then(res => {
        if (res.code == 20000) {
          this.$Message.success(res.message)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    saveImport() {
      this.messageSendForm.Fileurl = this.importForm.file
    }
  }
};
</script>

<style>
</style>
