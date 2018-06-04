<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>资源列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="card-content">
        <Menu theme="light" active-name="resource-catalog" @on-select="menuChange">
          <MenuItem name="resource-catalog">数据资源目录</MenuItem>
          <MenuItem name="720-resource">720资源</MenuItem>
          <MenuItem name="image-resource">图片资源</MenuItem>
          <MenuItem name="area-survey">区域概况</MenuItem>
          <MenuItem name="fp-info">扶贫信息</MenuItem>
          <MenuItem name="map-configure">地图配置</MenuItem>
          <MenuItem name="macro-data">宏观数据</MenuItem>
          <MenuItem name="area-text">区域文本</MenuItem>
          <MenuItem name="data-target">数据指标</MenuItem>
        </Menu>
        <div class="table">
           <router-view/>
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
      searchType: 1,
      pageLength:0,
      isAdd:true,
      modalTitle:'',
      macroData:[],
      macroDataModal:false,
      macroDataForm:{
        name:'',
        dataId:'',
        areaCode:'',
        areaName:'',
        year:'',
        title:'',
        label:'',
        x:'',
        y:'',
        dataDesc:'',
        filedsData:''
      },
    }
  },
  methods: {
    //menu改变
    menuChange(name){
      this.$router.push(`${name}`)
    }, 
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
