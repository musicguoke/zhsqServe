<template>
  <div class="index-content">
    <div class="banner">
      <div class="container"></div>
    </div>
    <div class="container">
      <div class="data-content">
        <div class="data-item">
          <div class="item">
            <span class="icon"></span>
            <div class="num">
              <p class="num-title">用户总数</p>
              <i>998<b>人</b></i>
            </div>
          </div>
          <div class="item">
            <span class="icon"></span>
            <div class="num">
              <p class="num-title">累计访问次数</p>
              <i>998<b>人</b></i>
            </div>
          </div>
        </div>
        <div class="data-item">
          <div class="item">
            <span class="icon"></span>
            <div class="num">
              <p class="num-title">数据总量</p>
              <i>998<b>人</b></i>
            </div>
          </div>
          <div class="item">
            <span class="icon"></span>
            <div class="num">
              <p class="num-title">部署区县</p>
              <i>998<b>人</b></i>
            </div>
          </div>
        </div>
        <div class="data-item">
          <div class="item">
            <span class="icon"></span>
            <div class="num">
              <p class="num-title">累计登陆</p>
              <i>998<b>人</b></i>
            </div>
          </div>
          <div class="item">
            <span class="icon"></span>
            <div class="num">
              <p class="num-title">系统数量</p>
              <i>998<b>人</b></i>
            </div>
          </div>
        </div>
        <div class="data-item data-right">
          <div class="item">
            <span class="item-title">今日动态</span>
            <span class="num user-num">
              <span class="num-title">用户访问：</span>
              <i>998<b>人</b></i>
            </span>
            <span class="num data-num">
              <span class="num-title">数据访问：</span>
              <i>998<b>人</b></i>
            </span>
          </div>
        </div>
      </div>
      <div class="data-content data-bot">
        <div class="data-item">
          <span class="item-title">终端分布</span>
        </div>
        <div class="data-item">
          <span class="item-title">系统运行状态</span>
          <span class="more">更多>></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
.banner {
  width: 100%;
  height: 440px;
  margin-bottom: 17px;
  background-color: #4a7fcf;
}
.data-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .data-item {
    width: 23%;
    height: 225px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #5a5a5a;
  }
  .item {
    display: flex;
    height: 103px;
    background-color: #fff;
    border: 1px solid #d8dcdf;
    border-radius: 2px;
  }
  .item-title {
    text-align: center;
    font-size: 16px;
    line-height: 74px;
    border-bottom: 1px solid #d8dcdf;
    background-color: #f7faff;
  }
  .item .icon {
    width: 108px;
    background: url(../../assets/logo.png) #f7faff no-repeat center;
    background-size: 55px 55px;
    border-right: 1px solid #d8dcdf;
  }
  .num {
    padding-top: 26px;
    padding-left: 20px;
  }
  .num .num-title {
    font-size: 16px;
  }
  .num i {
    font-size: 18px;
    font-style: italic;
  }
  .num b {
    font-size: 12px;
    font-style: normal;
  }
  .data-right .item {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    span {
      width: 100%;
      height: 33.33%;
      line-height: 74px;
    }
    .num {
      padding: 0;
      text-align: center;
    }
    .user-num {
      border-bottom: 1px dashed #d8dcdf;
    }
    .user-num i {
      font-weight: bold;
      color: #1979df;
    }
    .data-num i {
      font-weight: bold;
      color: #43c815;
    }
  }
}
.data-bot {
  margin: 23px 0;
  .data-item {
    width: 48.6%;
    background-color: #fff;
    border: 1px solid #d8dcdf;
    border-radius: 2px;
    position: relative;
  }
  .more {
    position: absolute;
    right: 20px;
    top: 28px;
  }
}
</style>

