import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Loading from './loading';

let wrapper: ShallowWrapper;

beforeAll(() => {
  wrapper = shallow(<Loading />);
});

describe('测试 Loading 页面', () => {
  it('测试外部标签', () => {
    const dom = wrapper.find('.loading');
    // 检测是否存在
    expect(dom).toExist();
    // 检测 TAG 标签
    expect(dom).toHaveDisplayName('section');
    // 包含类 .sk-cube-grid
    expect(dom).toContainMatchingElement('.sk-cube-grid');
  });

  it('测试内部div', () => {
    // 检测是否存在子元素
    const div = wrapper.find('.sk-cube-grid');
    // 检测 TAG
    expect(div).toHaveDisplayName('article');
    // 包含子类
    expect(div).toContainMatchingElement('.sk-cube');
  });

  it('测试动画元素', () => {
    // 类数量判断
    const dom = wrapper.find('.sk-cube');
    expect(dom).toHaveLength(9);

    // 每个类都存在一个
    Array.from({ length: 9 }, (_, i) => {
      const row = wrapper.find(`.sk-cube${i + 1}`);
      expect(row).toHaveLength(1);
    });
  });
});
