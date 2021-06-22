import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { Provider } from 'react-redux';

import TodoList from './todoWrapper';

import store from '../../store';
import jsonData from '../../mock/data.json';
import axios from '../../http/http';

let wrapper: ReactWrapper;

// 这里必须使用封装过的库，否则一些自定义配置还需要重新搞一遍
jest.mock('../../http/http');
// 抽象出 axios 的 GET 方法。TS 只能这样写，否则没有办法获取扩展 mock 方法
const mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

beforeAll(() => {
  mockAxiosGet.mockImplementation((url: string) => {
    if (url === '/list' || url === '/api/v1/list') {
      return new Promise((resolve, reject) => {
        resolve({ data: jsonData.list });
      });
    } else if (url === '/columns' || url === '/api/v1/columns') {
      return new Promise((resolve, reject) => {
        resolve({ data: jsonData.columns });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve({ data: [] });
      });
    }
  });

  wrapper = mount(
    <Provider store={store}>
      <TodoList />
    </Provider>
  );

  // console.log(wrapper.debug());
});

afterAll(() => {
  jest.clearAllMocks();
  mockAxiosGet.mockClear();
});

describe('测试 TodoList 组件', () => {
  it('检测初始渲染状态', () => {
    // 外部请求回来的数据，需要重新渲染
    wrapper.update();

    // 检测输入内容
    const header = wrapper.find('Header');
    expect(header).toHaveProp({ value: '' });

    // 列表的传参
    const List = wrapper.find('List');
    expect(List).toHaveProp({ items: jsonData.list });
    expect(List).toHaveProp({ columns: jsonData.columns });
    // console.log(List.debug());

    // 断言有三个列表
    const todoColumns = List.find('TodoColumn');
    expect(todoColumns).toHaveLength(3);

    // 第一个列表
    const firstColumn = todoColumns.at(0).find('.todo_list_title');
    const firstColumnText = firstColumn.find('.todo_list_title_text');
    expect(firstColumnText).toHaveText('已规划的任务');
    const firstColumnIcon = firstColumn.find('.todo_list_title_icon');
    expect(firstColumnIcon).toHaveText('3');
    const firstTodoItems = todoColumns.at(0).find('TodoItem');
    expect(firstTodoItems).toHaveLength(3);
    // 第二个列表
    const secondColumn = todoColumns.at(1).find('.todo_list_title');
    const secondColumnText = secondColumn.find('.todo_list_title_text');
    expect(secondColumnText).toHaveText('执行中的任务');
    const secondColumnIcon = secondColumn.find('.todo_list_title_icon');
    expect(secondColumnIcon).toHaveText('2');
    const secondTodoItems = todoColumns.at(1).find('TodoItem');
    expect(secondTodoItems).toHaveLength(2);
    // 第三个列表
    const thirdColumn = todoColumns.at(2).find('.todo_list_title');
    const thirdColumnText = thirdColumn.find('.todo_list_title_text');
    expect(thirdColumnText).toHaveText('已完成的任务');
    const thirdColumnIcon = thirdColumn.find('.todo_list_title_icon');
    expect(thirdColumnIcon).toHaveText('2');
    const thirdTodoItems = todoColumns.at(2).find('TodoItem');
    expect(thirdTodoItems).toHaveLength(2);
  });
});
