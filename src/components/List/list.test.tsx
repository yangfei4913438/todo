import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import List from './list';
import jsonData from '../../mock/data.json';

let wrapper: ShallowWrapper;
const actives = jsonData.list.filter(o => o.level !== 2);
const inActives = jsonData.list.filter(o => o.level === 2);
const changeLevel = jest.fn();
const moveItem = jest.fn();

beforeAll(() => {
  // 如果不是集成测试，需要测试组件之间的联动，就不需要使用 mount 来测。
  wrapper = shallow(<List actives={actives} inActives={inActives} changeLevel={changeLevel} moveItem={moveItem} />);
});

describe('测试列表组件', () => {
  it('测试组件存在外部类', () => {
    // 确认标签类型
    expect(wrapper).toHaveDisplayName('div');
    // 确认存在类名
    expect(wrapper).toHaveClassName('todo_list');
    // 确认存在内部高阶组件
    expect(wrapper).toContainMatchingElement('DropTarget(TodoItems)');
  });

  it('测试内部组件', () => {
    // 取出所有的内部DOM
    const domList = wrapper.find('DropTarget(TodoItems)');
    // 确认数量
    expect(domList).toHaveLength(2);
    // 拆分列表
    const dom1 = domList.at(0);
    const dom2 = domList.at(1);
    // 测试第一个组件的传入参数
    expect(dom1).toHaveProp('type', 'active');
    expect(dom1).toHaveProp('list', actives);
    expect(dom1).toHaveProp('changeLevel', changeLevel);
    expect(dom1).toHaveProp('moveItem', moveItem);
    // 测试第二个组件的传入参数
    expect(dom2).toHaveProp('type', 'inActive');
    expect(dom2).toHaveProp('list', inActives);
    expect(dom2).toHaveProp('changeLevel', changeLevel);
    expect(dom2).toHaveProp('moveItem', moveItem);
  });
});
