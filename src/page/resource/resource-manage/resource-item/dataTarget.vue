<template>
    <div>
        <el-table :data="dataTargetData" border style="width: 100%">
             <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="name" label="数据名称" >
            </el-table-column>
            <el-table-column prop="dataId" label="数据编号" sortable>
            </el-table-column>
            <el-table-column prop="areacode" label="行政区划编码">
            </el-table-column>
            <el-table-column prop="areaname" label="行政区划名称">
            </el-table-column>
            <el-table-column prop="year" label="年份" width="80" sortable>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small"  @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator ref="dataTargetPage"></Page>
        </div>
        <Modal v-model="dataTargetModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="dataTargetForm" label-position="left" :label-width="100">
                <FormItem label="数据名称">
                    <Input v-model="dataTargetForm.name" ></Input>
                </FormItem>
                <FormItem label="数据编码">
                    <Input v-model="dataTargetForm.dataId" ></Input>
                </FormItem>
                <FormItem label="标题">
                    <Input v-model="dataTargetForm.title" ></Input>
                </FormItem>
                <FormItem label="数据标签">
                    <Input v-model="dataTargetForm.label" ></Input>
                </FormItem>
                <FormItem label="指标">
                    <Input v-model="dataTargetForm.cityTarget" ></Input>
                </FormItem>
                <FormItem label="行政区划">
                    <Select v-model="dataTargetForm.areacode" :label-in-value=true @on-change="getCodeAndName">
                        <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="年份">
                    <Input v-model="dataTargetForm.year" ></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getAreaCode } from '@/api/user-service'
import { getDataTarget,updateDataTarget,deleteDataTarget } from '@/api/dataSource-service'
export default {
    data(){
        return{
            searchName: '',
            pageLength:0,
            isAdd:true,
            modalTitle:'',
            dataTargetData:[],
            dataTargetModal:false,
            countyList:[],
            dataTargetForm:{
                id:'',
                dataId:'',
                areacode:'',
                areaname:'',
                year:'',
                cityTarget:'',
                title:'',
                label:'',
                name:''
            },
            nowPage:1
        }
    },
    created(){
        getAreaCode().then(res => {
            for (let i in res.data.list) {
                this.countyList.push({
                    value: res.data.list[i].areacode,
                    label: res.data.list[i].areaname
                })
            }
        }),
        this._getDataTarget(1)
    },
    methods:{
        _getDataTarget(page){
            let data ={
                pageNo:page,
                pageSize:10, 
                title:this.searchName 
            }
            getDataTarget(data).then(res=>{
                this.pageLength = res.data.total
                this.dataTargetData = res.data.list
            })
        },
        //分页点击
        pageChange(Page){
            this.nowPage = Page
            this._getDataTarget(Page)
        },
        //打开新增模态框
        openAddModal(){
            this.isAdd = true
            this.dataTargetModal = true
            for(let i in this.dataTargetForm){
                this.dataTargetForm[i] = ''
            }
            this.modalTitle = '新增数据指标'
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.dataTargetModal = true
            for(let i in this.dataTargetForm){
                this.dataTargetForm[i] = ''
                if(params.row[i]){
                    this.dataTargetForm[i] =params.row[i] 
                }
             }
             this.modalTitle = '修改数据指标'
        },
        //点击确定
        addOrUpdate(){
            let data = {}
            data = {
                id:this.dataTargetForm.id,
                dataId:this.dataTargetForm.dataId,
                areacode:this.dataTargetForm.areacode,
                areaname:this.dataTargetForm.areaname,
                year:this.dataTargetForm.year,
                cityTarget:this.dataTargetForm.cityTarget,
                title:this.dataTargetForm.title,
                label:this.dataTargetForm.label,
                name:this.dataTargetForm.name
            }
            updateDataTarget(data).then(res=>{
                if(res.code == 20000){
                    this.$Message.success('修改成功');
                    this._getDataTarget(this.nowPage)
                }
            })  
        },
        getCodeAndName(data){
            this.dataTargetForm.areacode = data.value
            this.dataTargetData.areaname = data.label
        },
        remove(params) {
            let data = {
                id: params.row.id
            }
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this.dataTargetData.splice(params.$index, 1);
                    deleteDataTarget(data).then(res => {
                        if (res.code = 20000) {
                            this.$Message.success('删除成功')
                            this._getDataTarget(1)
                            this.$refs.dataTargetPage.currentPage = 1
                        }else{
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

