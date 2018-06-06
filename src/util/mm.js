
class mUtil {
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
