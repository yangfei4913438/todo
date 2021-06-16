import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import NotFound from './notFound';

let wrapper: ShallowWrapper;

beforeAll(() => {
  wrapper = shallow(<NotFound />);
});

describe('测试 404 页面', () => {
  it('测试外部标签', () => {
    const dom = wrapper.find('.not_found');
    // 检测是否存在
    expect(dom).toExist();
    // 检测 TAG 标签
    expect(dom).toHaveDisplayName('article');
    // 包含类 .not_found_content
    expect(dom).toContainMatchingElement('.not_found_content');
  });

  it('测试内部div', () => {
    // 检测是否存在子元素
    const div = wrapper.find('.not_found_content');
    expect(div).toHaveDisplayName('div');
    expect(div).toHaveText('怎么肥事？我的页面呢？');
  });
});
