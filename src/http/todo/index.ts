import axios from '../http';

// 定义一个请求对象
const todo = {
  /**
   * 获取todo列表数据
   * */
  getTodoItems: () => {
    return axios.get('/list');
  },
  /**
   * 新增一个todo
   * */
  postTodoItem: (item: ITodoItem) => {
    return axios.post('/list', item);
  },
  /**
   * 更新todo
   * */
  patchTodoItem: (id: string, key: string, value: any) => {
    return axios.patch(`/list/${id}`, {
      [key]: value,
    });
  },
};

export default todo;
