<template>
    <div class="map-config">
        <v-search :import-show="false" :search-show="false" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-build="openAddModal" />
        <div class="tableSize">
            <el-table :data="mapConfigureData" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="ID" width="60" sortable>
                </el-table-column>
                <el-table-column prop="mName" label="名称" width="100">
                </el-table-column>
                <el-table-column prop="mUrl" label="地图地址">
                </el-table-column>
                <el-table-column prop="mImage" label="地图图例">
                </el-table-column>
                <el-table-column prop="mVersion" label="版本" width="80" sortable>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <Button type="primary" size="small" @click="openEditModal(scope)">编辑</Button>
                        <Button type="error" size="small" @click="remove(scope)">删除</Button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator ref="mapConfigPage"></Page>
        </div>
        <Modal v-model="mapConfigureModal" :title=modalTitle @on-ok="addOrUpdate" ref="mapConfigureModal">
            <Form :model="mapConfigureForm" :label-width="80" :rules="mapRule" ref="mapRule">
                <FormItem label="名称" prop="mName">
                    <Input v-model="mapConfigureForm.mName"></Input>
                </FormItem>
                <FormItem label="地图地址" prop="mUrl">
                    <Input v-model="mapConfigureForm.mUrl"></Input>
                </FormItem>
                <FormItem label="排序" prop="mOrder">
                    <Input v-model="mapConfigureForm.mOrder"></Input>
                </FormItem>
                <FormItem label="地图图例">
                    <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccessUpload" accept=".jpg,.png" :max-size="2048" ref="upload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                        <div slot="tip">只能上传jpg/png文件，且不超过2M</div>
                    </Upload>
                </FormItem>
                <FormItem label="图例地址" prop="mImage">
                    <Input v-model="mapConfigureForm.mImage"></Input>
                </FormItem>
                <FormItem label="版本" prop="mVersion">
                    <Input v-model="mapConfigureForm.mVersion"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getMapConfigure, insertMapConfigure, updateMapConfigure, deleteMapConfigureById, deletesMapConfigureById } from '@/api/dataSource-service'
import vSearch from '@/components/search/index'
import { url } from '@/api/config.js'
export default {
    components: {
        vSearch
    },
    data() {
        return {
            searchType: 1,
            pageLength: 0,
            isAdd: true,
            modalTitle: '',
            mapConfigureData: [],
            mapConfigureModal: false,
            uploadUrl: url,
            mapConfigureForm: {
                id: '',
                mName: '',
                mUrl: '',
                mOrder: '',
                mImage: '',
                mVersion: ''
            },
            nowPage: 1,
            selectedId: [],
            mapRule: {
                mName: [
                    { required: true, message: '地图名称不能为空', trigger: 'blur' }
                ],
                mUrl: [
                    { required: true, message: '地图地址不能为空', trigger: 'blur' }
                ],
                mOrder:[
                    { required: true, message: '地图排序不能为空', trigger: 'blur' }
                ],
                mImage:[
                    { required: true, message: '图例地址不能为空', trigger: 'blur' }
                ],
                mVersion:[
                    { required: true, message: '地图版本不能为空', trigger: 'blur' }
                ]
            },
        }
    },
    created() {
        this._getMapConfigure(1)
    },
    methods: {
        //地图配置
        _getMapConfigure(page) {
            let data = {
                pageNo: page,
                pageSize: 10
            }
            getMapConfigure(data).then(res => {
                this.pageLength = res.data.total
                this.mapConfigureData = res.data.list
            })
        },
        //分页点击
        pageChange(Page) {
            this.nowPage = Page
            this._getAreaText(Page)
        },
        //打开新增模态框
        openAddModal() {
            this.isAdd = true
            this.mapConfigureModal = true
            this.$refs.mapRule.resetFields()
            for (let i in this.mapConfigureForm) {
                this.mapConfigureForm[i] = ''
            }
            if (this.$refs.upload._data.fileList) {
                this.$refs.upload._data.fileList = []
            }
            this.modalTitle = '新增地图配置'
        },
        //打开编辑模态框
        openEditModal(params) {
            this.isAdd = false
            this.mapConfigureModal = true
            this.$refs.mapRule.resetFields()
            for (let i in this.mapConfigureForm) {
                this.mapConfigureForm[i] = ''
                if (params.row[i]) {
                    this.mapConfigureForm[i] = params.row[i].toString() 
                }
            }
            if (this.$refs.upload._data.fileList) {
                this.$refs.upload._data.fileList = []
            }
            this.modalTitle = '修改地图配置'
        },
        //点击确定
        addOrUpdate() {
            this.$refs['mapRule'].validate((valid)=>{
                if(valid){
                    let data = {}
                    data = {
                        mName: this.mapConfigureForm.mName,
                        mUrl: this.mapConfigureForm.mUrl,
                        mOrder: this.mapConfigureForm.mOrder,
                        mImage: this.mapConfigureForm.mImage,
                        mVersion: this.mapConfigureForm.mVersion
                    }
                    if (this.isAdd) {
                        insertMapConfigure(data).then(res => {
                            if (res.code == 20000) {
                                this._getMapConfigure(this.nowPage)
                                this.$Message.success('添加成功');
                            } else {
                                this.$Message.error(res.message)
                            }
                        })
                    } else {
                        data.id = this.mapConfigureForm.id
                        updateMapConfigure(data).then(res => {
                            if (res.code == 20000) {
                                this._getMapConfigure(this.nowPage)
                                this.$Message.success('修改成功');
                            } else {
                                this.$Message.error(res.message)
                            }
                        })
                    }
                }else{
                    this.$refs['mapConfigureModal'].visible = true
                    this.mapConfigureModal = true
                }
            })
        },
        //删除
        remove(params) {
            let data = {}
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    data = { id: params.row.id }
                    deleteMapConfigureById(data).then(res => {
                        if (res.code == 20000) {
                            this.mapConfigureData.splice(params.$index, 1)
                            this._getMapConfigure(1)
                            this.$refs.mapConfigPage.currentPage = 1
                            this.$Message.success('删除成功');
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        _deletesMapConfigureById(id) {
            let data = {
                idStr: id
            }
            deletesMapConfigureById(data).then(res => {
                if (res.code === 20000) {
                    this.$Message.success(res.message)
                    this._getMapConfigure(1)
                } else {
                    this.$Message.error(res.message)
                }
            })
        },
        handleSelectionChange(val) {
            this.selectedId = []
            val.map(v => {
                this.selectedId.push(v.id)
            })
        },
        deleteMany() {
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this._deletesMapConfigureById(this.selectedId.toString())
                },
                onCancel: () => { }
            })
        },
        handleSuccessUpload(data) {
            if (data.code == 20000) {
                this.mapConfigureForm.mImage = data.data
                this.$Message.success(data.message)
            } else {
                this.$Message.error(data.message)
            }
        }
    }
}
</script>
<style>
</style>

