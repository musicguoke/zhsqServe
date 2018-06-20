import router from "../router"

axios.defaults.timeout = 30000
axios.defaults.withCredentials = true

// 拦截请求
axios.interceptors.request.use(
  function(config) {
    document.querySelector('#loading').style.display = 'block'
    return config;
  },
  function(err) {
    document.querySelector('#loading').style.display = 'none'
    return Promise.reject(err);
  }
);

// 拦截响应
axios.interceptors.response.use(
  function(response) {
    document.querySelector('#loading').style.display = 'none'
    if (response.data.message == "请重新登录") {
      router.replace("/login");
    }
    return response;
  },
  function(err) {
    document.querySelector('#loading').style.display = 'none'
    return Promise.reject(err);
  }
);

export default axios;
