import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { fromJS, Record } from 'immutable';

import types from './types';
import * as Index from './index';
import reducer from './reducer';
import actions from './actions';
import axios from '../../../http/http';

import jsonData from '../../../mock/data.json';

const middlewares = [thunk];
// 这里一定要用泛型的写法，否则后面的 dispatch 操作，传参会报错。
const mockStore = configureMockStore<any, ThunkDispatch<{}, any, AnyAction>>(middlewares);
// mock 一个 store
const store = mockStore();

// 这里必须使用封装过的库，否则一些自定义配置还需要重新搞一遍
jest.mock('../../../http/http');
// 抽象出 axios 的 GET 方法。TS 只能这样写，否则没有办法获取扩展 mock 方法
const mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe('测试store', () => {
  // 定义请求会生成的 action 对象
  const expectedActions = {
    type: types.CHANGE_TODO_LIST_VALUE,
    value: jsonData.list,
  };
  const expectedActionsNull = {
    type: types.CHANGE_TODO_LIST_VALUE,
    value: [],
  };
  const expectedActions2 = {
    type: types.CHANGE_COLUMNS_VALUE,
    value: jsonData.columns,
  };
  const expectedActions2Null = {
    type: types.CHANGE_COLUMNS_VALUE,
    value: [],
  };

  afterEach(() => {
    mockAxiosGet.mockRestore();
    mockAxiosGet.mockReset();
    mockAxiosGet.mockClear();
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    store.clearActions();
  });

  it('测试 index 导出内容', () => {
    expect(Index.actions).toEqual(actions);
    expect(Index.reducer).toEqual(reducer);
    expect(Object.keys(Index).length).toBe(2);
  });

  it('测试 types', () => {
    expect(types.CHANGE_INPUT_VALUE).toBe('CHANGE_INPUT_VALUE');
    expect(types.CHANGE_TODO_LIST_VALUE).toBe('CHANGE_TODO_LIST_VALUE');
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

  it('测试初始化获取数据，成功1：返回正常数据', async () => {
    // mock 正常返回数据
    mockAxiosGet.mockResolvedValueOnce({
      data: jsonData.list,
    });
    mockAxiosGet.mockResolvedValueOnce({
      data: jsonData.columns,
    });
    // 调用请求进行测试。必须使用 return 的方式处理。
    await store.dispatch(actions.initTodoList());
    // 这里没到数据，只有 action
    expect(store.getActions()).toEqual([expectedActions, expectedActions2]);
  });

  it('测试初始化获取数据，成功2: 返回空值', async () => {
    // mock 返回正常，但是没有 data. 多次请求不要加上once
    mockAxiosGet.mockResolvedValueOnce({
      data: [],
    });
    mockAxiosGet.mockResolvedValueOnce({
      data: [],
    });
    // 调用请求进行测试。必须使用 return 的方式处理。
    await store.dispatch(actions.initTodoList());
    // 这里没到数据，只有 action
    expect(store.getActions()).toEqual([expectedActionsNull, expectedActions2Null]);
  });

  it('测试初始化获取数据，失败: 执行出错', async () => {
    // mock 返回异常
    mockAxiosGet.mockRejectedValue({});
    // 调用请求进行测试。必须使用 return 的方式处理。
    await store.dispatch(actions.initTodoList());
    // 如果失败，这里是空值
    expect(store.getActions()).toEqual([]);
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
