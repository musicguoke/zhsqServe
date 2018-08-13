<template>
    <Content>
        <Breadcrumb :style="{padding: '17px 0'}">
            <BreadcrumbItem>用户管理</BreadcrumbItem>
            <BreadcrumbItem>用户列表</BreadcrumbItem>
        </Breadcrumb>
        <Card :style="{maxHeight:userListHeight}">
            <v-search :importShow="!isProduct" :deleteShow="false" :selectShow="isProduct" :conditionExportShow="true" :selectList="groupSingleFilterList" @on-export="openExportModal" @on-import="openImportModal" @on-search="search" @on-build="userAddOpen" @on-reset="searchReset" />
            <div class="tableSize">
                <el-table :data="userData" border style="width: 100%" @filter-change="filterChange">
                    <el-table-column prop="arLoginname" label="用户名">
                    </el-table-column>
                    <el-table-column prop="arTruename" label="姓名">
                    </el-table-column>
                    <el-table-column prop="arMobile" width="120" label="电话">
                    </el-table-column>
                    <el-table-column prop="areaname" label="区域" width="90" :filters="countyFilterList" column-key="filterByAreaCode" filter-placement="bottom-end">
                    </el-table-column>
                    <el-table-column prop="name" label="处室/科室" :filters="departmentFilterList" column-key="filterByBranch" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="msSystemMembersList" label="系统/用户组">
                        <template slot-scope="scope">
                            <p v-for="(item, index) in scope.row.msSystemMembersList" :key="index">
                                {{item.sysName}}：{{item.grName}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                        <template slot-scope="scope">
                            <!-- <Button type="success" v-if="isProduct" @click="equipmentOpen(scope)" size="small" title="设备信息">设备</Button> -->
                            <Button type="primary" @click="userEditOpen(scope)" size="small" title="编辑">编辑</Button>
                            <Button type="error" @click="remove(scope)" size="small" title="删除">删除</Button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePage">
                <Page :total="total" :current="1" @on-change="pageChange" show-total show-elevator ref="userPage"></Page>
            </div>
        </Card>
        <Modal v-model="userModal" :title="modalTitle" @on-ok="addOrUpdateUser" @on-cancel="clearFrom" :mask-closable="false" ref="userModal">
            <Tabs v-show="!isProduct" ref="tab">
                <Tab-pane label="基本信息" name="baseInfo">
                    <Form :model="userForm" :label-width="80" :rules="userRule" ref="userRule" class="user-form">
                        <FormItem label="用户名" prop="arLoginname">
                            <Input v-model="userForm.arLoginname" placeholder="请输入用户名..." maxlength="16"></Input>
                        </FormItem>
                        <FormItem label="真实姓名" prop="arTruename">
                            <Input v-model="userForm.arTruename" placeholder="请输入真实姓名..." maxlength="6"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="arPassword" v-show="isAdd">
                            <Input v-model="userForm.arPassword" placeholder="请输入密码..." type="password" maxlength="20"></Input>
                        </FormItem>
                        <FormItem label="密码" v-show="!isAdd">
                            <Input v-model="userForm.arEditPassword" placeholder="无新密码输入则保持原密码不变..." type="password" maxlength="20"></Input>
                        </FormItem>
                        <FormItem label="区县" prop="arAreacode">
                            <Select v-model="userForm.arAreacode" filterable @on-change="clearDepartmentSelect" ref="county">
                                <Option v-for="item in countyList" :value="item.areacode" :key="item.areacode">{{ item.areaname }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="处室/科室" prop="arBranch">
                            <Select
                                v-model="userForm.arBranch"
                                @on-open-change="handleBranchOpenChange"
                                ref="department1"
                                filterable
                            >
                                <el-tree
                                    :data="departmentData"
                                    :props="defaultProps"
                                    :default-expand-all="false"
                                    node-key="id"
                                    @node-click="handleNodeClick"
                                    :highlight-current="highlightcurrent"
                                    :expand-on-click-node="expandonclicknode"
                                >
                                </el-tree>
                            </Select>
                        </FormItem>
                        </FormItem>
                        <FormItem label="手机号" prop="arMobile">
                            <Input v-model="userForm.arMobile" placeholder="请输入手机号..." maxlength="11"></Input>
                        </FormItem>
                        <FormItem label="座机">
                            <Input v-model="userForm.arTel" placeholder="请输入座机..." maxlength="11"></Input>
                        </FormItem>
                        <FormItem label="邮箱">
                            <Input v-model="userForm.arEmail" placeholder="请输入邮箱..." maxlength="25"></Input>
                        </FormItem>
                        <FormItem label="开通人">
                            <Input v-model="userForm.arCreator" placeholder="请输入开通人..." maxlength="15"></Input>
                        </FormItem>
                        <FormItem label="开通应用服务联系人">
                            <Input v-model="userForm.arContacts" placeholder="请输入开通应用服务联系人..." maxlength="11"></Input>
                        </FormItem>
                        <FormItem label="用户描述">
                            <Input v-model="userForm.arDescribe" type="textarea" :rows="2" placeholder="请输入用户描述..." maxlength="60"></Input>
                        </FormItem>
                    </Form>
                </Tab-pane>
                <Tab-pane label="选择系统" name="system">
                    <div class="chooseSystemTitle">
                        <span class="chooseSystemSpan">系统角色选择&nbsp;&nbsp;
                            <small style="color:red">(注:同一个系统下只能选择一个角色)</small>
                        </span>
                        <Button type="info" icon="plus" title="新增系统角色选择" class="chooseSystemAdd" @click="addChooseSystem">添加</Button>
                    </div>
                    <Form>
                        <FormItem v-for="(item,$index) in sysAndGroupList" :key="$index" style="display:flex; justify-content: flex-start">
                            <Select
                                v-model="item.sysId"
                                @on-change="systemChange(item.sysId,$index)"
                                style="width:220px"
                                :ref="'item'+$index"
                                filterable
                            >
                                <Option
                                    v-for="item in systemList"
                                    :value="item.id"
                                    :key="item.id"
                                >{{ item.sysName }}</Option>
                            </Select>
                            <Select v-model="item.grId" style="width:220px;margin-left:5px;" :ref="'group'+$index" filterable>
                                <Option
                                    v-for="item in groupList[$index]"
                                    :value="item.value"
                                    :key="item.value"
                                >{{ item.label }}</Option>
                            </Select>
                            <Button type="error" icon="close-round" title="移除" @click="removeChooseSystem($index)" style="padding:4px 10px;margin-left:5px;"></Button>
                        </FormItem>
                    </Form>
                </Tab-pane>
            </Tabs>
            <Form :model="userForm" :label-width="80" v-show="isProduct" :rules="userRuleProduct" ref="userRuleProduct" class="user-form">
                <FormItem label="用户名" prop="arLoginname">
                    <Input v-model="userForm.arLoginname" placeholder="请输入用户名..." maxlength="16"></Input>
                </FormItem>
                <FormItem label="真实姓名" prop="arTruename">
                    <Input v-model="userForm.arTruename" placeholder="请输入真实姓名..." maxlength="6"></Input>
                </FormItem>
                <FormItem label="密码" prop="arPassword" v-show="isAdd">
                    <Input v-model="userForm.arPassword" placeholder="请输入密码..." type="password" maxlength="20"></Input>
                </FormItem>
                <FormItem label="密码" v-show="!isAdd">
                    <Input v-model="userForm.arEditPassword" placeholder="无新密码输入则保持原密码不变..." type="password" maxlength="20"></Input>
                </FormItem>
                <FormItem label="区县" prop="arAreacode">
                    <Input v-model="userForm.arAreaname" readonly></Input>
                </FormItem>
                <FormItem label="处室/科室" prop="arBranch">
                    <Select v-model="userForm.arBranch" @on-open-change="handleBranchOpenChange" ref="department2">
                        <el-tree :data="departmentData" :default-expand-all="false" :props="defaultProps" node-key="id" @node-click="handleNodeClick" :highlight-current="highlightcurrent" :expand-on-click-node="expandonclicknode"></el-tree>
                    </Select>
                </FormItem>
                <FormItem label="角色" prop="role">
                    <Select v-model="userForm.grIdProduct">
                        <Option v-for="item in groupSingleList" :value="item.grId" :key="item.grId">{{ item.grName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="手机号" prop="arMobile">
                    <Input v-model="userForm.arMobile" placeholder="请输入手机号..." maxlength="11"></Input>
                </FormItem>
                <FormItem label="座机">
                    <Input v-model="userForm.arTel" placeholder="请输入座机..." maxlength="11"></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="userForm.arEmail" placeholder="请输入邮箱..." maxlength="25"></Input>
                </FormItem>
                <FormItem label="开通人">
                    <Input v-model="userForm.arCreator" placeholder="请输入开通人..." maxlength="15"></Input>
                </FormItem>
                <FormItem label="开通应用服务联系人">
                    <Input v-model="userForm.arContacts" placeholder="请输入开通应用服务联系人..." maxlength="11"></Input>
                </FormItem>
                <FormItem label="用户描述">
                    <Input v-model="userForm.arDescribe" type="textarea" :rows="2" placeholder="请输入用户描述..." maxlength="60"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="equipmentModal" :title=modalTitle>
            <el-table :data="equipmentData" border style="width: 100%">
                <el-table-column prop="arOs" label="设备类型" width="100">
                </el-table-column>
                <el-table-column prop="arCodeBind" label="绑定码">
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                        <Button type="info" @click="equipmentEditOpen(scope)" size="small" title="编辑">编辑</Button>
                    </template>
                </el-table-column>
            </el-table>
        </Modal>
        <Modal v-model="equipmentEditModal" :title=modalTitle @on-ok="updateEquipment">
            <Form :model="equipmentForm" :label-width="100">
                <FormItem label="设备类型">
                    <Input v-model="equipmentForm.arOs" readonly placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="绑定码">
                    <Input v-model="equipmentForm.arCodeBind" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="登陆次数">
                    <Input v-model="equipmentForm.arLogincount" readonly placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="注册时间">
                    <Input v-model="equipmentForm.arRegtime" readonly placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="最后登陆时间">
                    <Input v-model="equipmentForm.arLastlogintime" readonly placeholder="请输入..."></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入用户' @on-ok="saveImport">
            <Form :model="importForm" label-position="left" :label-width="100" ref="file_user_form">
                <FormItem label="用户角色">
                    <Select v-model="importForm.sysId" @on-change="importOrExportSysChange('import')" style="width:185px">
                        <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="importForm.groupId" style="width:185px;margin-left:14px;">
                        <Option v-for="item in groupImportOrExportList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择文件">
                    <div>
                        <Upload :action="`${uploadUrl}/sys/msMembers/importFile.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="userUpload">
                            <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                        </Upload>
                    </div>
                </FormItem>
                <div class="importSlot">
                    <div class="importSlotTitle">导入须知</div>
                    <p>1、导入文件大小不超过2MB.</p>
                    <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板
                        <a :href="`${uploadUrl}/sys/msMembers/downloadImportedFile.do`">点此下载.</a>
                    </p>
                </div>
            </Form>
        </Modal>
        <Modal v-model="exportUserModal" :title=modalTitle @on-ok="_exportUser">
            <Form :model="exportForm" :label-width="100">
                <FormItem label="用户类型">
                    <Select v-model="exportForm.type">
                        <Option value="0">全部</Option>
                        <Option value="1">新增用户</Option>
                        <Option value="2">活跃用户</Option>
                    </Select>
                </FormItem>
                <FormItem label="用户角色" v-show="!isProduct">
                    <Select v-model="exportForm.sysId" @on-change="importOrExportSysChange('export')" style="width:185px">
                        <Option value="0">全部</Option>
                        <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="exportForm.groupId" style="width:185px;margin-left:14px;">
                        <Option value="0">全部</Option>
                        <Option v-for="item in groupImportOrExportList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="用户角色" v-show="isProduct">
                    <Select v-model="exportForm.groupId">
                        <Option value="0">全部</Option>
                        <Option v-for="item in groupSingleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="时间" v-if="exportForm.type == 2">
                    <div style="display:flex">
                        <DatePicker type="date" @on-change="getBeginDate" placeholder="请选择开始时间" :options="limitDate" style="width: 48%" ref="beginDate"></DatePicker>
                        <p style="margin:0 4px">—</p>
                        <DatePicker type="date" @on-change="getEndDate" placeholder="请选择结束时间" :options="limitDate" style="width: 48%" ref="endDate"></DatePicker>
                    </div>
                </FormItem>
                <FormItem label="时间" v-else>
                    <div style="display:flex">
                        <DatePicker type="date" @on-change="getBeginDate" placeholder="请选择开始时间" style="width: 48%" ref="beginDate"></DatePicker>
                        <p style="margin:0 4px">—</p>
                        <DatePicker type="date" @on-change="getEndDate" placeholder="请选择结束时间" style="width: 48%" ref="endDate"></DatePicker>
                    </div>
                </FormItem>
            </Form>
        </Modal>
    </Content>
</template>

<script>
import {    getAreaCode, getUserList, addUser, updateUser, deleteUser,
    getEquipment, updateEquipment, getRolesList, getUserSysAndRole, importUser, exportUser} from '@/api/user-service'
import { getSystemList } from '@/api/system'
import { getDepartmentList } from "@/api/department-service"
import MD5 from 'crypto-js/md5'
import vSearch from '@/components/search/index'
import { url } from '@/api/config.js'
export default {
    components: {
        vSearch
    },
    data() {
        //对角色字段单独验证
        const validateRole = (rule, value, callback) => {
            callback();
        };
        return {
            uploadUrl: url,
            userListHeight: window.innerHeight - 174 + "px",
            searchDepartment: "",
            searchCounty: "",
            searchSystem: "",
            searchName: "",
            filterByGrId: "",
            filterByAreaCode: "",
            filterByBranch: "",
            userModal: false,
            equipmentModal: false,
            equipmentEditModal: false,
            importModal: false,
            modalTitle: "",
            total: 0,
            isAdd: false,
            nowPage: 1,
            isProduct: false,
            highlightcurrent: true,
            expandonclicknode: true,
            userForm: {
                arLoginname: "",
                arTruename: "",
                arPassword: "",
                arEditPassword: "", //编辑时的密码
                arTel: "", //座机
                arMobile: "", //手机
                arEmail: "",
                arSalt: "", //校验码
                arGroup: "", //用户组
                arBranch: "", //部门
                arAreacode: "", //区县code
                arAreaname: "",//区县名
                arSource: "", //来源
                name: "",
                arDescribe: "",//用户描述
                sysId: "", //系统编号
                grId: "", //角色编号
                arId: "",
                grIdProduct: "",
                arCreator: "",//开通人
                arContacts: "",//服务联系人
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
            equipmentData: [],
            userData: [],
            departmentData: [],
            departmentFilterList: [],
            countyFilterList: [],
            countyList: [],
            defaultProps: {
                label: "name",
                children: "list"
            },
            importForm: {
                file: "",
                sysId: "",
                groupId: ""
            },
            exportForm: {
                type: "",
                sysId: "",
                grId: "",
                beginDate: "",
                endDate: ""
            },
            systemList: [],
            groupList: [],
            groupSingleList: [],
            groupImportOrExportList: [],
            groupSingleFilterList: [{ value: "0", label: "全部" }],
            sysAndGroupList: [{ sysId: "", grId: "" }],
            systemLength: 1,
            nowSystemLength: 1,
            userRule: {
                arLoginname: [
                    { required: true, message: "用户名不能为空", trigger: "blur" }
                ],
                arTruename: [
                    { required: true, message: "真实姓名不能为空", trigger: "blur" }
                ],
                arMobile: [
                    { required: true, message: "用户手机不能为空", trigger: "blur" }
                ],
                arEmail: [
                    { required: true, message: "用户邮箱不能为空", trigger: "blur" },
                    { type: "email", message: "邮箱格式不正确", trigger: "blur" }
                ],
                arBranch: [{ required: true, message: "请选择部门", trigger: "blur" }],
                arAreacode: [
                    { required: true, message: "请选择区域", trigger: "change" }
                ],
                arPassword: [
                    { required: true, message: "用户密码不能为空", trigger: "blur" },
                    {
                        type: "string",
                        min: 6,
                        message: "密码不能少于6位",
                        trigger: "blur"
                    }
                ]
            },
            userRuleProduct: {
                arLoginname: [
                    { required: true, message: "用户名不能为空", trigger: "blur" }
                ],
                arTruename: [
                    { required: true, message: "真实姓名不能为空", trigger: "blur" }
                ],
                arMobile: [
                    { required: true, message: "用户手机不能为空", trigger: "blur" }
                ],
                arEmail: [
                    { required: true, message: "用户邮箱不能为空", trigger: "blur" },
                    { type: "email", message: "邮箱格式不正确", trigger: "blur" }
                ],
                arBranch: [{ required: true, message: "请选择部门", trigger: "blur" }],
                arAreacode: [
                    { required: true, message: "请选择区域", trigger: "change" }
                ],
                role: [
                    {
                        type: "number",
                        required: true,
                        validator: validateRole,
                        trigger: "change"
                    }
                ],
                arPassword: [
                    { required: true, message: "用户密码不能为空", trigger: "blur" },
                    {
                        type: "string",
                        min: 6,
                        message: "密码不能少于6位",
                        trigger: "blur"
                    }
                ]
            },
            exportUserModal: false,
            limitDate: {
                disabledDate(date) {
                    return (
                        date.valueOf() < Date.now() - 86400000 * 30 ||
                        date.valueOf() > Date.now()
                    );
                }
            }
        };
    },
    created() {
        this._getAreacode()
        this._getUserList()
        if (this.$route.params.id) {
            this.isProduct = true;
            this._getRolesSingleList(this.$route.params.id);
            this.userForm.sysId = this.$route.params.id;
        } else {
            this.isProduct = false;
        }
    },
    methods: {
        handleBranchOpenChange(bol) {
            if (bol) {
                this._getDepartmentListByAreaCode()
            }
        },
        userAddOpen() {
            this.$refs.county.query = ''
            this.$refs.userRule.resetFields()
            this.$refs.userRuleProduct.resetFields()
            this.userModal = true
            this.isAdd = true
            this.$refs.tab.activeKey = 'baseInfo'
            this.modalTitle = '新增用户'
            this.departmentData = []
            this.clearFrom()
            this._getSystemList()
            for (let i in this.userForm) {
                this.userForm[i] = ''
            }
            if (this.isProduct) {
                this.userForm.arAreacode = this.$store.state.params.areacode
                this.userForm.arAreaname = this.$store.state.params.areaname
            }
            this.sysAndGroupList = [{ sysId: '', grId: '' }]
        },
        userEditOpen(params) {
            this.$refs.county.query = ''
            this.$refs.userRule.resetFields()
            this.$refs.userRuleProduct.resetFields()
            this.userModal = true
            this.isAdd = false
            this.$refs.tab.activeKey = 'baseInfo'
            this.modalTitle = '修改用户'
            this.departmentData = []
            this.clearFrom()
            this._getSystemList()
            this.userForm.arEditPassword = ''
            for (let i in this.userForm) {
                this.userForm[i] = '';
                if (params.row[i] || params.row[i] == 0) {
                    this.userForm[i] = params.row[i]
                }
            }
            if (this.isProduct) {
                this.userForm.arAreacode = this.$store.state.params.areacode
                this.userForm.arAreaname = this.$store.state.params.areaname
            }
            this.$refs.department1.values = [{ value: this.userForm.arBranch, label: this.userForm.name }]
            this.$refs.department2.values = [{ value: this.userForm.arBranch, label: this.userForm.name }]
            getUserSysAndRole(this.userForm.arId).then(res => {
                if (!this.isProduct) {
                    this.nowSystemLength = res.data.length
                    this.sysAndGroupList = res.data
                    for (let i = 0; i < res.data.length; i++) {
                        this.groupList.push([])
                        this._getRolesList(res.data[i].sysId, i)
                    }
                } else {
                    for (let i in res.data) {
                        this.sysAndGroupList.push({ sysId: res.data[i].sysId, grId: res.data[i].grId })
                        if (res.data[i].sysId == this.$route.params.id) {
                            this.userForm.grIdProduct = res.data[i].grId
                        }
                    }
                }

            })
        },
        _getUserList(page) {
            let data = {
                methods: 'list',
                pageNo: page || this.nowPage,
                pageSize: 10,
                arTruename: this.searchName,
                grId: this.filterByGrId == 0 ? '' : this.filterByGrId,
                arBranchs: this.filterByBranch,
                arAreacodes: this.filterByAreaCode
            }
            getUserList(data).then(res => {
                this.userData = []
                let data = res.data.page.list
                for (let i in data) {
                    if (data[i].addTime < 0) {
                        data[i].addTime = Math.abs(data[i].addTime)
                    }
                    if (data[i].addTime) {
                        data[i].addTime = this._mm.formatDate(data[i].addTime)
                    }
                    this.countyList.map(v => {
                        if (v.areacode == data[i].arAreacode) {
                            data[i].areaname = v.areaname
                        }
                    })
                    this.userData.push(data[i])
                }
                for (let i in res.data.areaCodeList) {
                    this.countyFilterList.push({
                        text: res.data.areaCodeList[i].areaname,
                        value: res.data.areaCodeList[i].areaname,
                        code: res.data.areaCodeList[i].areacode
                    })
                }
                res.data.branchStructList.map(v => {
                    this.departmentFilterList.push({
                        value: v.name,
                        text: v.name,
                        code: v.id
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
                this.total = res.data.page.total
            })
        },
        _getDepartmentList() {
            getDepartmentList().then(res => {
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
        _getDepartmentListByAreaCode() {
            if (this.userForm.arAreacode) {
                getDepartmentList(this.userForm.arAreacode).then(res => {
                    this.departmentData = res.data
                })
            } else {
                this.$Message.warning("请先选区县")
            }
        },
        _getSystemList() {
            this.systemList = []
            getSystemList('', '', '', 1000).then(res => {
                this.systemList = res.data.list.slice()
                this.systemLength = res.data.total
            })
        },
        _getAreacode() {
            getAreaCode().then(res => {
                if (res.code === 20000) {
                    this.countyList = res.data.list
                }
            })
        },
        //分页点击
        pageChange(page) {
            this.nowPage = page;
            this._getUserList(page);
        },
        //点击搜索
        search(searchName, groupId) {
            this.searchName = searchName;
            this.filterByGrId = groupId;
            this._getUserList(1);
            this.$refs.userPage.currentPage = 1;
        },
        //点击清空
        searchReset() {
            this.searchName = "";
            this.filterByGrId = "";
            this._getUserList(1);
            this.$refs.userPage.currentPage = 1;
        },
        //设备列表
        equipmentOpen(params) {
            let data = {
                method: "list",
                pageNo: 1,
                pageSize: 10,
                arId: params.row.arId
            };
            getEquipment(data).then(res => {
                if (res.data.total == 0) {
                    this.$Message.info("暂无设备信息");
                    this.equipmentModal = false;
                } else {
                    this.equipmentModal = true;
                    this.equipmentData = res.data.list;
                    for (let i in this.equipmentData) {
                        this.equipmentData[i].arLastlogintime = this._mm.formatDate(
                            this.equipmentData[i].arLastlogintime
                        );
                        this.equipmentData[i].arRegtime = this._mm.formatDate(
                            this.equipmentData[i].arRegtime
                        );
                    }
                }
            });
        },
        //修改设备
        equipmentEditOpen(params) {
            this.equipmentEditModal = true;
            for (let i in params.row) {
                this.equipmentForm[i] = params.row[i];
            }
        },
        remove(params) {
            let data = {
                arId: params.row.arId
            };
            this.$Modal.confirm({
                content: "删除后数据无法恢复，是否继续？",
                onOk: () => {
                    this.userData.splice(params.$index, 1);
                    deleteUser(data).then(res => {
                        if ((res.code = 20000)) {
                            this.$Message.success("删除成功");
                            this._getUserList(1);
                            this.$refs.userPage.currentPage = 1;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                },
                onCancel: () => { }
            });
        },
        //点击确定
        addOrUpdateUser() {
            let sysNum = 0;
            if (!this.isProduct) {
                this.$refs.userRule.validate(valid => {
                    if (!valid) {
                        this.$refs.userModal.visible = true;
                        this.userModal = true;
                        this.$refs.tab.activeKey = "baseInfo";
                    } else {
                        this.sysAndGroupList.map(v => {
                            if (v.sysId) {
                                sysNum++;
                            }
                        });
                        if (sysNum == 0) {
                            this.$Message.error("请至少选择一个系统角色");
                            this.$refs.userModal.visible = true;
                            this.userModal = true;
                            this.$refs.tab.activeKey = "system";
                        } else {
                            this.addOrUpdateFun();
                        }
                    }
                });
            } else {
                this.$refs.userRuleProduct.validate(valid => {
                    if (!valid) {
                        this.$refs.userModal.visible = true;
                        this.userModal = true;
                    } else {
                        this.addOrUpdateFun();
                    }
                });
            }
        },
        addOrUpdateFun() {
            if (!this.isProduct) {
                this.userForm.sysId = "";
                this.userForm.grId = "";
                this.sysAndGroupList.map(v => {
                    if (v.sysId) {
                        this.userForm.sysId += v.sysId + ",";
                        this.userForm.grId += v.grId + ",";
                    }
                });
            } else {
                if (this.isAdd) {
                    this.userForm.sysId = this.$route.params.id + ",";
                    this.userForm.grId = this.userForm.grIdProduct + ",";
                } else {
                    this.sysAndGroupList.map(v => {
                        if (v.sysId == this.$route.params.id) {
                            this.userForm.sysId += this.$route.params.id + ",";
                            this.userForm.grId += this.userForm.grIdProduct + ",";
                        } else {
                            this.userForm.sysId += v.sysId + ",";
                            this.userForm.grId += v.grId + ",";
                        }
                    });
                }
            }
            this.userForm.sysId = this.userForm.sysId.substring(
                0,
                this.userForm.sysId.length - 1
            );
            this.userForm.grId = this.userForm.grId.substring(
                0,
                this.userForm.grId.length - 1
            );
            let data = this.userForm
            data.sysIds = this.userForm.sysId
            data.grIds = this.userForm.grId
            delete data['sysId']
            delete data['grId']
            if (this.isAdd) {
                data.arPassword = MD5(this.userForm.arPassword).toString();
                addUser(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success("添加成功");
                        this._getUserList(this.nowPage);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            } else {
                data.arId = this.userForm.arId;
                if (this.userForm.arEditPassword) {
                    data.arPassword = MD5(this.userForm.arEditPassword).toString();
                }
                updateUser(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.success("修改成功");
                        this._getUserList(this.nowPage);
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            }
        },
        //点击取消
        clearFrom() {
            this.systemList = [];
            this.groupList = [];
            this.nowSystemLength = 1;
            this.sysAndGroupList = [];
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
            };
            updateEquipment(data).then(res => {
                if (res.code == 20000) {
                    this.$Message.success("修改成功");
                    this.equipmentModal = false;
                } else {
                    this.$Message.error(res.message);
                }
            });
        },
        //部门树点击
        handleNodeClick(data) {
            this.$refs.department1.values = [{ value: data.id, label: data.name }]
            this.$refs.department2.values = [{ value: data.id, label: data.name }]
            this.userForm.arBranch = data.id
            this.$refs.department1.visible = false
            this.$refs.department2.visible = false
        },
        //点击添加，新增一行系统角色选择
        addChooseSystem() {
            if (this.nowSystemLength > this.systemLength - 1) {
                this.$Message.warning(
                    "当前只有" + this.systemLength + "个系统可供选择"
                );
            } else {
                this.nowSystemLength++;
                this.sysAndGroupList.push({ sysId: "", grId: "" });
            }
        },
        //移除当前行的选择框
        removeChooseSystem(index) {
            this.nowSystemLength--;
            this.sysAndGroupList.splice(index, 1);
            // this.systemList.splice(index, 1)
            this.groupList.splice(index, 1);
        },
        //系统改变，获取对应系统下的角色
        systemChange(id, index) {
            let list = [];
            this.sysAndGroupList[index].grId = "";
            this.sysAndGroupList.map(v => {
                list.push(v.sysId);
            });
            let setList = Array.from(new Set(list));
            if (list.length > setList.length) {
                this.$Message.warning("同一个系统下只能选择一个角色");
                this.$refs["item" + index][0].values = [];
                this.$refs["group" + index][0].values = [];
                this.$refs["item" + index][0].query = "";
                this.$refs["group" + index][0].query = "";
                this.sysAndGroupList[index] = {
                    sysId: "",
                    grId: ""
                };
            } else {
                this._getRolesList(id, index);
            }
        },
        _getRolesList(id, index) {
            if (!id) {
                return;
            }
            getRolesList(id).then(res => {
                let data = res.data.list;
                if (data.length == 0) {
                    this.$refs["group" + index][0].notFound = true;
                } else {
                    this.$refs["group" + index][0].notFound = false;
                }
                let array = [];
                for (let i in data) {
                    array.push({
                        value: data[i].grId,
                        label: data[i].grName
                    });
                }
                if (this.groupList[index]) {
                    this.groupList.splice(index, 1, array);
                } else {
                    this.groupList.push(array);
                }
            });
        },
        _getRolesSingleList(id) {
            getRolesList(id).then(res => {
                this.groupSingleList =  res.data.list
                for (let i in res.data.list) {
                    this.groupSingleFilterList.push({
                        value: parseInt(res.data.list[i].grId),
                        label: res.data.list[i].grName
                    });
                }
            });
        },
        //打开导入文件模态框
        openImportModal() {
            this.importModal = true;
            this._getSystemList();
            for (let i in this.importForm) {
                this.importForm[i] = "";
            }
            if (this.$refs.userUpload._data.fileList) {
                this.$refs.userUpload._data.fileList = [];
            }
        },
        boforeUpload(file) {
            this.importForm.file = file;
        },
        //根据sysId获取角色
        importOrExportSysChange(type) {
            this.groupImportOrExportList = [];
            let id = "";
            if (type == "import") {
                id = this.importForm.sysId;
            } else if (type == "export") {
                id = this.exportForm.sysId;
            }
            getRolesList(id).then(res => {
                for (let i in res.data.list) {
                    this.groupImportOrExportList.push({
                        value: parseInt(res.data.list[i].grId),
                        label: res.data.list[i].grName
                    });
                }
            });
        },
        //导入文件保存
        saveImport() {
            if (this.importForm.file === "") {
                this.$Message.error("请选择上传文件");
            } else if (this.importForm.groupId === "") {
                this.$Message.error("请选择用户角色");
            } else {
                let formData = new FormData(this.$refs.file_user_form);
                formData.append("grId", this.importForm.groupId);
                formData.append("file", this.importForm.file);
                this._importUser(formData);
            }
        },
        //导入文件
        _importUser(data) {
            importUser(data).then(res => {
                if (res.code == 20001) {
                    this.$Message.success(res.message);
                    this._getUserList(1);
                } else {
                    this.$Message.error(res.message);
                }
            });
        },
        getBeginDate(date) {
            this.exportForm.beginDate = date.substring(0, 10);
        },
        getEndDate(date) {
            this.exportForm.endDate = date.substring(0, 10);
        },
        //用户导出
        openExportModal() {
            this.$refs.beginDate.visualValue = "";
            this.$refs.endDate.visualValue = "";
            this.modalTitle = "导出筛选条件";
            this.exportUserModal = true;
            this._getSystemList();
            for (let i in this.exportForm) {
                this.exportForm[i] = "";
            }
        },
        _exportUser() {
            let sysId = "";
            if (this.$route.params.id) {
                sysId = this.$route.params.id;
            } else {
                sysId = this.exportForm.sysId == "0" ? "" : this.exportForm.sysId;
            }
            let data = {
                sysId: sysId,
                grId: this.exportForm.groupId == "0" ? "" : this.exportForm.groupId,
                type: this.exportForm.type == "0" ? "" : this.exportForm.groupId,
                beginDate: this.exportForm.beginDate,
                endDate: this.exportForm.endDate
            };
            let params = `${this.uploadUrl}/sys/msMembers/exportMsMembers.do?`;
            for (let i in data) {
                if (data[i]) {
                    params += `${i}=${data[i]}&`;
                } else {
                    params += `${i}=&`;
                }
            }
            window.location.href = params;
        },
        //根据区域和部门进行过滤
        filterChange(params) {
            let filterType = Object.keys(params)[0];
            if (filterType == "filterByAreaCode") {
                let areacodeList = []
                this.countyFilterList.map(v => {
                    params["filterByAreaCode"].map(n => {
                        if (n == v.text) {
                            areacodeList.push(v.code);
                        }
                    })
                })
                this.filterByAreaCode = areacodeList.join(',')
            } else if (filterType == "filterByBranch") {
                let branchList = []
                this.departmentFilterList.map(v => {
                    params["filterByBranch"].map(n => {
                        if (n == v.text) {
                            branchList.push(v.code);
                        }
                    })
                })
                this.filterByBranch = branchList.join(',')
            }
            this._getUserList(1)
            this.$refs.userPage.currentPage = 1
        },
        //区县改变清除部门选择框中的内容
        clearDepartmentSelect() {
            this.$refs.department1.values = [];
            this.$refs.department2.values = [];
        }
    }
};
</script>

<style>
.user-form {
  max-height: 400px;
  overflow-y: auto;
}
</style>
