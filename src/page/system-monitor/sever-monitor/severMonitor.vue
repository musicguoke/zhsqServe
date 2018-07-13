<template>
    <Content>
        <Breadcrumb :style="{padding: '17px 0'}">
            <BreadcrumbItem>系统监控</BreadcrumbItem>
            <BreadcrumbItem>服务监控</BreadcrumbItem>
        </Breadcrumb>
        <Card :style="{maxHeight:managerHeight}">
            <v-search :delete-show="false" :searchShow="false" :importShow="false" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-build="severAddOpen" />
            <div class="tableSize">
                <el-table :data="severData" border style="width: 100%" >
                    <el-table-column prop="systemCode" label="系统编号" sortable>
                    </el-table-column>
                    <el-table-column  prop="systemName" label="系统名称">
                    </el-table-column>
                    <el-table-column  prop="totalSize" label="总数">
                    </el-table-column>
                    <el-table-column  prop="successSize" label="正常">
                    </el-table-column>
                    <el-table-column  prop="errorSize" label="异常">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <Button type="info" @click="getSeverDetail(scope)" size="small" class="marginRight">查看</Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </Card>
        <Modal v-model="severMonitorModal" :closable='false' :mask-closable="false" :title=modalTitle @on-ok="addOrUpdate">
            <h3 slot="header" style="color:#2D8CF0"></h3>
            <Form :model="severForm" :label-width="60">
                <FormItem label="系统名称">
                    <Input v-model="severForm.systemName" placeholder="请输入系统名称..."></Input>
                </FormItem>
                <FormItem label="系统编号">
                    <Input v-model="severForm.systemCode" placeholder="请输入系统编号..."></Input>
                </FormItem>
            </Form>
        </Modal>
    </Content>
</template>

<script>
import { getSeverMonitorList,addSeverMonitor } from '@/api/sever-monitor.js'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data() {
        return {
            managerHeight: window.innerHeight - 174 + 'px',
            searchName: '',
            severMonitorModal: false,
            modalTitle: '',
            severForm: {
                systemName: "",
                systemCode: ""
            },
            severData: [],
            isAdd: true,
            selectedId: []
        }
    },
    created() {
        this._getSeverMonitorList()
    },
    methods: {
        _getSeverMonitorList() {
            getSeverMonitorList().then(res => {
                this.severData = res.result
                this.severData.map(v=>{
                    v.successSize = v.totalSize - v.errorSize
                })
            })
        },
        severAddOpen() {
            this.severMonitorModal = true
            this.modalTitle = '监控信息'
            for (var i in this.severForm) {
                this.severForm[i] = ''
            }
        },
        addOrUpdate() {
            let data = {
                cmd:'new',
                systemName: this.severForm.systemName,
                systemCode: this.severForm.systemCode
            }
            addSeverMonitor(data).then(res => {
                if(res.success){
                    this.$Message.success('添加成功');
                    this._getSeverMonitorList()
                }else{
                    this.$Message.error('添加失败');
                }
            })
        },
        getSeverDetail(param){
            this.$router.push({
                name:'SeverMonitorDetail',
                params:param.row
            })
        }
    }
}
</script>

<style>
</style>
