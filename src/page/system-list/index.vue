<template>
  <div class="system-list">
    <Header>
      <div class="container">
        <div class="navbar-logo">
          <!-- <div class="layout-logo"></div> -->
          <span class="navbar-title" style="line-height: 64px;">
            管理平台
          </span>
        </div>
      </div>
    </Header>
    <div class="container">
      <Content>
        <Breadcrumb :style="{margin: '17px 0'}">
          <BreadcrumbItem>系统列表</BreadcrumbItem>
          <BreadcrumbItem>请选择您要进入的系统</BreadcrumbItem>
        </Breadcrumb>
        <Row :gutter="10" class="margin-top-10">
          <Col :md="24" :lg="6" :style="{marginBottom: '10px'}" v-for="(item, index) in sysList" :key="index">
          <Card>
            <p slot="title" class="card-title">
              <Icon type="android-map"></Icon>
              {{item.sysName}}
            </p>
            <div class="data-source-row">
              <Tag type="border" color="blue" @click.native="linkTo(item)">点击进入</Tag>
            </div>
          </Card>
          </Col>
        </Row>
      </Content>
    </div>
  </div>
</template>

<script>
import { enterSystem } from '@/api/system'
import { unreadSuggestList } from '@/api/suggest'

export default {
  data() {
    return {
      sysList: []
    }
  },
  created() {
    this.sysList = JSON.parse(localStorage.getItem('sysUserList')) || []
  },
  methods: {
    linkTo(item) {
      if (item.id) {
        this._enterSystem(item)
      }
    },
    _unreadSuggestList(page) {
      unreadSuggestList(page).then(res => {
        if (res.code === 20000) {
          this.$store.commit('setUnread', res.data)
        }
      })
    },
    _enterSystem(item) {
      enterSystem(item.id).then(res => {
        if (res.code) {
          this._unreadSuggestList()
          let params = {
            systemname: item.sysName,
            type: item.type,
            areacode: item.areacode,
            id: item.id
          }
          this.$store.commit('setParams', params)
          this.$router.push({path: `/system/${item.id}/featured-catalog`})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.system-list {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}
.data-source-row {
  display: flex;
  justify-content: flex-end;
}
</style>
