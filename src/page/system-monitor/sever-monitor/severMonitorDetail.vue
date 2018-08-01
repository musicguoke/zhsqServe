<template>
    <Content>
        <Breadcrumb :style="{padding: '17px 0'}">
            <BreadcrumbItem>系统监控</BreadcrumbItem>
            <BreadcrumbItem>服务监控</BreadcrumbItem>
            <BreadcrumbItem>{{systemInfo.systemName}}</BreadcrumbItem>
        </Breadcrumb>
        <Card :style="{maxHeight:managerHeight}">
            <v-search v-if="userinfo.role!==3" :delete-show="false" :searchShow="false" :importShow="false" @on-delete="deleteMany" @on-build="severMonitorDetailAddOpen" />
            <div class="tableSize">
                <el-table :data="severDetailData" border style="width: 100%">
                    <el-table-column prop="id" label="序号" sortable>
                    </el-table-column>
                    <el-table-column prop="interfaceName" label="接口名称">
                    </el-table-column>
                    <el-table-column prop="statusName" label="接口状态">
                    </el-table-column>
                    <el-table-column prop="interfaceUrl" label="接口地址" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="monitorTypeName" label="监控类型" :filters="filterByType" :filter-method="filterTag">
                    </el-table-column>
                    <el-table-column prop="requestProtocol" label="请求协议">
                    </el-table-column>
                    <el-table-column prop="requestType" label="请求方式">
                    </el-table-column>
                    <el-table-column prop="monitorTime" label="监测时间" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <Button type="primary" @click="editSeverDetail(scope)" size="small">编辑</Button>
                            <Button type="error" @click="removeMonitor(scope.row)" size="small">删除</Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePage">
                <Page :total="pageLength" v-show="pageLength>10" @on-change="pageChange" show-total show-elevator ref="severMonitorPage"></Page>
            </div>
        </Card>
        <Modal v-model="severMonitorDetaiModal" :closable='false' :mask-closable="false" :title=modalTitle @on-ok="addOrUpdate">
            <h3 slot="header" style="color:#2D8CF0">监控信息</h3>
            <Form :model="severMonitorDetailForm" :label-width="60">
                <FormItem label="系统名称">
                    <Input v-model="severMonitorDetailForm.systemName" placeholder="请输入系统名称..." readonly></Input>
                </FormItem>
                <FormItem label="接口名称">
                    <Input v-model="severMonitorDetailForm.interfaceName" placeholder="请输入接口名称..."></Input>
                </FormItem>
                <FormItem label="系统编号">
                    <Input v-model="severMonitorDetailForm.systemCode" placeholder="请输入系统编号..." readonly></Input>
                </FormItem>
                <FormItem label="接口地址">
                    <Input v-model="severMonitorDetailForm.interfaceUrl" placeholder="请输入接口地址..."></Input>
                </FormItem>
                <FormItem label="接口参数">
                    <Input v-model="severMonitorDetailForm.params" placeholder="参数格式:a=1&b=2"></Input>
                </FormItem>
                <FormItem label="接口协议">
                    <Select v-model="severMonitorDetailForm.requestProtocol">
                        <Option value="http">http</Option>
                    </Select>
                </FormItem>
                <FormItem label="请求类型">
                    <Select v-model="severMonitorDetailForm.requestType">
                        <Option value="post">post</Option>
                        <Option value="get">get</Option>
                    </Select>
                </FormItem>
                <FormItem label="监控类型">
                    <Select v-model="severMonitorDetailForm.monitorType">
                        <Option value="1">数据服务</Option>
                        <Option value="2">搜索接口服务</Option>
                        <Option value="3">数据库服务</Option>
                        <Option value="4">web应用系统服务</Option>
                    </Select>
                </FormItem>
                <FormItem label="是否监控">
                    <Select v-model="severMonitorDetailForm.isWork">
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>
    </Content>
</template>

<script>
import { getSeverMonitorDetail, addSeverMonitorDetail,deleteSeverMonitorDetail} from '@/api/sever-monitor.js'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data() {
        return {
            managerHeight: window.innerHeight - 174 + 'px',
            systemInfo: '',
            severMonitorDetaiModal: false,
            modalTitle: '',
            pageLength: '',
            nowPage: '',
            severMonitorDetailForm: {
                id: "",
                systemName: "",
                interfaceName: "",
                systemCode: "",
                interfaceUrl: "",
                params: "",
                requestProtocol: "",
                requestType: "",
                monitorType: '',
                isWork: "",
            },
            severDetailData: [],
            isAdd: true,
            filterByType: [
                { text: '数据服务', value: '数据服务' },
                { text: '搜索接口服务', value: '搜索接口服务' },
                { text: '数据库服务', value: '数据库服务' },
                { text: 'web应用系统服务', value: 'web应用系统服务' }
            ]
        }
    },
    computed: {
        userinfo() {
            return JSON.parse(localStorage.getItem('userInfo'))
        }
    },
    created() {
        this.systemInfo = this.$store.state
        this._getSeverMonitorDetail(1)
    },
    methods: {
        _getSeverMonitorDetail(page) {
            let data = {
                page: page,
                systemCode: this.systemInfo.systemCode,
                start: (page - 1) * 10 < 0 ? 0 : (page - 1) * 10,
                limit: 10,
                sort: '[{"property":"id","direction":"DESC"}]'
            }
            getSeverMonitorDetail(data).then(res => {
                this.severDetailData = res.data
                this.pageLength = res.totalRecord
                this.severDetailData.map(v => {
                    if (v.monitorType == 1) {
                        v.monitorTypeName = '数据服务'
                    } else if (v.monitorType == 2) {
                        v.monitorTypeName = '搜索接口服务'
                    } else if (v.monitorType == 3) {
                        v.monitorTypeName = '数据库服务'
                    } else if (v.monitorType == 4) {
                        v.monitorTypeName = 'web应用系统服务'
                    }
                    if (v.status == 200) {
                        v.statusName = '成功'
                    } else {
                        v.statusName = '失败'
                    }
                    v.monitorTime = this._mm.formatDate(v.monitorTime)
                })
            })
        },
        pageChange(page) {
            this.nowPage = page
            this._getSeverMonitorDetail(page)
        },
        severMonitorDetailAddOpen() {
            this.severMonitorDetaiModal = true
            this.isAdd = true
            this.modalTitle = '新增监控信息'
            for (let i in this.severMonitorDetailForm) {
                this.severMonitorDetailForm[i] = ''
            }
            this.severMonitorDetailForm.systemName = this.systemInfo.systemName
            this.severMonitorDetailForm.systemCode = this.systemInfo.systemCode
        },
        editSeverDetail(params) {
            this.severMonitorDetaiModal = true
            this.isAdd = false
            this.modalTitle = '修改监控信息'
            for (let i in this.severMonitorDetailForm) {
                this.severMonitorDetailForm[i] = '';
                if (params.row[i]) {
                    this.severMonitorDetailForm[i] = params.row[i].toString()
                }
            }
        },
        addOrUpdate() {
            let data = {
                systemName: this.severMonitorDetailForm.systemName,
                interfaceName: this.severMonitorDetailForm.interfaceName,
                systemCode: this.severMonitorDetailForm.systemCode,
                interfaceUrl: this.severMonitorDetailForm.interfaceUrl,
                params: this.severMonitorDetailForm.params,
                requestProtocol: this.severMonitorDetailForm.requestProtocol,
                requestType: this.severMonitorDetailForm.requestType,
                monitorType: this.severMonitorDetailForm.monitorType,
                isWork: this.severMonitorDetailForm.isWork
            }
            let successMgs = ''
            let errorMgs = ''
            if (this.isAdd) {
                data.cmd = 'new'
                successMgs = '添加成功'
                errorMgs = '添加失败'
            } else {
                data.id = this.severMonitorDetailForm.id
                data.cmd = 'edit'
                successMgs = '修改成功'
                errorMgs = '修改失败'
            }
            addSeverMonitorDetail(data).then(res => {
                if (res.success) {
                    this.$Message.success(successMgs);
                    this._getSeverMonitorDetail(this.nowPage)
                } else {
                    this.$Message.error(errorMgs);
                }
            })
        },
        removeMonitor(params){
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    let data = {
                        ids:params.id
                    }
                    deleteSeverMonitorDetail(data).then(res=>{
                        if(res.success){
                            this.$Message.success('删除成功')
                            this._getSeverMonitorDetail(1)
                        }else{
                            this.$Message.error('删除失败')
                        }
                    })
                },
                onCancel: () => {            
                }
            });   
        },
        filterTag(value, row) {
            return row.monitorTypeName === value;
        },
    }
}
</script>

<style>
</style>
