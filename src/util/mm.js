import iView from 'iview'

class mUtil {
  // 错误提示
  errorTips(errMsg) {
    iView.Message.error(errMsg || '好像哪里不对了~');
  }
  // 成功提示
  successTips(successMsg) {
    iView.Message.success(successMsg || '操作成功~')
  }
  returnCheck(data) {
    if(data.code === 20000) {
      this.successTips(data.message)
    } else {
      this.errorTips(data.message)
    }
  }
}

export default mUtil