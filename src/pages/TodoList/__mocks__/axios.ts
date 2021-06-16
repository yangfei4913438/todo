import jsonData from '../../../mock/data.json';

let data = Array.from(jsonData.list);

// 模拟 axios 组件, 测试文件会使用这个 axios 替换组件中的 axios
const axios = {
  // 模拟get方法
  get(url: string) {
    if (url === '/list' || url === '/api/v1/list') {
      return new Promise((resolve, reject) => {
        resolve({ data });
      });
    }
  },
  defaults: {
    timeout: 30000,
    baseURL: '/api/v1/',
  },
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

export default axios;
