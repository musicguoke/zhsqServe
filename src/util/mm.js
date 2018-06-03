import iView from "iview"

class mUtil {
  // 错误提示
  errorTips(errMsg) {
    iView.Message.error(errMsg || "好像哪里不对了~")
  }
  // 成功提示
  successTips(successMsg) {
    iView.Message.success(successMsg || "操作成功~")
  }
  returnCheck(data) {
    if (data.code === 20000) {
      this.successTips(data.message);
    } else {
      this.errorTips(data.message);
    }
  }
  formatDate(time) {
    var now = new Date(time * 1000),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate()
    return (
      y +
      "-" +
      (m < 10 ? "0" + m : m) +
      "-" +
      (d < 10 ? "0" + d : d) +
      " " +
      now.toTimeString().substr(0, 8)
    )
  }
}

export default mUtil
