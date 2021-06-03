import types from './types';

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
};

// 导出
export default actions;
