<template>
    <div>
        <v-search :importShow="false" :searchShow="false" @on-build="openAddModal"/>
        <el-table :data="areaTargetData" border style="width: 100%">
            <el-table-column prop="areaname" label="行政区划名称">
            </el-table-column>
            <el-table-column prop="cityTarget" label="指标">
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
            <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator></Page>
        </div>
        <Modal v-model="areaTargetModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="areaTargetForm" label-position="left" :label-width="100">
                <FormItem label="行政区划">
                    <Select v-model="areaTargetForm.areacode">
                        <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="指标">
                    <Input v-model="areaTargetForm.cityTarget"></Input>
                </FormItem>
                <FormItem label="区县指标">
                    <Input v-model="areaTargetForm.countyTarget"></Input>
                </FormItem>
                <FormItem label="年份">
                    <Input v-model="areaTargetForm.year"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getAreaCode } from '@/api/user-service'
import { getAreaTarget,addAreaTarget,updateAreaTarget,deleteAreaTarget } from '@/api/dataSource-service'
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
            for(let i in this.areaTargetForm){
                this.areaTargetForm[i] = ''
            }
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.areaTargetModal = true
            for(let i in this.areaTargetForm){
                this.areaTargetForm[i] = ''
                if(params.row[i]){
                    this.areaTargetForm[i] =params.row[i] 
                }
             }
        },
        //点击确定
        addOrUpdate(){
            let data = {
                areacode:this.areaTargetForm.areacode,
                year:this.areaTargetForm.year,
                cityTarget:this.areaTargetForm.cityTarget,
                countyTarget:this.areaTargetForm.countyTarget
            }
            if(this.isAdd){
                addAreaTarget(data).then(res=>{
                    if(res.code == 20000){
                        this.$Message.success('修改成功');
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
                            this._getAreaTarget(this.nowPage)
                            this.total--
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

