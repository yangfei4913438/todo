import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import List from './list';
import jsonData from '../../mock/data.json';

let wrapper: ShallowWrapper;
const items = jsonData.list;
const columns = jsonData.columns;
const changeLevel = jest.fn();

beforeAll(() => {
  // 如果不是集成测试，需要测试组件之间的联动，就不需要使用 mount 来测。
  wrapper = shallow(<List items={items} columns={columns} changeLevel={changeLevel} />);
});

describe('测试列表组件', () => {
  it('测试组件存在外部类', () => {
    // 确认标签类型
    expect(wrapper).toHaveDisplayName('div');
    // 确认存在类名
    expect(wrapper).toHaveClassName('todo_list');
    // 取出所有的内部DOM
    const domList = wrapper.find('TodoColumn');
    // 确认数量
    expect(domList).toHaveLength(3);
  });

  it('测试内部组件', () => {
    // 取出所有的内部DOM
    const domList = wrapper.find('TodoColumn');

    // 测试第一个列
    const dom1 = domList.at(0);

    const list: ITodoItem[] = columns[0].taskIds.map(id => {
      return items.find(i => i.id === id) as ITodoItem;
    });

    // 测试第一个组件的传入参数
    expect(dom1).toHaveProp('column', columns[0]);
    expect(dom1).toHaveProp('list', list);
    expect(dom1).toHaveProp('changeLevel', changeLevel);
  });
});
