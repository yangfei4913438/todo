/**
 * http配置
 */
import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';

// 超时时间(30秒超时)
axios.defaults.timeout = 30000;
// url前缀
axios.defaults.baseURL = '/api/v1/';

// 请求拦截器
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  // url处理
  let { url } = config;

  // 公共请求配置，具体根据业务需求变更
  const conf = {
    url,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': '', // 此处添加登录后获取的令牌，用于后端的权限校验
    },
  };
  return { ...config, ...conf };
});

// 返回拦截器
axios.interceptors.response.use(
  res => {
    // 其他情况正常返回
    return res;
  },
  async error => {
    if (!!error?.response?.status) {
      // 这里只是简单举几个例子，具体根据架构师的设计变更
      switch (error?.response?.status) {
        case 400: // 接口请求发生业务级别错误
          // 业务类的错误，由具体发起请求的地方处理，便于提供给用户友好的错误提示。
          // 非业务错误，全部在拦截器统一处理，不用再回到内部继续提示错误
          return Promise.reject(error.response);
        case 500: // 接口请求发生系统级别错误
          await message.error(error.response.statusText);
          break;
        case 401: // 没有提供认证信息。session 过期/未登录.
          // 也可以处理为直接调用登出路由，当前demo系统中不存在，所以用刷新演示一下。
          await message.error('没有访问权限，请重新登录.', 1000, () => window.location.reload);
          break;
        case 404:
          await message.error('请求的资源未找到');
          break;
        default:
          // 其他情况，统一处理
          await message.error(error.response.statusText);
      }
    } else {
      // 拿不到状态码处理
      await message.error('目前无法连接到服务器，请联系您的网络管理员处理。');
    }
  }
);

export default axios;
