import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { message } from 'antd';
import types from './types';
import todo from '../../../http/todo';

// 最优解是在服务端返回数据的时候排序好，放到缓存中。这里是mock, 所以在前端加了个排序
const sortArray = (arr: ITodoItem[]): ITodoItem[] => {
  // 先根据 等级进行排序，然后再按创建时间进行排序
  return arr.sort((a: ITodoItem, b: ITodoItem) => {
    if (a.level === b.level) {
      // 时间大的在前面
      return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
    } else {
      // 等级大的在前面
      return a.level > b.level ? -1 : 1;
    }
  });
};

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
    return async (dispatch: ThunkDispatch<IState, void, Action>) => {
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
        // 控制台打印具体的错误信息
        console.error('初始化获取数据异常:', err);
        // 400 类型的错误，会在这里触发
        // 一般来说，是在 statusText 属性上写错误原因。直接改成:
        // message.error('初始化数据失败:', err.statusText);
        // 下同
        await message.error('初始化数据失败');
      }
    };
  },
  // 新增todo
  postItem: (item: ITodoItem) => {
    return async (dispatch: ThunkDispatch<IState, void, Action>) => {
      try {
        // 更新数据
        await todo.postTodoItem(item);
      } catch (err) {
        console.error('新增todo失败:', err);
        await message.error('新增todo失败');
      }
    };
  },
  // 更新todo中的某个属性
  patchItem: (id: string, key: string, value: any) => {
    return async (dispatch: ThunkDispatch<IState, void, Action>) => {
      try {
        // 更新数据
        await todo.patchTodoItem(id, key, value);
      } catch (err) {
        console.error('更新todo属性失败:', err);
        await message.error('更新todo属性失败');
      }
    };
  },
};

// 导出
export default actions;
