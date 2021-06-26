import { KeyboardEvent } from 'react';
import shortid from 'shortid';
import { renderHook, act } from '@testing-library/react-hooks';
import useHandleInputKeyUp from './useHandleInputKeyUp';
import { todoLevel, todoLevelType } from '../pages/TodoList/variables';
import jsonData from '../mock/data.json';
import { cloneDeep } from 'lodash';

const changeInputValue = jest.fn();
const changeColumns = jest.fn();
const changeTodoList = jest.fn();
const messageError = jest.fn();
const consoleError = jest.fn();
const errorFunc = (item?: any) => {
  throw new Error('出错了!');
};

const newId = shortid.generate();
const newTime = new Date().getTime();
let userInput = 'hello world';
let columns = cloneDeep(jsonData.columns);
let items = cloneDeep(jsonData.list);

const init = async () => {
  const { result } = await renderHook(() =>
    useHandleInputKeyUp(
      newId,
      newTime,
      userInput,
      columns,
      items,
      changeInputValue,
      changeColumns,
      changeTodoList,
      messageError,
      consoleError
    )
  );
  return result;
};

const initErr = async () => {
  const { result } = await renderHook(() =>
    useHandleInputKeyUp(
      newId,
      newTime,
      userInput,
      columns,
      items,
      errorFunc,
      errorFunc,
      errorFunc,
      messageError,
      consoleError
    )
  );
  return result;
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.clearAllMocks();
  // 重置一下，默认是有值的
  userInput = 'hello world';
  columns = cloneDeep(jsonData.columns);
  items = cloneDeep(jsonData.list);
});

describe('测试 useHandleInputKeyUp 自定义 Hook', () => {
  it('输入内容非空，且按下了回车', async () => {
    const result = await init();

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).toBeCalledWith('');

    expect(changeTodoList).toBeCalledWith([
      ...items,
      {
        id: newId,
        title: userInput,
        level: todoLevel.init,
        time: newTime,
      },
    ]);

    // 修改 计划列 中的ID数组
    const newColumns: IColumn[] = columns.map(column => {
      if (column.type === todoLevelType.init) {
        // 插入新的数据
        column.taskIds.unshift(newId);
        return {
          ...column,
          taskIds: column.taskIds,
        };
      }
      return column;
    });
    expect(changeColumns).toBeCalledWith(newColumns);

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('value为空的情况', async () => {
    userInput = '';
    const result = await init();

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 13,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).not.toBeCalled();
    expect(changeColumns).not.toBeCalled();
    expect(changeTodoList).not.toBeCalled();

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('键盘事件不是回车（不等于13）', async () => {
    const result = await init();

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).not.toBeCalled();
    expect(changeColumns).not.toBeCalled();
    expect(changeTodoList).not.toBeCalled();

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('value为空的情况 且 键盘事件不是回车（不等于13）', async () => {
    userInput = '';
    const result = await init();

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(changeInputValue).not.toBeCalled();
    expect(changeColumns).not.toBeCalled();
    expect(changeTodoList).not.toBeCalled();

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('报错的情况', async () => {
    const result = await initErr();

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
    const result = await initErr();

    const kbEvent: Partial<KeyboardEvent> = {
      keyCode: 14,
    };

    await act(() => result.current(kbEvent as KeyboardEvent));

    expect(consoleError).not.toBeCalled();
    expect(messageError).not.toBeCalled();
  });
});
