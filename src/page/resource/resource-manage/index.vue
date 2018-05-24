<template>
  <Content>
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>资源列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="card-content">
        <Menu theme="light" active-name="1">
          <MenuItem name="1">数据资源目录</MenuItem>
          <MenuItem name="2">720资源</MenuItem>
          <MenuItem name="3">图片资源</MenuItem>
          <MenuItem name="4">区域概况</MenuItem>
          <MenuItem name="5">扶贫信息</MenuItem>
          <MenuItem name="6">专题配置</MenuItem>
          <MenuItem name="7">地图配置</MenuItem>
          <MenuItem name="8">宏观数据</MenuItem>
          <MenuItem name="9">区域文本</MenuItem>
        </Menu>
        <div class="table">
          <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
              <i-button @click="show()">新增</i-button>
            </div>
          </div>
          <Table border :columns="columns1" :data="data1"></Table>
          <div class="tablePage">
            <Page :total="data1.length"></Page>
          </div>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
export default {
  data() {
    return {
      searchName: '',
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
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
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.ivu-tree-arrow {
  color: #495060;
}
.table {
  width: 100%;
  margin-left: 16px;
}
.ivu-table-wrapper {
  width: 100%;
}
.card-content {
  display: flex;
}
</style>
