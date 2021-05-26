import types from './types';

// 定义初始值
const initialState = {
  inputValue: '',
};

// 定义reducer
const reducer = (state = initialState, action: { type: string; value: string }) => {
  switch (action.type) {
    case types.CHANGE_INPUT_VALUE:
      return { inputValue: action.value };
    default:
      return state;
  }
};

// 导出reducer
export default reducer;
