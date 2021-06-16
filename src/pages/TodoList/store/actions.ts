import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { message } from 'antd';
import types from './types';
import todo from '../../../http/todo';
import { sortArray } from '../../../utils/arrayHelper';

// 定义actions对象
const actions = {
  // 修改输入框的值
  changeInputValue: (value: string): IReducer => ({
    type: types.CHANGE_INPUT_VALUE,
    value,
  }),
  // 修改todo列表的值
  changeTodoList: (value: ITodoItem[]): IReducer => ({
    type: types.CHANGE_TODO_LIST_VALUE,
    value,
  }),
  // 初始化todo列表
  initTodoList: () => {
    return async (dispatch: ThunkDispatch<IState, any, AnyAction>) => {
      try {
        // 封装的原则是，各尽其责，请求数据和redux的逻辑，不要混在一起。
        let response = await todo.getTodoItems();
        // 如果存在数据，才可以赋值
        if (response?.data) {
          // 最优解是在服务端返回数据的时候排序好，放到缓存中。这里是mock, 所以在前端加了个排序
          const list = sortArray(response.data);
          dispatch(actions.changeTodoList(list));
        }
      } catch (err) {
        // 400 类型的错误，会在这里触发
        // 一般来说，是在 statusText 属性上写错误原因。直接改成:
        // message.error('初始化数据失败:', err.statusText);
        // 下同
        await message.error('初始化数据失败');
      }
    };
  },
};

// 导出
export default actions;
