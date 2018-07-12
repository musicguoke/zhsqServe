export const configMixin = {
  data() {
    return {
      isShow: false,
      contentHeight: window.innerHeight - 136 + 'px',
      tableHeight: window.innerHeight - 298,
      funNum: '',
      sysFunNum: '',
      levelNum: 2,
      funAry: [0, 1, 2,
       3, 4, 5, 6, 7, 8, 9,
        10,11, 12, 13, 14, 
        15, 16, 17, 18, 19,
         20,21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      arrFun: [],
      qxLevel: '一级权限',
      cilentAuthorityStr: '1',
      tabDataIdStr: '',
      mapIdStr: '',
      publishIdStr: '',
      ms720Str: '',
      mapConfigList: [],
      featureList: [],
      sysId: '',
      grId: '',
      tabActiveName: '0',
      theme: 'light',
      current: 0,
      topicDataColumns: [
        {
          type: 'selection',
          width: '50',
        },
        {
          title: '数据名称',
          key: 'dpName'
        }, {
          title: '数据类型',
          key: 'id'
        }, {
          title: '排序',
          key: 'dpListorder'
        }, {
          title: '描述',
          key: 'description'
        }
      ],
      dataColumns: [
        {
          type: 'selection',
          width: '50',
        }, {
          title: '名称',
          key: 'title'
        }, {
          title: '编码',
          key: 'id',
          sortable: true
        }, {
          title: '排序',
          key: 'listorder'
        }, {
          title: '更新时间',
          key: 'updatetime'
        }
      ],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '功能名称',
          key: 'name'
        }
      ],
      columns5: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '地图名称',
          key: 'name'
        }
      ]
    }
  },
  watch: {
    // 手动更新iview menu选中项
    tabActiveName() {
      this.$nextTick(() => {
        this.$refs.tab_menu.updateActiveName()
      })
    }
  },
  created() {
    this.sys = this.$route.query.id || ''
    this.type = this.$route.query.type || ''
    this.sysFunNum = this.$route.query.funNum || ''
    if(this.sysFunNum <= 10) {
      this.levelNum = 0
    } else if(this.sysFunNum > 10 && this.sysFunNum <= 20) {
      this.levelNum = 1
    } else {
      this.levelNum = 2
    }
    this.levelNum = this.levelNum || 2
    //
    this.funAry.map((v, index) => {
      if(v === this.sysFunNum) {
        this.funAry = this.funAry.slice(0, index + 1)
      }
    })
    this.checkFunNum(this.sysFunNum)
  },
  methods: {
    pre() {
      if (this.current !== 2) {
        this.btnContent = '下一步'
      }
      this.current -= 1
    },
    cancel() {
      this.$emit('cancel')
      this.initFormData()
    },
    // 数据初始化
    initFormData() {
      Object.assign(this.$data, this.$options.data())
    },
    tabChange(name) {
      this.tabActiveName = name
      this.current = parseInt(name)
    },
    // 权限选择
    qx1Change(value) {
      console.log(value)
      if (value === '一级权限') {
        this.arrFun = this.funAry.slice(0, 11)
      } else if (value === '二级权限') {
        this.arrFun = this.funAry.slice(11, 21)
      } else {
        this.arrFun = this.funAry.slice(21, 31)
      }
    },
    // 权限选择
    qx2Change(value) {
      this.funNum = ''
      let list = []
      this.funAry = []
      if (value === '一级权限') {
        list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        list.map(v => {
          this.funAry.push(v)
        })
      } else if (value === '二级权限') {
        list = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        list.map(v => {
          this.funAry.push(v)
        })
      } else {
        list = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        list.map(v => {
          this.funAry.push(v)
        })
      }
    },
    checkFunNum(funNum) {
      if (funNum < 11) {
        this.qxLevel = '一级权限'
      } else if (funNum > 10 && funNum < 21) {
        this.qxLevel = '二级权限'
      } else if (funNum > 20) {
        this.qxLevel = '三级权限'
      }
      this.qx1Change(this.qxLevel)
      this.qx2Change(this.qxLevel)
      this.funNum = funNum
    },
    selectMapConfig(section, row) {
      // 已选择地图项
      let id = []
      section.map(v => id.push(v.id))
      this.mapIdStr = id.toString()
    },
    selectTopicDataConfig(section) {
      // 专题数据选择
      this.publishIdStr = section.toString()
    },
    selectDataConfig(section) {
      // 数据选择
      this.ms720Str = section.toString()
    },
    selectDataConfig(section) {
      // 数据选择
      this.tabDataIdStr = section.toString()
    },
    selectFeatureConfig(section, row) {
      //已选择功能项
      let id = []
      section.map(v => id.push(v.id))
      this.cilentAuthorityStr = id.toString()
    },
  }
}