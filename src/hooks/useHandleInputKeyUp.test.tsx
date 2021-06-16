import { KeyboardEvent } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useHandleInputKeyUp from './useHandleInputKeyUp';
import { AxiosPromise } from 'axios';

const userInput = 'hello world';
const postTodoItem = jest.fn();
const changeInputValue = jest.fn();
const initTodoList = jest.fn();
const messageError = jest.fn();
const consoleError = jest.fn();
const errorFunc = (item?: any) => {
  return new Promise((resolve, reject) => {
    throw new Error('出错了');
  }) as AxiosPromise;
};

const errorFunc2 = (args?: any) => {
  throw new Error('出错了');
};

describe('测试 useHandleInputKeyUp 自定义 Hook', () => {
  it('输入内容非空，且按下了回车', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(userInput, postTodoItem, changeInputValue, initTodoList, messageError, consoleError)
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(postTodoItem).toBeCalled();
    expect(changeInputValue).toBeCalledWith('');
    expect(initTodoList).toBeCalled();
  });

  it('value为空的情况', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp('', postTodoItem, changeInputValue, initTodoList, messageError, consoleError)
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(postTodoItem).not.toBeCalled();
    expect(changeInputValue).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });

  it('键盘事件不是回车（不等于13）', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(userInput, postTodoItem, changeInputValue, initTodoList, messageError, consoleError)
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(postTodoItem).not.toBeCalled();
    expect(changeInputValue).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });

  it('value为空的情况 且 键盘事件不是回车（不等于13）', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp('', postTodoItem, changeInputValue, initTodoList, messageError, consoleError)
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(postTodoItem).not.toBeCalled();
    expect(changeInputValue).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });

  it('报错的情况', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(userInput, errorFunc, errorFunc2, errorFunc, messageError, consoleError)
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    // 因为是异常报错，所以这里必须做一个错误捕获，否则代码执行就出错了
    await act(() => result.current(kbEvent as KeyboardEvent));

    // 异常处理，只要上面两个都是 await 即可
    expect(consoleError).toBeCalled();
    expect(messageError).toBeCalled();

    expect(postTodoItem).not.toBeCalled();
    expect(changeInputValue).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });

  it('报错的情况2', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(userInput, errorFunc, errorFunc2, errorFunc2, messageError, consoleError)
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(consoleError).not.toBeCalled();
    expect(messageError).not.toBeCalled();
    expect(postTodoItem).not.toBeCalled();
    expect(changeInputValue).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });
});
