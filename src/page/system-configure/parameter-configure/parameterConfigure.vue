<template>
    <Content>
        <Breadcrumb :style="{padding: '17px 0'}">
            <BreadcrumbItem>系统配置</BreadcrumbItem>
            <BreadcrumbItem>参数配置</BreadcrumbItem>
        </Breadcrumb>
        <Card :style="{maxHeight:parameterHeight}">
            <div>
                <v-search :search-show="false" :import-show="false" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-build="parameterAddOpen" />
                <div class="tableSize">
                    <el-table :data="parameterData" border style="width: 100%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <!-- <el-table-column prop="metaId" label="ID" width="60" sortable>
                        </el-table-column> -->
                        <el-table-column prop="metaKey" label="变量名">
                        </el-table-column>
                        <el-table-column prop="metaValue" label="值" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column prop="metaDec" label="描述" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column prop="metaType" label="类型">
                        </el-table-column>
                        <el-table-column label="操作" width="160" align="center">
                            <template slot-scope="scope">
                                <Button type="info" @click="parameterEditOpen(scope)" size="small" class="marginRight" v-show="scope.row.metaIskeep != 1">编辑</Button>
                                <Button type="info" @click="parameterDetailOpen(scope)" size="small" class="marginRight" v-show="scope.row.metaIskeep == 1">查看</Button>
                                <Button type="error" @click="remove(scope)" size="small">删除</Button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="tablePage">
                    <Page :total="pageLength" v-show="pageLength>10" @on-change="pageChange" show-total show-elevator ref="paramPage"></Page>
                </div>
            </div>
        </Card>
        <Modal v-model="parameterModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="parameterForm" :label-width="70">
                <FormItem label="变量名">
                    <Input v-model="parameterForm.metaKey" placeholder="请输入变量名..."></Input>
                </FormItem>
                <FormItem label="类型">
                    <Select v-model="parameterForm.metaType" placeholder="请选择...">
                        <Option v-for="item in metaTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="值">
                    <Input v-model="parameterForm.metaValue" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="能否编辑">
                    <Select v-model="parameterForm.metaIskeep" placeholder="请选择...">
                        <Option v-for="item in metaIskeepList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="预选值（用|分割）" v-show="parameterForm.metaType == 'select'">
                    <Input v-model="parameterForm.metaSelectvalue" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="parameterForm.metaDec" placeholder="请输入..."></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="parameterDetailModal" :title=modalTitle ref="modal">
            <Form :model="parameterForm" :label-width="70">
                <FormItem label="变量名">
                    <Input v-model="parameterForm.metaKey"  readonly></Input>
                </FormItem>
                <FormItem label="类型">
                    <Input v-model="parameterForm.metaType"  readonly></Input>
                </FormItem>
                <FormItem label="值">
                    <Input v-model="parameterForm.metaValue"  readonly></Input>
                </FormItem>
                <FormItem label="能否编辑">
                    <Input v-model="parameterForm.metaIskeepName" readonly></Input>
                </FormItem>
                <FormItem label="预选值（用|分割）" v-show="parameterForm.metaType == 'select'">
                    <Input v-model="parameterForm.metaSelectvalue"  readonly></Input>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="parameterForm.metaDec"  readonly></Input>
                </FormItem>
            </Form>
        </Modal>
    </Content>
</template>

<script>
import { getParameterList, addParameter, updateParameter, deleteParameter, deleteParameters } from '@/api/systemConfigure-service.js'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data() {
        return {
            parameterHeight: window.innerHeight - 174 + 'px',
            searchName: '',
            searchManagerType: '',
            parameterModal: false,
            parameterDetailModal:false,
            modalTitle: '',
            pageLength: 0,
            nowPage: 1,
            parameterForm: {
                metaKey: '',
                metaType: '',
                metaValue: '',
                metaIskeep: '',
                metaIskeepName:'',
                metaSelectvalue: '',
                metaDec: '',
                metaId: ''
            },
            metaTypeList: [
                {
                    value: 'text',
                    label: 'text',
                },
                {
                    value: 'select',
                    label: 'select',
                },
                {
                    value: 'other',
                    label: '其它',
                }
            ],
            metaIskeepList: [
                {
                    value: 1,
                    label: '不能编辑'
                },
                {
                    value: 2,
                    label: '能编辑'
                }
            ],
            parameterData: [],
            isAdd: true,
            selectedId: []
        }
    },
    created() {
        this._getParameterList(1)
    },
    methods: {
        _getParameterList(page) {
            let data = {
                pageNo: page,
                pageSize: 10
            }
            getParameterList(data).then(res => {
                this.parameterData = res.data.list
                this.pageLength = res.data.total
            })
        },
        pageChange(page) {
            this.nowPage = page
            this._getParameterList(page)
        },
        parameterAddOpen() {
            this.isAdd = true
            this.parameterModal = true
            this.modalTitle = '新增参数'
            for (var i in this.parameterForm) {
                this.parameterForm[i] = ''
            }
        },
        parameterEditOpen(params) {
            this.isAdd = false
            this.parameterModal = true;
            this.modalTitle = '修改参数';
            for (var i in this.parameterForm) {
                if (params.row[i]) {
                    this.parameterForm[i] = ''
                    this.parameterForm[i] = params.row[i]
                }
            }
        },
        parameterDetailOpen(params) {
            this.parameterDetailModal = true;
            this.modalTitle = '查看详情';
            for (var i in this.parameterForm) {
                if (params.row[i]) {
                    this.parameterForm[i] = ''
                    this.parameterForm[i] = params.row[i]
                }
            }
            this.parameterForm.metaIskeepName = this.parameterForm.metaIskeep == 1?'不能编辑':'能编辑'
            this.$refs.modal.footerHide = true
        },
        addOrUpdate() {
            let data = {
                metaKey: this.parameterForm.metaKey,
                metaDec: this.parameterForm.metaDec,
                metaType: this.parameterForm.metaType,
                metaIskeep: this.parameterForm.metaIskeep,
                weiboPic: this.parameterForm.weiboPic,
                weiboTxt: this.parameterForm.weiboTxt,
                metaValue: this.parameterForm.metaValue,
                metaSelectvalue: this.parameterForm.metaSelectvalue,
            }
            if (this.isAdd) {
                addParameter(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success('添加成功');
                        this._getParameterList(this.nowPage)
                    } else {
                        this.$Message.error(res.message)
                    }
                })
            } else {
                data.metaId = this.parameterForm.metaId
                updateParameter(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success('修改成功');
                        this._getParameterList(this.nowPage)
                    } else {
                        this.$Message.error(res.message)
                    }
                })
            }
        },
        remove(params) {
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    let data = {
                        metaId: params.row.metaId
                    }
                    deleteParameter(data).then(res => {
                        if (res.code == 20000) {
                            this.$Message.success('删除成功');
                            this._getParameterList(1)
                            this.$refs.paramPage.currentPage = 1
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
        _deleteParameters(id) {
            let data = {
                metaIdStr: id
            }
            deleteParameters(data).then(res => {
                if (res.code === 20000) {
                    this.$Message.success(res.message)
                    this._getParameterList(1)
                    this.$refs.paramPage.currentPage = 1
                } else {
                    this.$Message.error(res.message)
                }
            })
        },
        handleSelectionChange(val) {
            this.selectedId = []
            val.map(v => {
                this.selectedId.push(v.metaId)
            })
        },
        deleteMany() {
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this._deleteParameters(this.selectedId.toString())
                },
                onCancel: () => { }
            })
        }
    }
}
</script>

<style>
</style>
