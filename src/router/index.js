import Vue from "vue";
import Router from "vue-router";
import Index from "@/page/index";
import Login from "@/page/login/index";
import Vindex from "@/page/index/index";
import DepartmentList from "@/page/user-manage/department-list/departmentList";
import UserList from "@/page/user-manage/user-list/userList";
import ManagerList from "@/page/user-manage/manager-list/managerList";
import SystemManage from "@/page/product-manage/index";
import UserVisit from "@/page/behavior/user-visit/index";
import DataVisit from "@/page/behavior/data-visit/index";
import SearchVisit from "@/page/behavior/search-visit/index";
import ResourceManage from "@/page/resource/resource-manage/index";
import SearchManage from "@/page/resource/search-manage/index";
import MessageManage from "@/page/interactive-manage/message-manage/messageManage";
import PushManage from "@/page/interactive-manage/push-manage/pushManage";

// system
import SIndex from "@/system/index";
import ContentList from "@/system/content-list/index";
// import SGroupList from "@/system/user-group/index";

//resource 
import AreaText from "@/page/resource/resource-manage/resource-item/areaText.vue";
import MacroData from "@/page/resource/resource-manage/resource-item/macroData.vue";
import MapConfigure from "@/page/resource/resource-manage/resource-item/mapConfigure.vue";
Vue.use(Router);

const router = new Router({
    routes: [{
            path: "/",
            redirect: "login"
        },
        {
            path: "/zhsq_admin",
            component: Index,
            redirect: "/zhsq_admin/index",
            children: [{
                    path: "index",
                    name: "index",
                    component: Vindex,
                    meta: { title: "首页" }
                },
                {
                    path: "system-manage",
                    component: SystemManage,
                    meta: { title: "产品管理" }
                },
                {
                    path: "department-list",
                    component: DepartmentList,
                    meta: { title: "部门列表" }
                },
                {
                    path: "user-list",
                    component: UserList,
                    meta: { title: "用户列表" }
                },
                {
                    path: "manager-list",
                    component: ManagerList,
                    meta: { title: "管理员列表" }
                },
                {
                    path: "user-statistics",
                    component: UserVisit,
                    meta: { title: "用户统计" }
                },
                {
                    path: "data-statistics",
                    component: DataVisit,
                    meta: { title: "数据统计" }
                },
                {
                    path: "search-statistics",
                    component: SearchVisit,
                    meta: { title: "搜索统计" }
                },
                {
                    path: "resource-manage",
                    component: ResourceManage,
                    meta: { title: "资源管理" },
                    children: [{
                        path: "/area-text",
                        component: AreaText,
                        meta: { title: "区域文本" }
                    }, {
                        path: "/macro-data",
                        component: MacroData,
                        meta: { title: "宏观数据" }
                    }, {
                        path: "/map-configure",
                        component: MapConfigure,
                        meta: { title: "地图配置" }
                    }]
                },
                {
                    path: "search-manage",
                    component: SearchManage,
                    meta: { title: "搜索管理" }
                },
                {
                    path: "message-manage",
                    component: MessageManage,
                    meta: { title: "短信管理" }
                },
                {
                    path: "push-manage",
                    component: PushManage,
                    meta: { title: "推送管理" }
                }
            ]
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/system",
            component: SIndex,
            redirect: "/system/content-list",
            children: [{
                    path: "content-list",
                    component: ContentList,
                    meta: { title: "目录管理" }
                },
                {
                    path: "user-list",
                    component: UserList,
                    meta: { title: "用户管理" }
                },
                // {
                //     path: "suser-group-list",
                //     component: SGroupList,
                //     meta: { title: "用户组管理" }
                // },
                {
                    path: "push-manage",
                    component: PushManage,
                    meta: { title: "推送管理" }
                },
                {
                    path: "message-manage",
                    component: MessageManage,
                    meta: { title: "短信管理" }
                },
                {
                    path: "user-statistics",
                    component: UserVisit,
                    meta: { title: "用户统计" }
                },
                {
                    path: "data-statistics",
                    component: DataVisit,
                    meta: { title: "数据统计" }
                },
                {
                    path: "search-statistics",
                    component: SearchVisit,
                    meta: { title: "搜索统计" }
                }
            ]
        }
    ]
});

export default router;