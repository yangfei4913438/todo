import types from './types';
import jsonData from '../../../mock/data.json';

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
  initTodoList: (): IReducer => ({
    type: types.INIT_SYSTEM_DATA,
    value: {
      items: jsonData.list,
      columns: jsonData.columns,
    },
  }),
};

// 导出
export default actions;
