import { combineReducers } from 'redux-immutable';
import { reducer as todoReducer } from '../pages/TodoList/store';

// 汇总所有的reduce
// 从 Redux-immutable 库中导出的 combineReducers 方法，可以创建一个immutable类型的state
// Redux-immutable 方式导出的数据，取值的时候，需要加上 keyPath
const reducers = combineReducers({
  todo: todoReducer, // keyPath 的值为 todo
});

export default reducers;
