<template>
  <div class="tags" v-if="showTags">
    <div class="container">
      <div>
        <Tag closable color="blue" v-for="(item,index) in tagsList" @on-close="closeTags(index)" :class="{'active': isActive(item.path)}" :key="index">
          <router-link :to="item.path">
            {{item.title}}
          </router-link>
        </Tag>
      </div>
      <Dropdown @on-click="close">
        <a href="javascript:void(0)">
          标签选项
          <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="other">关闭其他</DropdownItem>
          <DropdownItem name="all">关闭所有</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagsList: []
    }
  },
  methods: {
    isActive(path) {
      return path !== this.$route.path
    },
    // 关闭单个标签
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0]
      const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1]
      if (item) {
        delItem.path === this.$route.path && this.$router.push(item.path)
      } else {
        this.$router.push('/')
      }
    },
    close(name) {
      // 关闭其他标签
      if (name === 'other') {
        const curItem = this.tagsList.filter(item => {
          return item.path === this.$route.path
        })
        this.tagsList = curItem
      }
      // 关闭全部标签
      if (name === 'all') {
        this.tagsList = []
        this.$router.push('/')
      }
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some(item => {
        return item.path === route.path
      })
      !isExist && this.tagsList.push({
        title: route.meta.title,
        path: route.path
      })
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue)
    }
  },
  created() {
    this.setTags(this.$route)
  }
}
</script>


<style lang="scss">
.tags {
  display: flex;
  height: 30px;
  line-height: 30px;
  position: relative;
  margin-bottom: 16px;
  background: #fff;
}
.tags .container {
  width: 1200px;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
</style>