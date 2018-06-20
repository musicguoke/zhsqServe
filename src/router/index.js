const Index = r => require(["@/page/index"], r);
const Login = r => require(["@/page/login/index"], r);
const Vindex = r => require(["@/page/index/index"], r);
const Message = r => require(["@/page/message/index"], r);
const DepartmentList = r =>
  require(["@/page/user-manage/department-list/departmentList"], r);
const UserList = r => require(["@/page/user-manage/user-list/userList"], r);
const ManagerList = r =>
  require(["@/page/user-manage/manager-list/managerList"], r);
const ContactsList = r =>
  require(["@/page/user-manage/contacts-list/contactsList"], r);
const SystemManage = r => require(["@/page/product-manage/index"], r);
const UserVisit = r => require(["@/page/behavior/user-visit/index"], r);
const DataVisit = r => require(["@/page/behavior/data-visit/index"], r);
const SearchVisit = r => require(["@/page/behavior/search-visit/index"], r);
const ResourceManage = r =>
  require(["@/page/resource/resource-manage/index"], r);
const SearchManage = r => require(["@/page/resource/search-manage/index"], r);

//交互
const MessageManage = r =>
  require(["@/page/interactive-manage/message-manage/messageManage"], r);
const PushManage = r =>
  require(["@/page/interactive-manage/push-manage/pushManage"], r);
const TechnicalSupport = r =>
  require(["@/page/interactive-manage/technical-support/technicalSupport"], r);
const SoftWareVersion = r =>
  require(["@/page/interactive-manage/software/index"], r);
const VersionDescription = r =>
  require(["@/page/interactive-manage/version-description/index"], r);

// system
const SIndex = r => require(["@/system/index"], r);
const ContentList = r => require(["@/system/content-list/index"], r);
const SGroupList = r => require(["@/system/role-group/index"], r);
const Release = r => require(["@/system/release/index"], r);
const SystemList = r => require(["@/page/system-list/index"], r);
const Panorama = r => require(["@/system/720/index"], r);

// user
const Personal = r => require(["@/page/personal/index"], r);

//resource
const AreaText = r =>
  require(["@/page/resource/resource-manage/resource-item/areaText"], r);
const DataType = r =>
  require(["@/page/resource/resource-manage/resource-item/data-type"], r);
const MacroData = r =>
  require(["@/page/resource/resource-manage/resource-item/macroData"], r);
const MapConfigure = r =>
  require(["@/page/resource/resource-manage/resource-item/mapConfigure"], r);
const ResourceCatalog = r =>
  require(["@/page/resource/resource-manage/resource-item/resourceCatalog"], r);
const DataTarget = r =>
  require(["@/page/resource/resource-manage/resource-item/dataTarget"], r);
const AreaTarget = r =>
  require(["@/page/resource/resource-manage/resource-item/areaTarget"], r);
const STopicType = r =>
  require([
    "@/page/resource/resource-manage/resource-item/specialTopicType"
  ], r);
const STZResource = r =>
  require(["@/page/resource/resource-manage/resource-item/720Resource"], r);
const ImageResource = r =>
  require(["@/page/resource/resource-manage/resource-item/ImageResource"], r);
const Statistics = r =>
  require(["@/page/resource/resource-manage/resource-item/statistics"], r);
const AuthorityConfig = r =>
  require(["@/page/resource/resource-manage/resource-item/authorityConfig"], r);
const ZhEn = r =>
  require(["@/page/resource/resource-manage/resource-item/zh-en"], r);

//search
const HotSeach = r =>
  require(["@/page/resource/search-manage/search-item/hotSearch"], r);
const PeripheryHotspot = r =>
  require(["@/page/resource/search-manage/search-item/peripheryHotspot"], r);
const Lexicon = r =>
  require(["@/page/resource/search-manage/search-item/searchLexicon"], r);

//system-configure
const ParameterConfigure = r =>
  require([
    "@/page/system-configure/parameter-configure/parameterConfigure"
  ], r);
const DataAccess = r =>
  require(["@/page/system-configure/data-access/dataAccess"], r);

const router = new VueRouter({
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
      redirect: { name: "Vindex" },
      children: [
        {
          path: "index",
          name: "Vindex",
          component: Vindex,
          meta: { title: "首页" }
        },
        {
          path: "personal-center",
          name: "Personal",
          component: Personal,
          meta: { title: "个人中心" }
        },
        {
          path: "message",
          name: "Message",
          component: Message,
          meta: { title: "消息中心" }
        },
        {
          path: "system-manage",
          name: "SystemManage",
          component: SystemManage,
          meta: { title: "产品管理" }
        },
        {
          path: "department-list",
          name: "DepartmentList",
          component: DepartmentList,
          meta: { title: "部门列表" }
        },
        {
          path: "user-list",
          name: "UserList",
          component: UserList,
          meta: { title: "用户列表" }
        },
        {
          path: "manager-list",
          name: "ManagerList",
          component: ManagerList,
          meta: { title: "管理员列表" }
        },
        {
          path: "contacts-list",
          name: "ContactsList",
          component: ContactsList,
          meta: { title: "联系人列表" }
        },
        {
          path: "user-statistics",
          name: "UserVisit",
          component: UserVisit,
          meta: { title: "用户统计" }
        },
        {
          path: "data-statistics",
          name: "DataVisit",
          component: DataVisit,
          meta: { title: "数据统计" }
        },
        {
          path: "search-statistics",
          name: "SearchVisit",
          component: SearchVisit,
          meta: { title: "搜索统计" }
        },
        {
          path: "resource-manage",
          name: "ResourceManage",
          component: ResourceManage,
          meta: { title: "资源管理" },
          redirect: { name: "DataType" },
          children: [
            {
              path: "resource-catalog",
              component: ResourceCatalog,
              name: "ResourceCatalog",
              meta: { title: "数据资源目录" }
            },
            {
              path: "data-type",
              component: DataType,
              name: "DataType",
              meta: { title: "数据类型" }
            },
            {
              path: "720-resource",
              component: STZResource,
              name: "STZResource",
              meta: { title: "720资源" }
            },
            {
              path: "image-resource",
              component: ImageResource,
              name: "ImageResource",
              meta: { title: "图片资源" }
            },
            {
              path: "statistics",
              component: Statistics,
              name: "Statistics",
              meta: { title: "统计分析" }
            },
            {
              path: "authority-config",
              component: AuthorityConfig,
              name: "AuthorityConfig",
              meta: { title: "统计分析" }
            },
            {
              path: "zh-en",
              component: ZhEn,
              name: "ZhEn",
              meta: { title: "中英文对照" }
            },
            {
              path: "area-target",
              component: AreaTarget,
              name: "AreaTarget",
              meta: { title: "区域指标" }
            },
            {
              path: "area-text",
              component: AreaText,
              name: "AreaText",
              meta: { title: "区域文本" }
            },
            {
              path: "macro-data",
              component: MacroData,
              meta: { title: "宏观数据" }
            },
            {
              path: "map-configure",
              component: MapConfigure,
              meta: { title: "地图配置" }
            },
            {
              path: "data-target",
              component: DataTarget,
              meta: { title: "数据指标" }
            },
            {
              path: "STopic-type",
              component: STopicType,
              meta: { title: "专题类型" }
            }
          ]
        },
        {
          path: "search-manage",
          name: "SearchManage",
          component: SearchManage,
          meta: { title: "搜索管理" },
          redirect: { name: "PeripheryHotspot" },
          children: [
            {
              path: "periphery-hotspot",
              component: PeripheryHotspot,
              name: "PeripheryHotspot",
              meta: { title: "周边热点" }
            },
            {
              path: "hot-search",
              component: HotSeach,
              name: "HotSearch",
              meta: { title: "热搜" }
            },
            {
              path: "search-lexicon",
              component: Lexicon,
              name: "Lexicon",
              meta: { title: "词库" }
            }
          ]
        },
        {
          path: "message-manage",
          name: "MessageManage",
          component: MessageManage,
          meta: { title: "短信管理" }
        },
        {
          path: "push-manage",
          name: "PushManage",
          component: PushManage,
          meta: { title: "推送管理" }
        },
        {
          path: "technical-support",
          name: "TechnicalSupport",
          component: TechnicalSupport,
          meta: { title: "技术支持" }
        },
        {
          path: "parameter-configure",
          name: "ParameterConfigure",
          component: ParameterConfigure,
          meta: { title: "功能配置" }
        },
        {
          path: "data-visit",
          name: "DataAccess",
          component: DataAccess,
          meta: { title: "数据访问" }
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
          path: "720",
          component: Panorama,
          meta: { title: "720" }
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
          path: "software-version",
          name: "SoftWareVersion",
          component: SoftWareVersion,
          meta: { title: "软件版本" }
        },
        {
          path: "version-description",
          name: "VersionDescription",
          component: VersionDescription,
          meta: { title: "软件描述" }
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
