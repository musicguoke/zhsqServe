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
import SGroupList from "@/system/role-group/index";
import Release from "@/system/release/index";
import SystemList from "@/page/system-list/index";

// user
import Personal from "@/page/personal/index";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "login"
    },
    {
      path: "/system-list",
      name: "system",
      component: SystemList,
      meta: { title: "系统选择" }
    },
    {
      path: "/zhsq_admin",
      component: Index,
      redirect: "/zhsq_admin/index",
      children: [
        {
          path: "index",
          name: "index",
          component: Vindex,
          meta: { title: "首页" }
        },
        {
          path: "personal-center",
          name: "personal",
          component: Personal,
          meta: { title: "个人中心" }
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
          meta: { title: "资源管理" }
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
      children: [
        {
          path: "content-list",
          component: ContentList,
          meta: { title: "目录管理" }
        },
        {
          path: "release",
          component: Release,
          meta: { title: "发布目录" }
        },
        {
          path: "user-list",
          component: UserList,
          meta: { title: "用户管理" }
        },
        {
          path: "role-list",
          component: SGroupList,
          meta: { title: "角色管理" }
        },
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
