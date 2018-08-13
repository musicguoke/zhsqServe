<template>
  <Row>
    <Col span="16" offset="4">
    <Form ref="form" :model="form" :rules="rules" :label-width="70">
      <FormItem label="增量类型" prop="importType">
        <Select v-model="form.importType" placeholder="请选择导入类型">
          <Option value="1">增量导入</Option>
          <Option value="2">全量导入</Option>
        </Select>
      </FormItem>
      <FormItem label="区域类型" prop="areaType">
        <Select v-model="form.areaType" placeholder="请选择导入类型">
          <Option value="0">主城区县</Option>
          <Option value="1">镇街乡</Option>
          <Option value="2">行政村</Option>
        </Select>
      </FormItem>
      <FormItem label="导入类型" prop="dataType">
        <Select v-model="form.dataType" placeholder="请选择导入类型">
          <Option value="0">行政区划</Option>
          <Option value="1">人口与就业</Option>
          <Option value="2">主要经济指标</Option>
        </Select>
      </FormItem>
      <FormItem label="选择文件">
        <Upload
          :action="`${uploadUrl}/sys/file/upload.do`"
          with-credentials
          :before-upload="boforeUpload"
        >
          <Button type="ghost" icon="ios-cloud-upload-outline">请选择文件</Button>
        </Upload>
      </FormItem>
      <div style="padding-left: 70px;margin-bottom:24px;">
        <Button type="primary" @click="handleUpload">上传</Button>
      </div>
      <div class="importSlot">
        <div class="importSlotTitle">导入须知</div>
        <p>1、导入文件大小不超过2MB.</p>
        <p>2、支持Microsoft Office Excel的xls和xlsx文件</p>
        <p>3、重庆市、主城区、区县行政区划模板<a :href="`${uploadUrl}/sys/msHtmlArea/downloadImportedFile.do`" download="ms_html_area.xlsx">点此下载.</a></p>
        <p>4、重庆市、主城区、区县人口信息模板<a :href="`${uploadUrl}/sys/msHtmlRk/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
        <p>5、重庆市、主城区、区县经济指标模板<a :href="`${uploadUrl}/sys/msHtmlJjzb/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
        <p>6、镇街乡行政区划模板<a :href="`${uploadUrl}/sys/msHtmlZjxArea/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
        <p>7、镇街乡人口信息模板<a :href="`${uploadUrl}/sys/msHtmlZjxRk/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
        <p>8、镇街乡经济指标模板<a :href="`${uploadUrl}/sys/msHtmlZjxJjzb/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
        <p>9、行政村行政区划模板<a :href="`${uploadUrl}/sys/msHtmlXzcArea/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
        <p>10、行政村人口信息模板<a :href="`${uploadUrl}/sys/msHtmlXzcRk/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
        <p>11、行政村经济指标模板<a :href="`${uploadUrl}/sys/msHtmlZjxJjzb/downloadImportedFile.do`" download="areaText.xlsx">点此下载.</a></p>
      </div>
    </Form>
    </Col>
  </Row>
</template>

<script>
import { url } from '@/api/config'
import axios from '@/util/http'
import qs from 'qs'
import { uploadFile } from '@/api/service'

export default {
  data() {
    return {
      uploadUrl: url,
      form: {
        importType: '',
        areaType: '',
        dataType: '',
        file: ''
      },
      rules: {
        importType: [
          { required: true, message: '请选择导入类型', trigger: 'blur' }
        ],
        areaType: [
          { required: true, message: '请选择区域类型', trigger: 'blur' }
        ],
        dataType: [
          { required: true, message: '请选择数据类型', trigger: 'blur' }
        ]
      },
      areaType: ['', 'Zjx', 'Xzc'],
      dataType: ['Area', 'Rk', 'Jjzb']
    }
  },
  methods: {
    boforeUpload(file) {
      this.form.file = file
    },
    handleUpload() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let formData = new FormData(this.$refs.form)
          formData.append('type', this.form.importType)
          formData.append('file', this.form.file)
          let url = `${this.areaType[this.form.areaType]}${this.dataType[this.form.dataType]}`
          this._uploadFile(url, formData)
        }
      })
    },
    _uploadFile(url, data) {
      uploadFile(url, data).then(res => {
        if(res.code === 20000) {
            this.$Message.success(res.message)
          } else {
            this.$Message.error(res.message)
          }
      })
    },
  }
}
</script>

<style scoped>
.importSlot {
  height: 350px;
}
</style>
