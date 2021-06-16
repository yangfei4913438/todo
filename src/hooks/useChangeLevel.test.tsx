import { renderHook, act } from '@testing-library/react-hooks';

import useChangeLevel from './useChangeLevel';
import { AxiosPromise } from 'axios';

const patchTodoItem = jest.fn();
const initTodoList = jest.fn();
const messageError = jest.fn();
const consoleError = jest.fn();
const errorFunc = (item?: any) =>
  new Promise((resolve, reject) => {
    reject('出错了');
  }) as AxiosPromise;
const errorFunc2 = (args?: any) => {
  throw new Error('出错了');
};
const item = {
  id: 'jsYX72krD',
  title: '生个孩子',
  level: 0,
  time: 1622942592814,
};

describe('测试 useChangeLevel 自定义 Hook', () => {
  it('正常处理', async () => {
    const { result } = await renderHook(() => useChangeLevel(initTodoList, patchTodoItem, messageError, consoleError));

    await act(() => result.current(item, 0));

    expect(patchTodoItem).toBeCalledWith(item.id, 'level', 0);
    expect(initTodoList).toBeCalled();
  });

  it('异常处理', async () => {
    const { result } = await renderHook(() => useChangeLevel(errorFunc2, errorFunc, messageError, consoleError));

    await act(() => result.current(item, 0));

    expect(consoleError).toBeCalled();
    expect(messageError).toBeCalled();

    expect(patchTodoItem).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });
});
