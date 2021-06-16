import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import TodoItems from './todoItems';

let wrapper: ShallowWrapper;

import jsonData from '../../mock/data.json';

const itemType = {
  active: 'active',
  inActive: 'inActive',
};
const items = {
  level0: jsonData.list.filter(o => o.level === 0),
  level1: jsonData.list.filter(o => o.level === 1),
  level2: jsonData.list.filter(o => o.level === 2),
};
// 这里的值，不能改成 jest.fn() 否则渲染会出异常
const connectDropTarget = (el: any) => el;

const activeProps = {
  type: itemType.active,
  list: items.level0,
  canDrop: true,
  isOver: false,
  changeLevel: jest.fn(),
  moveItem: jest.fn(),
  connectDropTarget: connectDropTarget,
};

const inActiveProps = {
  ...activeProps,
  type: itemType.inActive,
};

const init = (type: string) => {
  const props = type === itemType.active ? activeProps : inActiveProps;
  return shallow(<TodoItems {...props} />);
};

describe('测试todo列表', () => {
  it('测试 active 类型: 最外层', () => {
    wrapper = init(itemType.active);

    expect(wrapper).toHaveClassName('todo_list_active');
  });

  it('测试 active 类型: 标题内容', () => {
    wrapper = init(itemType.active);

    const titleWrapper = wrapper.find('.todo_list_title');
    expect(titleWrapper).toHaveLength(1);

    const text = titleWrapper.find('.todo_list_title_text');
    expect(text).toHaveText('进行中');

    const num = titleWrapper.find('.todo_list_title_icon_start');
    expect(num).toHaveText('3');
  });

  it('测试 active 类型: 列表内容', () => {
    wrapper = init(itemType.active);

    const itemsWrapper = wrapper.find('.todo_list_content');
    expect(itemsWrapper).toHaveLength(1);

    const items = itemsWrapper.find('DragSource(TodoItem)');
    expect(items).toHaveLength(3);

    const item = items.at(0);
    expect(item).toHaveProp('type', activeProps.type);
    expect(item).toHaveProp('item', activeProps.list[0]);
    expect(item).toHaveProp('changeLevel', activeProps.changeLevel);
  });

  it('测试 inActive 类型: 最外层', () => {
    wrapper = init(itemType.inActive);

    expect(wrapper).toHaveClassName('todo_list_in_active');
  });

  it('测试 inActive 类型: 标题', () => {
    wrapper = init(itemType.inActive);

    const titleWrapper = wrapper.find('.todo_list_title');
    expect(titleWrapper).toExist();

    const title = titleWrapper.find('.todo_list_title_text');
    expect(title).toHaveText('已完成');

    const num = titleWrapper.find('.todo_list_title_icon_end');
    expect(num).toHaveText('3');
  });

  it('测试 inActive 类型: 列表内容', () => {
    wrapper = init(itemType.inActive);

    const itemsWrapper = wrapper.find('.todo_list_content');
    expect(itemsWrapper).toHaveLength(1);

    const items = itemsWrapper.find('DragSource(TodoItem)');
    expect(items).toHaveLength(3);

    const item = items.at(0);
    expect(item).toHaveProp('type', inActiveProps.type);
    expect(item).toHaveProp('item', inActiveProps.list[0]);
    expect(item).toHaveProp('changeLevel', inActiveProps.changeLevel);
  });
});
