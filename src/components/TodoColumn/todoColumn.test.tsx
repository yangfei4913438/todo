import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import TodoColumn from './todoColumn';
import jsonData from '../../mock/data.json';

const items = jsonData.list;
const column = jsonData.columns[0];
const list: ITodoItem[] = column.taskIds.map(id => {
  return items.find(i => i.id === id) as ITodoItem;
});

const Props = {
  column,
  list,
  changeLevel: jest.fn(),
};

let wrapper: ShallowWrapper;
beforeAll(() => {
  wrapper = shallow(<TodoColumn {...Props} />);
});

describe('测试todo列表', () => {
  it('测试最外层', () => {
    // 断言标签
    expect(wrapper).toHaveDisplayName('div');
    // 断言类名
    expect(wrapper).toHaveClassName('todo_list_column');
  });

  it('测试标题内容', () => {
    const titleWrapper = wrapper.find('.todo_list_title');
    expect(titleWrapper).toHaveLength(1);

    const text = titleWrapper.find('.todo_list_title_text');
    expect(text).toHaveText('已规划的任务');

    const num = titleWrapper.find('.todo_list_title_icon');
    expect(num).toHaveText('3');
  });

  it('存在一个放置对象', () => {
    const dropWrapper = wrapper.find('Connect(Droppable)');
    expect(dropWrapper).toHaveLength(1);
  });
});
