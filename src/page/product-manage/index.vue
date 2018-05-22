<template>
  <Content :style="{padding: '0 50px'}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>产品管理</BreadcrumbItem>
      <BreadcrumbItem>{{name}}</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="table" v-show="!isShow">
        <div class="seach_condition">
          <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
          <div class="search_button">
            <i-button @click="show()">新增</i-button>
          </div>
        </div>
        <Table border :columns="columns1" :data="sysData"></Table>
        <div class="tablePage">
          <Page :total="sysData.length"></Page>
        </div>
      </div>
      <div v-if="isShow" class="card-content" style="min-height: 400px;">
        <Steps :current="current">
          <Step title="基本信息" content="这里是该步骤的描述信息"></Step>
          <Step title="功能配置" content="这里是该步骤的描述信息"></Step>
          <Step title="数据配置" content="这里是该步骤的描述信息"></Step>
          <Step title="地图配置" content="这里是该步骤的描述信息"></Step>
        </Steps>
        <div>
          <Form :model="formItem" :label-width="80" style="width: 400px" v-show="current === 0">
            <FormItem label="系统名称">
              <Input v-model="formItem.input" placeholder="请输入系统名称"></Input>
            </FormItem>
            <FormItem label="系统类别">
              <Select v-model="formItem.select">
                <Option value="beijing">综合市情</Option>
                <Option value="shanghai">综合区情</Option>
                <Option value="shenzhen">规划定位</Option>
              </Select>
            </FormItem>
            <FormItem label="地区选择">
              <Select v-model="formItem.select">
                <Option value="beijing">重庆市</Option>
                <Option value="shanghai">万州区</Option>
                <Option value="shenzhen">渝北区</Option>
              </Select>
            </FormItem>
            <FormItem label="上传欢迎页">
              <Upload action="//jsonplaceholder.typicode.com/posts/">
                <Button type="ghost" icon="ios-cloud-upload-outline">点击上传</Button>
              </Upload>
            </FormItem>
          </Form>
          <div style="width: 400px" v-show="current === 1">
            <Table border ref="selection" :columns="columns4" :data="data1"></Table>
          </div>
          <div v-show="current === 2">
            <Tree :data="data2" show-checkbox></Tree>
          </div>
          <div style="width: 400px" v-show="current === 3">
            <Table border ref="selection" :columns="columns5" :data="data5"></Table>
          </div>
        </div>
        <div class="btn">
          <Button type="primary" @click="pre" v-if="this.current !== 0">上一步</Button>
          <Button type="primary" @click="next">{{btnContent}}</Button>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      btnContent: '下一步',
      isShow: false,
      name: '系统列表',
      searchName: '',
      formItem: {
        input: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: ''
      },
      columns1: [
        {
          title: '系统编号',
          key: 'id'
        },
        {
          title: '系统名称',
          key: 'name'
        },
        {
          title: '所属区县',
          key: 'address'
        },
        {
          title: '系统状态',
          key: 'status'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '25px'
                },
                on: {
                  click: () => {
                    console.log(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      sysData: [
        {
          id: 342,
          name: '综合市情系统',
          address: '重庆市',
          status: '暂停运行'
        },
        {
          id: 342,
          name: '综合市情系统',
          address: '重庆市',
          status: '暂停运行'
        },
        {
          id: 342,
          name: '综合市情系统',
          address: '重庆市',
          status: '暂停运行'
        }
      ],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '地图名称',
          key: 'name'
        }
      ],
      data1: [
        {
          name: '定位'
        },
        {
          name: '量算'
        },
        {
          name: '2D/3D切换'
        }
      ],
      columns5: [
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
      data5: [
        {
          name: '矢量'
        },
        {
          name: '影像'
        },
        {
          name: '2D/3D切换'
        }
      ],
      data2: [
        {
          title: '重庆市',
          expand: true,
          children: [
            {
              title: '地表数据'
            },
            {
              title: '各类规划'
            }
          ]
        },
        {
          title: '万州区',
          expand: true,
          children: [
            {
              title: '地表数据'
            },
            {
              title: '各类规划'
            }
          ]
        }
      ]
    }
  },
  methods: {
    show() {
      this.isShow = true
      this.name = '新建系统'
    },
    next() {
      if (this.current === 2) {
        this.btnContent = '完成'
      }
      if (this.current == 3) {
        this.isShow = false
        this.name = '系统列表'
      } else {
        this.current += 1
      }
    },
    pre() {
      if (this.current !== 2) {
        this.btnContent = '下一步'
      }
      this.current -= 1
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-tree-arrow {
  color: #495060;
}
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.form {
  width: 400px;
}
</style>
