<template>
    <div>
        <v-search :search-show="false" :delete-show="false" :import-show="false" @on-build="openAddModal" />
        <el-table :data="sTopicTypeData" border style="width: 100%">
            <!-- <el-table-column prop="typeid" label="类型id">
            </el-table-column> -->
            <el-table-column prop="typename" label="类型名称">
            </el-table-column>
            <el-table-column prop="typetime" label="添加时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info" size="small" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" show-total show-elevator ref="specialPage"></Page>
        </div>
        <Modal v-model="sTopicTypeModal" :title=modalTitle @on-ok="addOrUpdate" ref="sTopicTypeModal">
            <Form :model="sTopicTypeForm" :label-width="80" :rules="topicRule" ref="topicRule">
                <FormItem label="类型id" prop="typeid">
                    <Input v-model="sTopicTypeForm.typeid"></Input>
                </FormItem>
                <FormItem label="类型名称" prop="typename">
                    <Input v-model="sTopicTypeForm.typename"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getSTopicTypeList, addSTopicType, uspdateSTopicType, deleteSTopicType } from '@/api/dataSource-service'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data() {
        return {
            searchName: '',
            pageLength: 0,
            isAdd: true,
            modalTitle: '',
            sTopicTypeData: [],
            sTopicTypeModal: false,
            countyList: [],
            sTopicTypeForm: {
                id: '',
                typeid: '',
                typename: ''
            },
            nowPage: 1,
            topicRule: {
                typeid: [
                    { required: true, message: '行政区划编码不能为空', trigger: 'blur' }
                ],
                typename: [
                    { required: true, message: '数据编码不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this._getSTopicTypeList(1)
    },
    methods: {
        _getSTopicTypeList(page) {
            let data = {
                pageNo: page,
                pageSize: 10,
            }
            getSTopicTypeList(data).then(res => {
                this.pageLength = res.data.total
                this.sTopicTypeData = res.data.list
                this.sTopicTypeData.map(v => {
                    v.typetime = this._mm.formatDate(v.typetime)
                })
            })
        },
        //分页点击
        pageChange(Page) {
            this.nowPage = Page
            this._getSTopicTypeList(Page)
        },
        //打开新增模态框
        openAddModal() {
            this.isAdd = true
            this.sTopicTypeModal = true
            this.$refs.topicRule.resetFields()
            for (let i in this.sTopicTypeForm) {
                this.sTopicTypeForm[i] = ''
            }
            this.modalTitle = '新增专题类型'
        },
        //打开编辑模态框
        openEditModal(params) {
            this.isAdd = false
            this.sTopicTypeModal = true
            this.$refs.topicRule.resetFields()
            for (let i in this.sTopicTypeForm) {
                this.sTopicTypeForm[i] = ''
                if (params.row[i]) {
                    this.sTopicTypeForm[i] = params.row[i].toString()
                }
            }
            this.modalTitle = '修改专题类型'
        },
        //点击确定
        addOrUpdate() {
            this.$refs['topicRule'].validate((valid) => {
                if (valid) {
                    let data = {
                        typeid: this.sTopicTypeForm.typeid,
                        typename: this.sTopicTypeForm.typename
                    }
                    if (this.isAdd) {
                        addSTopicType(data).then(res => {
                            if (res.code == 20000) {
                                this.$Message.success('修改成功');
                                this._getSTopicTypeList(this.nowPage)
                            } else {
                                this.$Message.error(res.data);
                                this._getSTopicTypeList(this.nowPage)
                            }
                        })
                    } else {
                        data.id = this.sTopicTypeForm.id
                        uspdateSTopicType(data).then(res => {
                            if (res.code == 20000) {
                                this.$Message.success('修改成功');
                                this._getSTopicTypeList(this.nowPage)
                            } else {
                                this.$Message.error(res.data);
                                this._getSTopicTypeList(this.nowPage)
                            }
                        })
                    }
                } else {
                    this.$refs.sTopicTypeModal.visible = true
                    this.sTopicTypeModal = true
                }
            })
        },
        remove(params) {
            let data = {
                id: params.row.id
            }
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this.sTopicTypeData.splice(params.$index, 1);
                    deleteSTopicType(data).then(res => {
                        if (res.code = 20000) {
                            this.$Message.success('删除成功')
                            this._getSTopicTypeList(1)
                            this.$refs.mapConfigPage.currentPage = 1
                        } else {
                            this.$Message.error(res.message);
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
    }
}
</script>
<style>
</style>

