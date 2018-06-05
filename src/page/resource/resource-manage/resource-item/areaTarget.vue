<template>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px" @on-change="_getDataTarget(1)"></Input>
            <div class="search_button">
                <!-- <i-button @click="openAddModal()">新增</i-button> -->
            </div>
        </div>
        <el-table :data="areaTargetData" border style="width: 100%">
            <el-table-column prop="title" label="标题" width="200">
            </el-table-column>
            <el-table-column prop="dataId" label="数据编号" sortable>
            </el-table-column>
            <el-table-column prop="label" label="数据标签">
            </el-table-column>
            <el-table-column prop="cityTarget" label="指标">
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
            <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total ></Page>
        </div>
        <Modal v-model="areaTargetModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="areaTargetForm" label-position="left" :label-width="100">
                <FormItem label="数据名称">
                    <Input v-model="areaTargetForm.name" ></Input>
                </FormItem>
                <FormItem label="数据编码">
                    <Input v-model="areaTargetForm.dataId" ></Input>
                </FormItem>
                <FormItem label="标题">
                    <Input v-model="areaTargetForm.title" ></Input>
                </FormItem>
                <FormItem label="数据标签">
                    <Input v-model="areaTargetForm.label" ></Input>
                </FormItem>
                <FormItem label="指标">
                    <Input v-model="areaTargetForm.cityTarget" ></Input>
                </FormItem>
                <FormItem label="行政区划">
                    <Select v-model="areaTargetForm.areacode" :label-in-value=true @on-change="getCodeAndName">
                        <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="年份">
                    <Input v-model="areaTargetForm.year" ></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getAreaCode } from '@/api/user-service'
import { getAreaTarget,addAreaTarget,updateAreaTarget,deleteAreaTarget } from '@/api/dataSource-service'
export default {
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
        }),
        this._getAreaTarget(1)
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
                this.dataTargetData = res.data.list
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
            this.dataTargetModal = true
            for(let i in this.dataTargetForm){
                this.dataTargetForm[i] = ''
            }
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
            updateAreaTarget(data).then(res=>{
                if(res.code == 20000){
                    this._mm.successTips('修改成功');
                    this._getAreaTarget(this.nowPage)
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
                    deleteAreaTarget(data).then(res => {
                        if (res.code = 20000) {
                            this._mm.successTips('删除成功')
                            this.total--
                        }else{
                            this._mm.errorTips(res.message);
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

