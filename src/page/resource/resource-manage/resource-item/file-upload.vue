<template>
  <div class="file-upload">
    <Row>
      <Card dis-hover>
        <p slot="title">
          <Icon type="android-hand"></Icon>
          可拖拽上传
        </p>
        <div class="height-200px">
          <Upload
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
          >
            <div style="padding: 60px 0;height: 200px;">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </div>
      </Card>
    </Row>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>
