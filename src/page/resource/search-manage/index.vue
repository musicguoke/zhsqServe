<template>
  <Content>
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>搜索管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="seach_condition">
        <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
        <div class="search_button">
          <i-button @click="show()">新增</i-button>
        </div>
      </div>
      <div class="card-content">
        <Menu theme="light" active-name="1">
          <MenuItem name="1">周边搜索</MenuItem>
          <MenuItem name="2">搜索词库</MenuItem>
        </Menu>
        <div class="table">
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
