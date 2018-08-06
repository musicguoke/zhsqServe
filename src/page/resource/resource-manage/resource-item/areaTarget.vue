<template>
    <div>
        <v-search :import-show="false" :search-show="false" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-build="openAddModal"/>
        <el-table :data="areaTargetData" border style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="areaname" label="行政区划名称" width="160">
            </el-table-column>
            <el-table-column prop="cityTarget" label="指标" :show-overflow-tooltip="true">
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
            <Page :total="pageLength" @on-change="pageChange"  show-total show-elevator ref="areaTargetPage"></Page>
        </div>
        <Modal v-model="areaTargetModal" :title=modalTitle @on-ok="addOrUpdate" ref="areaTargetModal">
            <Form :model="areaTargetForm"  :label-width="80" :rules="areaRule" ref="areaRule">
                <FormItem label="行政区划" prop="areacode">
                    <Select v-model="areaTargetForm.areacode">
                        <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="城镇指标" prop="cityTarget">
                    <Input v-model="areaTargetForm.cityTarget"></Input>
                </FormItem>
                <FormItem label="区域指标">
                    <Input v-model="areaTargetForm.countyTarget"></Input>
                </FormItem>
                <FormItem label="年份" prop="year">
                    <Input v-model="areaTargetForm.year"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getAreaCode } from '@/api/user-service'
import { getAreaTarget,addAreaTarget,updateAreaTarget,deleteAreaTarget,deleteAreaTargets} from '@/api/dataSource-service'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            searchName: '',
            pageLength:0,
            isAdd:true,
            modalTitle:'',
            areaTargetData:[],
            areaTargetModal:false,
            countyList:[],
            areaTargetForm:{
                id:'',
                areacode:'',
                areaname:'',
                year:'',
                cityTarget:'',
                countyTarget:''
            },
            nowPage:1,
            selectedId:[],
            areaRule: {
                areacode: [
                    { required: true, message: '行政区划不能为空', trigger: 'blur' }
                ],
                cityTarget: [
                    { required: true, message: '城镇指标不能为空', trigger: 'blur' }
                ],
                year:[
                    { required: true, message: '年份不能为空', trigger: 'blur' }
                ]
            },
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
            this._getAreaTarget(1)
        })
        
    },
    methods:{
        _getAreaTarget(page){
            let data ={
                pageNo:page,
                pageSize:10, 
                title:this.searchName 
            }
            getAreaTarget(data).then(res=>{
                this.pageLength = res.data.total
                this.areaTargetData = res.data.list
                 this.areaTargetData.map(v=>{
                     this.countyList.map(a=>{
                         if(v.areacode == a.value){
                             v.areaname = a.label
                         }
                     })
                 })
            })
        },
        //分页点击
        pageChange(Page){
            this.nowPage = Page
            this._getAreaTarget(Page)
        },
        //打开新增模态框
        openAddModal(){
            this.isAdd = true
            this.areaTargetModal = true
            this.$refs.areaRule.resetFields()
            for(let i in this.areaTargetForm){
                this.areaTargetForm[i] = ''
            }
            this.modalTitle = '新增区域指标'
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.areaTargetModal = true
             this.$refs.areaRule.resetFields()
            for(let i in this.areaTargetForm){
                this.areaTargetForm[i] = ''
                if(params.row[i]){
                    this.areaTargetForm[i] =params.row[i].toString()  
                }
             }
             this.modalTitle = '修改区域指标'
        },
        //点击确定
        addOrUpdate(){
            this.$refs['areaRule'].validate((valid)=>{
                if(valid){
                    let data = {
                        areacode:this.areaTargetForm.areacode,
                        year:this.areaTargetForm.year,
                        cityTarget:this.areaTargetForm.cityTarget,
                        countyTarget:this.areaTargetForm.countyTarget
                    }
                    if(this.isAdd){
                        addAreaTarget(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('添加成功');
                                this._getAreaTarget(this.nowPage)
                            }else{
                                this.$Message.error(res.data);
                                this._getAreaTarget(this.nowPage)
                            }
                        })
                    }else{
                        data.id = this.areaTargetForm.id
                        updateAreaTarget(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('修改成功');
                                this._getAreaTarget(this.nowPage)
                            }else{
                                this.$Message.error(res.data);
                                this._getAreaTarget(this.nowPage)
                            }
                        }) 
                    } 
                }else{
                    this.$refs['areaTargetModal'].visible = true
                    this.areaTargetModal = true
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
                    this.areaTargetData.splice(params.$index, 1);
                    deleteAreaTarget(data).then(res => {
                        if (res.code = 20000) {
                            this.$Message.success('删除成功')
                            this._getAreaTarget(1)
                            this.$refs.areaTargetPage.currentPage = 1
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
        _deleteAreaTargets(id) {
            let data = {
                ids:id
            }
            deleteAreaTargets(data).then(res => {
                if (res.code === 20000) {
                    this.$Message.success(res.message)
                    this._getAreaTarget(1)
                    this.$refs.areaTargetPage.currentPage = 1
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
                this._deleteAreaTargets(this.selectedId.toString())
                },
                onCancel: () => { }
            })
        }
    }
}
</script>
<style>

</style>

