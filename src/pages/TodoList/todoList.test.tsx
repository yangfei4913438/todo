import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import TodoList from './todoWrapper';

import { Provider } from 'react-redux';
import store from '../../store';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

let wrapper: ReactWrapper;

beforeAll(() => {
  wrapper = mount(
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <TodoList />
      </Provider>
    </DndProvider>
  );
});

describe('测试 TodoList 组件', () => {
  it('检测初始渲染状态', () => {
    // 外部请求回来的数据，需要重新渲染
    wrapper.update();

    // 检测输入内容
    const inputElem = wrapper.find('.header_input');
    expect(inputElem).toHaveValue('');

    // 检测未完成列表
    const activeList = wrapper.find('.todo_list_active');
    const activeTodoItem = activeList.find('TodoItem');
    // 断言有5个初始数据
    expect(activeTodoItem).toHaveLength(5);
    // 检测数量显示
    const activeNum = activeList.find('.todo_list_title_icon_start');
    expect(activeNum).toHaveText('5');

    // 检测已完成列表
    const inActiveList = wrapper.find('.todo_list_in_active');
    const inActiveTodoItem = inActiveList.find('TodoItem');
    // 断言没有子对象
    expect(inActiveTodoItem).toHaveLength(2);
    // 检测数量显示
    const inActiveNum = inActiveList.find('.todo_list_title_icon_end');
    expect(inActiveNum).toHaveText('2');
  });
});
