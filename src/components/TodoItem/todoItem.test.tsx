import React from 'react';
import { shallow } from 'enzyme';

import TodoItem from './todoItem';
import jsonData from '../../mock/data.json';
import { todoLevel } from '../../pages/TodoList/variables';

// let wrapper: React.FC;
const type1 = 'active';
const type2 = 'inActive';
const isDragging1 = false;
const isDragging2 = true;
// 这里的值，不能改成 jest.fn() 否则渲染会出异常
const connectDragSource = (el: any) => el;
const item = {
  level0: jsonData.list.filter(o => o.level === 0)[0],
  level1: jsonData.list.filter(o => o.level === 1)[0],
  level2: jsonData.list.filter(o => o.level === 2)[0],
};

const actionProps0 = {
  type: type1,
  item: item.level0,
  isDragging: isDragging1,
  changeLevel: jest.fn(),
  connectDragSource: connectDragSource,
};
const actionProps01 = {
  ...actionProps0,
  isDragging: isDragging2,
};
const actionProps1 = {
  ...actionProps0,
  type: type2,
  item: item.level2,
};

describe('测试todo对象', () => {
  it('测试初始化: 显示', () => {
    const wrapper = shallow(<TodoItem {...actionProps0} />);
    expect(wrapper).toHaveClassName('.todo_item');
    expect(wrapper).toHaveClassName('todo_item_active');
    expect(wrapper).toHaveStyle('display', 'flex');

    const dom = wrapper.find('.todo_item_title');
    expect(dom).toExist();
    expect(dom).toHaveText(actionProps0.item.title);
  });
  it('测试异常的初始化: 不显示', () => {
    const wrapper = shallow(<TodoItem {...actionProps01} />);
    expect(wrapper).toHaveClassName('.todo_item');
    expect(wrapper).toHaveClassName('todo_item_active');
    expect(wrapper).toHaveStyle('display', 'none');
  });
  it('测试Icon上的click', () => {
    const wrapper = shallow(<TodoItem {...actionProps0} />);
    const Dropdown = wrapper.find('Dropdown');
    const submenu = shallow(<div>{Dropdown.prop('overlay')}</div>);
    const submenuItems = submenu.find('MenuItem');
    submenuItems.forEach((item, idx) => {
      // mock 点击事件
      item.simulate('click');
      // 处理枚举，将所有的值取出来，称为一个数组 [注意：这里不能有自定义的枚举值，否则取出来值的数量会不对]
      const list = Object.keys(todoLevel);
      // 取出前一半就是key
      const keys = list.slice(0, (list.length + 1) / 2);
      // 这里的索引和值是可以对应上的，所以直接根据索引就可以拿到枚举的值了
      const level = Number(keys[idx]);
      // 断言方法被调用
      expect(actionProps0.changeLevel).toBeCalledWith(actionProps0.item, level);
    });
  });

  it('测试 inactive 元素', () => {
    const wrapper = shallow(<TodoItem {...actionProps1} />);
    expect(wrapper).toHaveClassName('.todo_item_in_active');
    expect(wrapper).toHaveStyle('display', 'flex');

    // 测试点击，回调方法没有被执行
    const Dropdown = wrapper.find('Dropdown');
    const submenu = shallow(<div>{Dropdown.prop('overlay')}</div>);
    const item = submenu.find('MenuItem').at(0);
    item.simulate('click');
    expect(actionProps1.changeLevel).not.toBeCalled();
  });
});
