import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Header from './header';

let wrapper: ShallowWrapper;
// 定义输入框的DOM变量
let inputElem: ShallowWrapper;

const headerProps = {
  value: '',
  changeInputValue: jest.fn(),
  handleInputKeyUp: jest.fn(),
};

beforeAll(() => {
  wrapper = shallow(<Header {...headerProps} />);
});

beforeEach(() => {
  // 通过属性选择器来定位对象，不要使用类名，避免类名被修改导致的测试用例失效。
  inputElem = wrapper.find('.header_input');
});

describe('测试头部组件', () => {
  it('组件包含一个输入框', () => {
    expect(inputElem).toExist();
  });

  test('inout 框, 初始化应该为空', () => {
    // 断言dom存在属性value, 值为空字符串
    // 如果用户不进行任何操作，此时应该是初始状态。
    expect(inputElem).toHaveProp('value', headerProps.value);
  });

  test('inout 框, 当用户输入时，会调用外部方法', () => {
    const userInput = '今天开始学习jest';
    // 模拟用户输入, 第一个参数是事件类型，第二个参数是event
    inputElem.simulate('change', {
      target: {
        value: userInput,
      },
    });
    expect(headerProps.changeInputValue).toBeCalledWith(userInput);
  });

  test('inout 框, 当用户输入回车时，会调用外部方法', () => {
    // 模拟用户输入, 第一个参数是事件类型，第二个参数是event(只要写关键的即可，不用全部写出来)
    inputElem.simulate('keyup', {
      keyCode: 13,
    });
    // 注意：所有的子组件方法，都要写在父组件中，如果子组件自己封装一个方法，那么这里测试就会很难写。
    // 因为没有办法，测试外部的方法到底有没有被调用。因为模拟回车后调用的是子组件自己的方法，方法中被调用的父组件，这里检测不到。
    expect(headerProps.handleInputKeyUp).toBeCalledWith({
      keyCode: 13,
    });
  });
});
