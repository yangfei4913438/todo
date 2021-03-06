import { Record } from 'immutable';
import types from './types';

// 初始化对象，设置为不可变的immutable对象
const initialState = Record<TodoStore>({
  inputValue: '',
  items: [],
  columns: [],
})();

// 定义reducer
const reducer = (state: Record<TodoStore> = initialState, action: IReducer): Record<TodoStore> => {
  switch (action.type) {
    case types.CHANGE_INPUT_VALUE:
      // 设置值的时候，不需要加上 keyPath, 下同
      // set 方法返回的是整个 state
      return state.set('inputValue', action.value);
    case types.CHANGE_TODO_LIST_VALUE:
      return state.set('items', action.value);
    case types.CHANGE_COLUMNS_VALUE:
      return state.set('columns', action.value);
    case types.INIT_SYSTEM_DATA:
      // 合并多个值
      return state.merge({
        items: action.value.items,
        columns: action.value.columns,
      });
    default:
      return state;
  }
};

// 导出reducer
export default reducer;
