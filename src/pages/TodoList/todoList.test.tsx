import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import TodoList from './todoWrapper';

import store from '../../store';
import jsonData from '../../mock/data.json';

let wrapper: ReactWrapper;
let root: HTMLElement;
beforeAll(() => {
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  wrapper = mount(
    <Provider store={store}>
      <TodoList />
    </Provider>,
    { attachTo: root }
  );
});
afterAll(() => {
  document.body.removeChild(root);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('测试 TodoList 组件', () => {
  it('检测初始渲染状态', () => {
    // 异步请求回来的数据，需要重新渲染
    // wrapper.update();

    // 检测输入内容
    const header = wrapper.find('Header');
    expect(header).toHaveProp({ value: '' });

    // 列表的传参
    const List = wrapper.find('List');
    expect(List).toHaveProp({ items: jsonData.list });
    expect(List).toHaveProp({ columns: jsonData.columns });

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

  it('集成测试: 用户输入后，已规划任务中出现新增的任务', () => {
    // 拿到输入框
    const inputElem = wrapper.find('.header_input');
    // 定义用户输入的内容
    const userInput = '你知道个锤子';
    // 模拟输入
    inputElem.simulate('change', {
      target: {
        value: userInput,
      },
    });
    // 模拟回车
    inputElem.simulate('keyup', {
      keyCode: 13,
    });
    // 找出所有的todo标题
    const dom = wrapper.find('.todo_item_title');
    // 断言第一个就是新增的数据
    expect(dom.at(0)).toHaveText(userInput);
  });
});
