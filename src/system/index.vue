<template>
  <div class="layout">
    <Layout>
      <v-header title="万州区规划定位"/>
      <div class="content">
        <div class="navbar">
          <div class="container">
            <v-menu/>
          </div>
        </div>
        <!-- <v-tags/> -->
        <div class="container">
          <router-view/>
        </div>
      </div>
      <!-- <Footer class="layout-footer-center">
        <p>建设单位：重庆市地理信息中心 | 技术支持：重庆知行宏图科技有限公司</p>
        <p>邮箱：cqzhsq@qq.com | 联系电话：023-67033881 | 地址：重庆市渝北区冉家坝规划测绘创新基地1001室</p>
      </Footer> -->
    </Layout>
  </div>
</template>
<script>
import vMenu from '@/components/s-menu/index'
import vTags from '@/components/tags/index'
import vHeader from '@/components/header/index'

export default {
  components: {
    vMenu,
    vTags,
    vHeader
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  margin-bottom: 16px;
}
</style>