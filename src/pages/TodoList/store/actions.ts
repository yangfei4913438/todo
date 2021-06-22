import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { message } from 'antd';
import types from './types';
import todo from '../../../http/todo';

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
  // 修改columns的值
  changeColumns: (value: IColumn[]): IReducer => ({
    type: types.CHANGE_COLUMNS_VALUE,
    value,
  }),
  // 初始化todo列表
  initTodoList: () => {
    return async (dispatch: ThunkDispatch<IState, any, AnyAction>) => {
      try {
        // 初始化需要全部数据，和列数据
        const [items, columns] = await Promise.all([todo.getTodoItems(), todo.getTodoColumns()]);
        // 全部todo数据
        dispatch(actions.changeTodoList(items.data));
        // 列数据
        dispatch(actions.changeColumns(columns.data));
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
