import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { fromJS, Record } from 'immutable';

import types from './types';
import * as Index from './index';
import reducer from './reducer';
import actions from './actions';

import jsonData from '../../../mock/data.json';

const middlewares = [thunk];
// 这里一定要用泛型的写法，否则后面的 dispatch 操作，传参会报错。
const mockStore = configureMockStore<any, ThunkDispatch<{}, any, AnyAction>>(middlewares);
// mock 一个 store
const store = mockStore();

describe('测试store', () => {
  afterEach(() => {
    jest.clearAllMocks();
    store.clearActions();
  });

  it('测试 index 导出内容', () => {
    expect(Index.actions).toEqual(actions);
    expect(Index.reducer).toEqual(reducer);
    expect(Object.keys(Index).length).toBe(2);
  });

  it('测试 types 的值', () => {
    expect(types.CHANGE_INPUT_VALUE).toBe('CHANGE_INPUT_VALUE');
    expect(types.CHANGE_TODO_LIST_VALUE).toBe('CHANGE_TODO_LIST_VALUE');
    expect(types.CHANGE_COLUMNS_VALUE).toBe('CHANGE_COLUMNS_VALUE');
    expect(types.INIT_SYSTEM_DATA).toBe('INIT_SYSTEM_DATA');
  });

  it('测试 actions: changeInputValue', () => {
    const value: string = 'hello world';
    const expectedAction = {
      type: types.CHANGE_INPUT_VALUE,
      value,
    };
    expect(actions.changeInputValue(value)).toEqual(expectedAction);
  });

  it('测试 actions: changeTodoList', () => {
    const value: ITodoItem[] = [];
    const expectedAction = {
      type: types.CHANGE_TODO_LIST_VALUE,
      value,
    };
    expect(actions.changeTodoList(value)).toEqual(expectedAction);
  });

  it('测试 actions: changeColumns', () => {
    const value: IColumn[] = [];
    const expectedAction = {
      type: types.CHANGE_COLUMNS_VALUE,
      value,
    };
    expect(actions.changeColumns(value)).toEqual(expectedAction);
  });

  it('测试 actions: initTodoList', async () => {
    // 调用请求进行测试。必须使用 return 的方式处理。
    await store.dispatch(actions.initTodoList());
    const expectedActions = {
      type: types.INIT_SYSTEM_DATA,
      value: {
        items: jsonData.list,
        columns: jsonData.columns,
      },
    };
    // 这里没到数据，只有 action
    expect(store.getActions()).toEqual([expectedActions]);
  });

  it('测试reducer: CHANGE_INPUT_VALUE', () => {
    const inputValue = 'hello';
    expect(reducer(undefined, { type: types.CHANGE_INPUT_VALUE, value: inputValue })).toEqual(
      fromJS({
        inputValue,
        items: [],
        columns: [],
      })
    );
  });

  it('测试reducer: CHANGE_TODO_LIST_VALUE', () => {
    // 因为 reducer 返回的是 immutable 对象，所以外部数据要进行处理
    const items: Record<IState> = fromJS(jsonData.list);
    const data: Record<IState> = fromJS({
      inputValue: '',
      items,
      columns: [],
    });
    expect(reducer(undefined, { type: types.CHANGE_TODO_LIST_VALUE, value: items })).toEqual(data);
  });

  it('测试reducer: CHANGE_COLUMNS_VALUE', () => {
    // 因为 reducer 返回的是 immutable 对象，所以外部数据要进行处理
    const columns: Record<IColumn> = fromJS(jsonData.columns);
    const data: Record<IState> = fromJS({
      inputValue: '',
      items: [],
      columns,
    });
    expect(reducer(undefined, { type: types.CHANGE_COLUMNS_VALUE, value: columns })).toEqual(data);
  });

  it('测试reducer: INIT_SYSTEM_DATA', () => {
    // 因为 reducer 返回的是 immutable 对象，所以外部数据要进行处理
    const columns: Record<IColumn> = fromJS(jsonData.columns);
    const items: Record<IState> = fromJS(jsonData.list);
    const data: Record<IState> = fromJS({
      inputValue: '',
      items,
      columns,
    });
    const value = {
      items,
      columns,
    };
    expect(reducer(undefined, { type: types.INIT_SYSTEM_DATA, value })).toEqual(data);
  });

  it('测试reducer: 未知类型', () => {
    // 无效的 action 类型，返回的state, 就是初始的state
    expect(reducer(undefined, { type: '', value: '' })).toEqual(
      fromJS({
        inputValue: '',
        items: [],
        columns: [],
      })
    );
  });
});
