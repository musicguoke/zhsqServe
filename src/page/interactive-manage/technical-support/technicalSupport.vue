<template>
    <Content>
        <Breadcrumb :style="{padding: '17px 0'}">
            <BreadcrumbItem>交互管理</BreadcrumbItem>
            <BreadcrumbItem>技术支持</BreadcrumbItem>
        </Breadcrumb>
        <Card :style="{maxHeight:technicalHeight}">
            <div>
                <v-search :search-show="false" :import-show="false" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-build="technicalAddOpen" />
                <div class="tableSize">
                    <el-table :data="technicalData" border style="width: 100%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="paramname" label="参数名">
                        </el-table-column>
                        <el-table-column prop="paramvalue" label="参数值">
                        </el-table-column>
                        <el-table-column prop="listorder" label="排序" sortable="">
                        </el-table-column>
                        <el-table-column label="操作" width="160" align="center">
                            <template slot-scope="scope">
                                <Button type="info" @click="technicalEditOpen(scope)" size="small" class="marginRight">编辑</Button>
                                <Button type="error" @click="remove(scope)" size="small">删除</Button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="tablePage">
                    <Page :total="pageLength" @on-change="pageChange"  show-total show-elevator ref="page"></Page>
                </div>
            </div>
        </Card>
        <Modal v-model="technicalModal" :title=modalTitle @on-ok="addOrUpdateUser">
            <Form :model="technicalForm" :label-width="80">
                <FormItem label="参数名">
                    <Input v-model="technicalForm.paramname" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="参数值">
                    <Input v-model="technicalForm.paramvalue" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="序号">
                    <Input v-model="technicalForm.listorder" placeholder="请输入..."></Input>
                </FormItem>
            </Form>
        </Modal>
    </Content>
</template>

<script>
import { getTechnicalSupportList, addTechnicalSupport, updateTechnicalSupport, deleteTechnicalSupport, deleteTechnicalSupports } from '@/api/interactive-service'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data() {
        return {
            technicalHeight: window.innerHeight - 174 + 'px',
            technicalModal: false,
            searchName: '',
            modalTitle: '',
            isAdd: false,
            technicalData: [],
            pageLength: 0,
            total: 0,
            nowPage: 1,
            isAdd: true,
            technicalForm: {
                id: '',
                paramname: '',
                paramvalue: '',
                listorder: ''
            },
            selectedId: []
        }
    },
    created() {
        this._getTechnicalSupportList(1)
    },
    methods: {
        _getTechnicalSupportList(Page) {
            let data = {
                pageNo: Page,
                pageSize: 10
            }
            getTechnicalSupportList(data).then(res => {
                this.pageLength = res.data.total
                this.technicalData = res.data.list
            })
        },
        pageChange(page) {
            this.nowPage = page
            this._getTechnicalSupportList(page)
        },
        technicalAddOpen() {
            this.isAdd = true
            this.technicalModal = true;
            for (var i in this.technicalForm) {
                this.technicalForm[i] = '';
            }
            this.modalTitle = '新增技术支持参数'
        },
        technicalEditOpen(params) {
            this.isAdd = false
            this.technicalModal = true;
            for (var i in this.technicalForm) {
                if (params.row[i]) {
                    this.technicalForm[i] = params.row[i]
                }
            }
            this.modalTitle = '修改技术支持参数'
        },
        addOrUpdateUser() {
            let data = {
                paramname: this.technicalForm.paramname,
                paramvalue: this.technicalForm.paramvalue,
                listorder: this.technicalForm.listorder
            }
            if (this.isAdd) {
                addTechnicalSupport(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success('添加成功')
                        this._getTechnicalSupportList(this.nowPage)
                    } else {
                        this.$Message.success(res.message)
                    }
                })
            } else {
                data.id = this.technicalForm.id
                updateTechnicalSupport(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success('修改成功')
                        this._getTechnicalSupportList(this.nowPage)
                    } else {
                        this.$Message.success(res.message)
                    }
                })
            }
        },
        remove(params) {
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    let data = {
                        id: params.row.id
                    }
                    deleteTechnicalSupport(data).then(res => {
                        if (res.code == 20000) {
                            this.$Message.success('删除成功');
                            this.technicalData.splice(params.$index, 1);
                            this._getTechnicalSupportList(1)
                            this.$refs.page.currentPage = 1
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
        _deleteTechnicalSupports(id) {
            let data = {
                idStr: id
            }
            deleteTechnicalSupports(data).then(res => {
                if (res.code === 20000) {
                    this.$Message.success(res.message)
                    this._getTechnicalSupportList(1)
                    this.$refs.page.currentPage = 1
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
                    this._deleteTechnicalSupports(this.selectedId.toString())
                },
                onCancel: () => { }
            })
        },
    }
}
</script>

<style>
</style>
