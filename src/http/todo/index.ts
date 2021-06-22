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
   * 获取列的内容
   * */
  getTodoColumns: () => {
    return axios.get('/columns');
  },
  /**
   * 更新列的属性
   * */
  patchTodoColumn: (columnId: number, taskIds: string[]) => {
    return axios.patch(`/columns/${columnId}`, {
      taskIds,
    });
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
