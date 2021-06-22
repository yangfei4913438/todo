import { KeyboardEvent } from 'react';
import shortid from 'shortid';
import { renderHook, act } from '@testing-library/react-hooks';
import useHandleInputKeyUp from './useHandleInputKeyUp';
import { AxiosPromise } from 'axios';
import { todoLevel, todoLevelType } from '../pages/TodoList/variables';

const newId = shortid.generate();
const newTime = new Date().getTime();
const userInput = 'hello world';
const column = {
  id: 0,
  type: 'init',
  title: '已规划的任务',
  taskIds: ['jsYX72krD', 'Kk9w2ZuTF', 'yoWGZqX6k'],
};
const columns = [column];
const postTodoItem = jest.fn();
const patchTodoColumn = jest.fn();
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
      useHandleInputKeyUp(
        newId,
        newTime,
        userInput,
        columns,
        postTodoItem,
        patchTodoColumn,
        changeInputValue,
        initTodoList,
        messageError,
        consoleError
      )
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).toBeCalledWith('');

    expect(postTodoItem).toBeCalledWith({
      id: newId,
      title: userInput,
      level: todoLevel.init,
      time: newTime,
    });

    // 在初始列表添加一个新的对象
    const targetColumn: IColumn = columns.find(o => o.type === todoLevelType.init) as IColumn;
    // 获取计划列中的ID数组
    const ids = Array.from(targetColumn.taskIds);
    // 在数组头部插入新的ID
    ids.unshift(newId);
    expect(patchTodoColumn).toBeCalledWith(targetColumn.id, ids);

    expect(initTodoList).toBeCalled();
  });

  it('value为空的情况', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(
        newId,
        newTime,
        '',
        columns,
        postTodoItem,
        patchTodoColumn,
        changeInputValue,
        initTodoList,
        messageError,
        consoleError
      )
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).not.toBeCalled();
    expect(postTodoItem).not.toBeCalled();
    expect(patchTodoColumn).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });

  it('键盘事件不是回车（不等于13）', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(
        newId,
        newTime,
        userInput,
        columns,
        postTodoItem,
        patchTodoColumn,
        changeInputValue,
        initTodoList,
        messageError,
        consoleError
      )
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).not.toBeCalled();
    expect(postTodoItem).not.toBeCalled();
    expect(patchTodoColumn).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });

  it('value为空的情况 且 键盘事件不是回车（不等于13）', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(
        newId,
        newTime,
        '',
        columns,
        postTodoItem,
        patchTodoColumn,
        changeInputValue,
        initTodoList,
        messageError,
        consoleError
      )
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).not.toBeCalled();
    expect(postTodoItem).not.toBeCalled();
    expect(patchTodoColumn).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
  });

  it('报错的情况', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(
        newId,
        newTime,
        userInput,
        columns,
        errorFunc,
        errorFunc,
        errorFunc2,
        errorFunc,
        messageError,
        consoleError
      )
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    // 因为是异常报错，所以这里必须做一个错误捕获，否则代码执行就出错了
    await act(() => result.current(kbEvent as KeyboardEvent));

    // 异常处理，只要上面两个都是 await 即可
    expect(consoleError).toBeCalled();
    expect(messageError).toBeCalled();
  });

  it('报错的情况2', async () => {
    const { result } = await renderHook(() =>
      useHandleInputKeyUp(
        newId,
        newTime,
        userInput,
        columns,
        errorFunc,
        errorFunc,
        errorFunc2,
        errorFunc,
        messageError,
        consoleError
      )
    );

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(consoleError).not.toBeCalled();
    expect(messageError).not.toBeCalled();
  });
});
