import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

import TodoItem from './todoItem';
import jsonData from '../../mock/data.json';

const item = {
  level0: jsonData.list.filter(o => o.level === 0)[0],
  level1: jsonData.list.filter(o => o.level === 1)[0],
  level2: jsonData.list.filter(o => o.level === 2)[0],
};
const column = {
  column0: jsonData.columns.find(o => o.id === 0) as IColumn,
  column1: jsonData.columns.find(o => o.id === 1) as IColumn,
  column2: jsonData.columns.find(o => o.id === 2) as IColumn,
};

const actionProps = {
  column: column.column0,
  item: item.level0,
  index: 0,
  changeLevel: jest.fn(),
};

// mock 之后就可以正常的测试单个组件了
jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }: any) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
      },
      {}
    ),
  Draggable: ({ children }: any) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
      },
      {}
    ),
  DragDropContext: ({ children }: any) => children,
}));

let wrapper: ReactWrapper;

beforeAll(() => {
  // 只能使用深度渲染
  wrapper = mount(<TodoItem {...actionProps} />);
});

describe('测试todo对象', () => {
  it('测试外部组件存在', () => {
    // 找出组件
    const todoItem = wrapper.find('TodoItem');
    // 断言组件存在
    expect(todoItem).toExist();

    // 存在一个拖拽对象
    const Draggable = todoItem.find('Draggable');
    // 通过直接找组件的方式，查询出来的对象，是可以判断props的
    expect(Draggable).toHaveProp({ index: 0 });
    expect(Draggable).toHaveProp({ draggableId: actionProps.item.id });

    // 找出组件的类
    const todo_item = Draggable.find('.todo_item');
    expect(todo_item).toExist();
    // ICON dom
    const todo_item_level = todo_item.find('.todo_item_level.todo_item_level_init');
    // antd icon DOM
    const AntdIcon = todo_item_level.find('AntdIcon');
    // 存在 cloud ICON
    const cloud = AntdIcon.find('.anticon.anticon-cloud');
    expect(cloud).toHaveLength(1);
    // 标题DOM
    const todo_item_title = todo_item.find('.todo_item_title');
    // 断言文案
    expect(todo_item_title).toHaveText('生个孩子');
  });

  it('测试Icon上的click', () => {
    const Dropdown = wrapper.find('Dropdown');
    const submenu = shallow(<div>{Dropdown.prop('overlay')}</div>);
    const submenuItems = submenu.find('MenuItem');

    submenuItems.forEach((item, idx) => {
      // mock 点击事件
      item.simulate('click');
      // 断言方法被调用, 因为没有第一列，所以只要取 idx + 1 即可
      expect(actionProps.changeLevel).toBeCalledWith(actionProps.column, actionProps.item, idx + 1);
    });
  });
});
