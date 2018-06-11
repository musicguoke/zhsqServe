<template>
    <Content :style="{height:userListHeight}">
        <Breadcrumb :style="{padding: '17px 0'}">
            <BreadcrumbItem>用户管理</BreadcrumbItem>
            <BreadcrumbItem>用户列表</BreadcrumbItem>
        </Breadcrumb>
        <Card>
            <v-search :importShow="false" @on-search="search" @on-build="userAddOpen" @on-reset="searchReset" />
            <div class="tableSize">
                <el-table :data="userData" border style="width: 100%">
                    <el-table-column prop="arLoginname" label="用户名">
                    </el-table-column>
                    <el-table-column prop="arTruename" label="姓名" width="100">
                    </el-table-column>
                    <el-table-column prop="arMobile" label="电话">
                    </el-table-column>
                    <el-table-column prop="arEmail" label="邮箱" width="160">
                    </el-table-column>
                    <el-table-column prop="areaname" label="区县" :filters="countyFilterList" :filter-method="filterByAreaCode" filter-placement="bottom-end">
                    </el-table-column>
                    <el-table-column prop="name" label="部门" :filters="departmentFilterList" :filter-method="filterByDepartment" filter-placement="bottom-end">
                    </el-table-column>
                    <el-table-column prop="addTime" label="注册时间" sortable>
                    </el-table-column>
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <Button type="success" v-if="$route.query.id" @click="equipmentOpen(scope)" size="small" class="marginRight" title="设备信息">设备</Button>
                            <Button type="info" @click="userEditOpen(scope)" size="small" class="marginRight" title="编辑">编辑</Button>
                            <Button type="error" @click="remove(scope)" size="small" title="删除">删除</Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePage">
                <Page :total=total :current="1" v-show="total>10" @on-change="pageChange" show-total show-elevator></Page>
            </div>
        </Card>
        <Modal v-model="userModal" :title=modalTitle @on-ok="addOrUpdateUser" @on-cancel="clearFrom" :mask-closable="false">
            <Tabs active-key="key1">
                <Tab-pane label="基本信息" key="key1">
                    <Form :model="userForm" label-position="left" :label-width="100">
                        <FormItem label="用户名">
                            <Input v-model="userForm.arLoginname" placeholder="请输入用户名..."></Input>
                        </FormItem>
                        <FormItem label="真实姓名">
                            <Input v-model="userForm.arTruename" placeholder="请输入真实姓名..."></Input>
                        </FormItem>
                        <FormItem label="密码">
                            <Input v-model="userForm.arPassword" placeholder="请输入密码..." type="password"></Input>
                        </FormItem>
                        <FormItem label="部门">
                            <Select v-model="userForm.arBranch" ref="department">
                                <el-tree :data="departmentData" default-expand-all :props="defaultProps" node-key="fGuid" @node-click="handleNodeClick" :highlight-current="highlightcurrent" :expand-on-click-node="expandonclicknode"></el-tree>
                            </Select>
                        </FormItem>
                        <FormItem label="区县">
                            <Select v-model="userForm.arAreacode">
                                <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="手机号">
                            <Input v-model="userForm.arMobile" placeholder="请输入手机号..."></Input>
                        </FormItem>
                        <FormItem label="座机">
                            <Input v-model="userForm.arTel" placeholder="请输入座机..."></Input>
                        </FormItem>
                        <FormItem label="邮箱">
                            <Input v-model="userForm.arEmail" placeholder="请输入邮箱..."></Input>
                        </FormItem>
                    </Form>
                </Tab-pane>
                <Tab-pane label="选择系统" key="key2">
                    <div class="chooseSystemTitle">
                        <span class="chooseSystemSpan">系统角色选择&nbsp;&nbsp;
                            <small style="color:red">(注:同一个系统下只能选择一个角色)</small>
                        </span>
                        <Button type="info" icon="plus" title="新增系统角色选择" class="chooseSystemAdd" @click="addChooseSystem">添加</Button>
                    </div>
                    <Form label-position="left">
                        <FormItem v-for="(item,$index) in sysAndGroupList" :key="$index" style="display:flex; justify-content: flex-start">
                            <Select v-model="item.sysId" @on-change="systemChange(item.sysId,$index)" style="width:220px" :ref="'item'+$index">
                                <Option v-for="item in systemList[$index]" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="item.grId" style="width:220px;margin-left:5px;" :ref="'group'+$index">
                                <Option v-for="item in groupList[$index]" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Button type="error" icon="close-round" title="移除" @click="removeChooseSystem($index)" style="padding:4px 10px;margin-left:5px;" v-show="$index != 0"></Button>
                        </FormItem>
                    </Form>
                </Tab-pane>
            </Tabs>
        </Modal>
        <Modal v-model="equipmentModal" :title=modalTitle @on-ok="updateEquipment">
            <Form :model="equipmentForm" label-position="left" :label-width="100">
                <FormItem label="设备类型">
                    <Select v-model="equipmentForm.arOs" placeholder="请选择...">
                        <Option v-for="item in equipmentType" :value="item.value" :key="item.key">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="绑定码">
                    <Input v-model="equipmentForm.arCodeBind" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="登陆次数">
                    <Input v-model="equipmentForm.arLogincount" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="注册时间">
                    <Input v-model="equipmentForm.arRegtime" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="最后登陆时间">
                    <Input v-model="equipmentForm.arLastlogintime" placeholder="请输入..."></Input>
                </FormItem>
            </Form>
        </Modal>
    </Content>
</template>

<script>
import {    getAreaCode, getUserList, addUser, updateUser, deleteUser,
    getEquipment, updateEquipment, getRolesList} from '@/api/user-service'
import { formatDate } from '@/components/dateChange/dateChange.js'
import { getSystemList } from '@/api/system'
import { getDepartmentList } from "@/api/department-service"
import MD5 from 'crypto-js/md5'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data() {
        return {
            userListHeight: window.innerHeight - 136 + 'px',
            searchDepartment: '',
            searchCounty: '',
            searchSystem: '',
            searchName: '',
            userModal: false,
            equipmentModal: false,
            modalTitle: '',
            total: 0,
            isAdd: false,
            nowPage: 1,
            highlightcurrent: true,
            expandonclicknode: true,
            userForm: {
                arLoginname: '',
                arTruename: '',
                arPassword: '',
                arTel: '',//座机
                arMobile: '',//手机
                arEmail: '',
                arSalt: '', //校验码
                arGroup: '',//用户组
                arBranch: '', //部门
                arAreacode: '',//区县
                arSource: '',//来源
                name: '',
                sysId: '',//系统编号
                grId: '',//角色编号
                arId: ''
            },
            equipmentForm: {
                id: "",
                arId: "",
                arActive: "",
                arOs: "",
                arRegip: "",
                arCodeBind: "",
                arToken: "",
                arRegip: "",
                sysId: ""
            },
            userData: [],
            departmentData: [],
            departmentFilterList: [],
            countyFilterList: [],
            countyList: [],
            defaultProps: {
                label: "name",
                children: "list"
            },
            systemList: [],
            groupList: [],
            equipmentType: [
                {
                    value: 'ios_iphone',
                    label: 'ios_iphone'
                },
                {
                    value: 'ios_ipad',
                    label: 'ios_ipad'
                },
                {
                    value: 'android_phone',
                    label: 'android_phone'
                },
                {
                    value: 'android_pad',
                    label: 'android_pad'
                }
            ],
            sysAndGroupList: [{ sysId: '', grId: '' }],
            systemLength: 1,
            nowSystemLength: 1
        }
    },
    created() {
        getAreaCode().then(res => {
            for (let i in res.data.list) {
                this.countyList.push({
                    value: res.data.list[i].areacode,
                    label: res.data.list[i].areaname
                })
                this.countyFilterList.push({
                    text: res.data.list[i].areaname,
                    value: res.data.list[i].areaname
                })
            }
            this._getUserList(1)
        }),
            this._getDepartmentList()
    },
    methods: {
        userAddOpen() {
            this.userModal = true;
            this.isAdd = true;
            this.modalTitle = '新增用户';
            this.clearFrom()
            for (let i in this.userForm) {
                this.userForm[i] = '';
            }
            this.sysAndGroupList = [{ sysId: '', grId: '' }]
        },
        userEditOpen(params) {
            this.userModal = true;
            this.isAdd = false;
            this.modalTitle = '修改用户';
            this.clearFrom()
            for (let i in this.userForm) {
                this.userForm[i] = '';
                if (params.row[i] || params.row[i] == 0) {
                    this.userForm[i] = params.row[i]
                }
            }
            // this.$refs.department.selectedSingle = this.userForm.name
            this.$refs.department.values = [{ value: this.userForm.arBranch, label: this.userForm.name }]
            if (this.userForm.sysId.toString().indexOf(',') != -1 && this.userForm.grId.toString().indexOf(',')) {
                let sysArray = this.userForm.sysId.split(',')
                let groupArray = this.userForm.grId.split(',')
                for (let i in sysArray) {
                    this.sysAndGroupList.push({
                        sysId: sysArray[i],
                        grId: groupArray[i]
                    })
                }
            } else {
                this.sysAndGroupList.push({ sysId: this.userForm.sysId, grId: this.userForm.grId })
                this._getRolesList(this.userForm.sysId, 0)
            }
        },
        _getDepartmentList() {
            let data = {
                pageNo: 1,
                pageSize: 100,
                method: "listTree",
                grName: ""
            };
            getDepartmentList(data).then(res => {
                this.departmentData = res.data;
                res.data.map(v => {
                    this.departmentFilterList.push({
                        value: v.name,
                        text: v.name
                    })
                    if (v.list) {
                        v.list.map(a => {
                            this.departmentFilterList.push({
                                value: a.name,
                                text: a.name
                            })
                            if (a.list) {
                                a.list.map(b => {
                                    this.departmentFilterList.push({
                                        value: b.name,
                                        text: b.name
                                    })
                                })
                            }
                        })
                    }
                })
            });
        },
        _getSystemList() {
            getSystemList(1).then(res => {
                let data = res.data.list
                let array = []
                this.systemLength = res.data.total
                for (let i in data) {
                    array.push({
                        value: data[i].id,
                        label: data[i].sysName
                    })
                }
                this.systemList.push(array)
            })
        },
        //分页点击
        pageChange(page) {
            this.nowPage = page
            this._getUserList(page)
        },
        //点击搜索
        search(searchName) {
            this.searchName = searchName
            this._getUserList(1)
        },
        //点击清空
        searchReset() {
            this.searchName = ''
            this._getUserList(1)
        },
        equipmentOpen(params) {
            let data = {
                method: 'list',
                pageNo: 1,
                pageSize: 10,
                arId: params.row.arId
            }
            getEquipment(data).then(res => {
                if (res.data.total == 0) {
                    this.$Message.info("暂无设备信息")
                    this.equipmentModal = false
                } else {
                    this.equipmentModal = true
                    let data = res.data.list
                    for (let i in data) {
                        this.equipmentForm[i] = ""
                        this.equipmentForm = data[i]
                    }
                    this.equipmentForm.arLastlogintime = this._mm.formatDate(this.equipmentForm.arLastlogintime)
                    this.equipmentForm.arRegtime = this._mm.formatDate(this.equipmentForm.arRegtime)
                }
            })
        },
        remove(params) {
            let data = {
                arId: params.row.arId
            }
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this.userData.splice(params.$index, 1);
                    deleteUser(data).then(res => {
                        if (res.code = 20000) {
                            this.$Message.success('删除成功')
                            this.total--
                            this._getUserList(this.nowPage)
                        } else {
                            this.$Message.error(res.message);
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
        filterByAreaCode(value, row) {
            return row.areaname === value;
        },
        filterByDepartment(value, row) {
            return row.name === value;
        },
        _getUserList(page) {
            let data = {
                methods: 'list',
                pageNo: page || tis.nowPage,
                pageSize: 10,
                arTruename: this.searchName
            }
            getUserList(data).then(res => {
                this.userData = []
                let data = res.data.list
                for (let i in data) {
                    if (data[i].addTime < 0) {
                        data[i].addTime = Math.abs(data[i].addTime)
                    }
                    if (data[i].addTime) {
                        data[i].addTime = formatDate(new Date(data[i].addTime * 1000), 'yyyy-MM-dd')
                    }
                    this.countyList.map(v => {
                        if (v.value == data[i].arAreacode) {
                            data[i].areaname = v.label
                        }
                    })
                    this.userData.push(data[i])
                }
                this.total = res.data.total
            })
        },
        //点击确定
        addOrUpdateUser() {
            this.userForm.sysId = ''
            this.userForm.grId = ''
            this.sysAndGroupList.map(v => {
                this.userForm.sysId += v.sysId + ','
                this.userForm.grId += v.grId + ','
            })
            this.userForm.sysId = this.userForm.sysId.substring(0, this.userForm.sysId.length - 1)
            this.userForm.grId = this.userForm.grId.substring(0, this.userForm.grId.length - 1)
            let data = {
                arLoginname: this.userForm.arLoginname,
                arTruename: this.userForm.arTruename,
                arPassword: MD5(this.userForm.arPassword).toString(),
                arTel: this.userForm.arTel,//座机
                arMobile: this.userForm.arMobile,//手机
                arEmail: this.userForm.arEmail,
                arSalt: this.userForm.arSalt, //校验码
                arGroup: this.userForm.arGroup,//用户组
                arBranch: this.userForm.arBranch, //部门
                arAreacode: this.userForm.arAreacode,//区县
                arSource: this.userForm.arSource,//来源
                sysIds: this.userForm.sysId,//多个系统编号
                grIds: this.userForm.grId,//多个用用角色编号
            }
            if (this.isAdd) {
                addUser(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success('添加成功')
                        this._getUserList(this.nowPage)
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            } else {
                data.arId = this.userForm.arId
                updateUser(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success('修改成功')
                        this._getUserList(this.nowPage)
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            }
        },
        //点击取消
        clearFrom() {
            this.systemList = []
            this._getSystemList()
            this.groupList = []
            this.nowSystemLength = 1
            this.sysAndGroupList = []
        },
        //跟新设备
        updateEquipment() {
            let data = {
                id: this.equipmentForm.id,
                arId: this.equipmentForm.arId,
                arActive: this.equipmentForm.arActive,
                arOs: this.equipmentForm.arOs,
                arRegip: this.equipmentForm.arRegip,
                arCodeBind: this.equipmentForm.arCodeBind,
                arToken: this.equipmentForm.arToken,
                arRegip: this.equipmentForm.arRegip,
                sysId: this.equipmentForm.sysId
            }
            updateEquipment(data).then(res => {
                if (res.code == 20000) {
                    this.$Message.success("修改成功")
                } else {
                    this.$Message.error(res.message)
                }
            })
        },
        //部门树点击
        handleNodeClick(data) {
            this.$refs.department.values = [{ value: data.id, label: data.name }]
            this.userForm.arBranch = data.id
        },
        //点击添加，新增一行系统角色选择
        addChooseSystem() {
            if (this.nowSystemLength > this.systemLength - 1) {
                this.$Message.warning('当前只有' + this.systemLength + '个系统可供选择');
            } else {
                this.nowSystemLength++
                this.sysAndGroupList.push({ sysId: '', grId: '' })
                this._getSystemList()
            }
        },
        //移除当前行的选择框
        removeChooseSystem(index) {
            this.nowSystemLength--
            this.sysAndGroupList.splice(index, 1)
            this.systemList.splice(index, 1)
            this.groupList.splice(index, 1)
        },
        //系统改变，获取对应系统下的角色
        systemChange(id, index) {
            let list = []
            this.sysAndGroupList.map(v => {
                list.push(v.sysId)
            })
            let setList = Array.from(new Set(list))
            if (list.length > setList.length) {
                this.$Message.warning('同一个系统下只能选择一个角色')
                this.$refs['item' + index][0].selectedSingle = ''
                this.$refs['item' + index][0].model = ''
                this.sysAndGroupList[index] = {
                    sysId: '',
                    grId: ''
                }
            } else {
                this._getRolesList(id, index)
            }
        },
        _getRolesList(id, index) {
            if (!id) {
                return
            }
            getRolesList(id).then(res => {
                let data = res.data.list
                if (data.length == 0) {
                    this.$refs['group' + index][0].notFound = true
                } else {
                    this.$refs['group' + index][0].notFound = false
                }
                let array = []
                for (let i in data) {
                    array.push({
                        value: data[i].grId,
                        label: data[i].grName
                    })
                }
                if (this.groupList[index]) {
                    this.groupList.splice(index, 1, array)
                } else {
                    this.groupList.push(array)
                }
            })
        }
    }
}
</script>

<style>
.el-table-filter__content {
  max-height: 160px;
  overflow-y: scroll;
}
.ivu-select-dropdown {
  max-height: 180px;
}
.chooseSystemTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.chooseSystemSpan {
  font-size: 16px;
  display: block;
}
.chooseSystemAdd {
  font-size: 10px;
  cursor: pointer;
}
</style>
