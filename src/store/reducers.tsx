import { combineReducers } from 'redux';
import { reducer as todoReducer } from '../pages/TodoList/store';

// 汇总所有的reduce
const reducers = combineReducers({
  todo: todoReducer,
});

export default reducers;
