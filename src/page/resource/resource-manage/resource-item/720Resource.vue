<template>
    <div>
        <v-search :import-show="false" :delete-show="false" @on-reset="reset" @on-search="search" @on-build="openAddModal"/>
        <el-table :data="resource720Data" border style="width: 100%">
            <!-- <el-table-column prop="id" label="ID">
            </el-table-column> -->
            <el-table-column prop="name" label="资源名称" >
            </el-table-column>
            <el-table-column prop="path" label="资源路径">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small"  @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange"  show-total show-elevator ref="page720"></Page>
        </div>
        <Modal v-model="resource720Modal" :title=modalTitle @on-ok="addOrUpdate" ref="modal720">
            <Form :model="resource720Form" :label-width="80" :rules="rule720" ref="rule720">
                <FormItem label="资源名称" prop="name">
                    <Input v-model="resource720Form.name" ></Input>
                </FormItem>
                <FormItem label="资源路径" prop="path">
                    <Input v-model="resource720Form.path" ></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { get720Resource,add720Resource,update720Resource,delete720Resource} from '@/api/dataSource-service'
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
            resource720Data:[],
            resource720Modal:false,
            countyList:[],
            resource720Form:{
                id:'',
                name:'',
                path:''
            },
            nowPage:1,
            rule720: {
                name: [
                    { required: true, message: '资源名称不能为空', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '资源路径不能为空', trigger: 'blur' }
                ]
            },
        }
    },
    created(){
        this._get720Resource(1)
    },
    methods:{
        _get720Resource(page){
            let data ={
                pageNo:page,
                pageSize:10, 
                name:this.searchName 
            }
            get720Resource(data).then(res=>{
                this.pageLength = res.data.total
                this.resource720Data = res.data.list
            })
        },
        //分页点击
        pageChange(Page){
            this.nowPage = Page
            this._get720Resource(Page)
        },
        //搜索
        search(searchName){
            this.searchName = searchName
            this._get720Resource(1)
            this.$refs.page720.currentPage = 1
        },
        //清空
        reset(){
            this.searchName = ''
            this._get720Resource(1)
            this.$refs.page720.currentPage = 1
        },
        //打开新增模态框
        openAddModal(){
            this.isAdd = true
            this.resource720Modal = true
            this.$refs.rule720.resetFields()
            this.modalTitle = "新增720资源"
            for(let i in this.resource720Form){
                this.resource720Form[i] = ''
            }
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.resource720Modal = true
            this.$refs.rule720.resetFields()
            this.modalTitle = "修改720资源"
            for(let i in this.resource720Form){
                this.resource720Form[i] = ''
                if(params.row[i]){
                    this.resource720Form[i] =params.row[i].toString() 
                }
             }
        },
        //点击确定
        addOrUpdate(){
            let data = {}
            this.$refs['rule720'].validate((valid)=>{
                if(valid){
                    data = {
                        name:this.resource720Form.name,
                        path:this.resource720Form.path
                    }
                    if(this.isAdd){
                        add720Resource(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('添加成功')
                                this._get720Resource(this.nowPage)
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                    }else{
                        data.id = this.resource720Form.id
                        update720Resource(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('修改成功')
                                this._get720Resource(this.nowPage)
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                    }  
                }else{
                    this.$refs['modal720'].visible = true;
                    this.resource720Modal = true;
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
                    this.resource720Data.splice(params.$index, 1);
                    delete720Resource(data).then(res => {
                        if (res.code = 20000) {
                            this.$Message.success('删除成功')
                            this._get720Resource(1)
                            this.$refs.page720.currentPage = 1
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

