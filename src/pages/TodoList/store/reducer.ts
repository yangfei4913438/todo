import types from './types';

// 定义初始值
const initialState = {
  inputValue: '',
  items: [],
};

// 定义reducer
const reducer = (state = initialState, action: IReducer): IState => {
  switch (action.type) {
    case types.CHANGE_INPUT_VALUE:
      return {
        ...state,
        inputValue: action.value,
      };
    case types.CHANGE_TODO_LIST_VALUE:
      return {
        ...state,
        items: action.value,
      };
    default:
      return state;
  }
};

// 导出reducer
export default reducer;
