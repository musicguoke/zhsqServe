import axios from "axios";
import router from "../router";
import iView from "iview";

axios.defaults.timeout = 30000;

// 拦截请求
axios.interceptors.request.use(
  function(config) {
    iView.LoadingBar.start();
    document.querySelector('#loading').style.display = 'block'
    return config;
  },
  function(err) {
    iView.LoadingBar.error();
    document.querySelector('#loading').style.display = 'none'
    return Promise.reject(err);
  }
);

// 拦截响应
axios.interceptors.response.use(
  function(response) {
    iView.LoadingBar.finish();
    document.querySelector('#loading').style.display = 'none'
    if (response.data.message == "请重新登录") {
      router.replace("/login");
    }
    return response;
  },
  function(err) {
    iView.LoadingBar.error();
    document.querySelector('#loading').style.display = 'none'
    return Promise.reject(err);
  }
);

export default axios;
