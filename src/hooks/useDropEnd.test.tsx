import { renderHook, act } from '@testing-library/react-hooks';
import { AxiosPromise } from 'axios';
import { DropResult } from 'react-beautiful-dnd';
import useDropEnd from './useDropEnd';
import jsonData from '../mock/data.json';
import { todoLevelType } from '../pages/TodoList/variables';

const changeColumns = jest.fn();
const changeTodoList = jest.fn();
const patchTodoItem = jest.fn();
const patchTodoColumn = jest.fn();
const initTodoList = jest.fn();
const messageError = jest.fn();
const consoleError = jest.fn();
const errorFunc = (item?: any) =>
  new Promise((resolve, reject) => {
    reject('出错了');
  }) as AxiosPromise;

const items = [
  {
    id: 'jsYX72krD',
    title: '生个孩子',
    level: 0,
    time: 1622942592814,
  },
  {
    id: 'Kk9w2ZuTF',
    title: '功成名就',
    level: 0,
    time: 1622942517578,
  },
  {
    id: 'yoWGZqX6k',
    title: '人生巅峰',
    level: 0,
    time: 1624034429002,
  },
];
const columns = jsonData.columns;

const args = {
  destination: {
    droppableId: 'init',
    index: 0,
  },
  source: {
    droppableId: 'init',
    index: 1,
  },
  draggableId: columns.find(column => column.type === todoLevelType.init)!.taskIds[1],
};

describe('测试拖拽响应Hook', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const init = async () => {
    const { result } = await renderHook(() =>
      useDropEnd(
        columns,
        changeColumns,
        patchTodoColumn,
        items,
        changeTodoList,
        patchTodoItem,
        initTodoList,
        messageError,
        consoleError
      )
    );
    return result;
  };

  it('测试目标对象没有值', async () => {
    const result = await init();

    const arg1 = {
      ...args,
      destination: undefined,
    };

    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).not.toBeCalled();
    expect(patchTodoColumn).not.toBeCalled();
    expect(changeTodoList).not.toBeCalled();
    expect(patchTodoItem).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试目标对象和源对象一致', async () => {
    const result = await init();

    const arg1 = {
      ...args,
      destination: args.source,
    };

    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).not.toBeCalled();
    expect(patchTodoColumn).not.toBeCalled();
    expect(changeTodoList).not.toBeCalled();
    expect(patchTodoItem).not.toBeCalled();
    expect(initTodoList).not.toBeCalled();
    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试同一个列', async () => {
    const result = await init();

    await act(() => result.current(args as DropResult));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['Kk9w2ZuTF', 'jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(patchTodoColumn).toBeCalledWith(0, ['Kk9w2ZuTF', 'jsYX72krD', 'yoWGZqX6k']);
    expect(initTodoList).toBeCalled();

    expect(changeTodoList).not.toBeCalled();
    expect(patchTodoItem).not.toBeCalled();

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试不是同一个列', async () => {
    const result = await init();

    const arg1 = {
      ...args,
      source: {
        droppableId: 'done',
        index: 1,
      },
      draggableId: columns.find(column => column.type === todoLevelType.done)!.taskIds[1],
    };

    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['Yg4R_bjc4', 'Kk9w2ZuTF', 'jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg'], title: '已完成的任务', type: 'done' },
    ]);
    expect(patchTodoColumn).toHaveBeenNthCalledWith(1, 2, ['r2sxR9jKg']);
    expect(patchTodoColumn).toHaveBeenNthCalledWith(2, 0, ['Yg4R_bjc4', 'Kk9w2ZuTF', 'jsYX72krD', 'yoWGZqX6k']);
    expect(initTodoList).toBeCalled();

    expect(changeTodoList).toBeCalledWith([
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
    expect(patchTodoItem).toBeCalledWith('Yg4R_bjc4', 'level', 0);

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试异常, 相同列', async () => {
    const { result } = await renderHook(() =>
      useDropEnd(
        columns,
        changeColumns,
        errorFunc,
        items,
        changeTodoList,
        errorFunc,
        errorFunc,
        messageError,
        consoleError
      )
    );

    await act(() => result.current(args as DropResult));

    expect(messageError).toBeCalled();
    expect(consoleError).toBeCalled();
    expect(changeColumns).toHaveBeenNthCalledWith(1, [
      { id: 0, taskIds: ['Kk9w2ZuTF', 'Yg4R_bjc4', 'jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeColumns).toHaveBeenNthCalledWith(2, [
      { id: 0, taskIds: ['Yg4R_bjc4', 'Kk9w2ZuTF', 'jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).toBeCalledWith([
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
  });

  it('测试异常, 不同列', async () => {
    const { result } = await renderHook(() =>
      useDropEnd(
        columns,
        changeColumns,
        errorFunc,
        items,
        changeTodoList,
        errorFunc,
        errorFunc,
        messageError,
        consoleError
      )
    );

    const arg1 = {
      ...args,
      source: {
        droppableId: 'done',
        index: 1,
      },
      draggableId: columns.find(column => column.type === todoLevelType.done)!.taskIds[1],
    };

    await act(() => result.current(arg1 as DropResult));

    expect(messageError).toBeCalled();
    expect(consoleError).toBeCalled();
    expect(changeColumns).toHaveBeenNthCalledWith(1, [
      {
        id: 0,
        taskIds: ['Yg4R_bjc4', 'Kk9w2ZuTF', 'Yg4R_bjc4', 'jsYX72krD', 'yoWGZqX6k'],
        title: '已规划的任务',
        type: 'init',
      },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeColumns).toHaveBeenNthCalledWith(2, [
      { id: 0, taskIds: ['Kk9w2ZuTF', 'Yg4R_bjc4', 'jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).toHaveBeenNthCalledWith(1, [
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
    expect(changeTodoList).toHaveBeenNthCalledWith(2, [
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
  });

  it('测试异常, 不同列, target progress', async () => {
    const { result } = await renderHook(() =>
      useDropEnd(
        columns,
        changeColumns,
        errorFunc,
        items,
        changeTodoList,
        errorFunc,
        errorFunc,
        messageError,
        consoleError
      )
    );

    const arg1 = {
      ...args,
      destination: {
        droppableId: 'progress',
        index: 1,
      },
    };

    await act(() => result.current(arg1 as DropResult));

    expect(messageError).toBeCalled();
    expect(consoleError).toBeCalled();
    expect(changeColumns).toHaveBeenNthCalledWith(1, [
      {
        id: 0,
        taskIds: ['Yg4R_bjc4', 'Yg4R_bjc4', 'jsYX72krD', 'yoWGZqX6k'],
        title: '已规划的任务',
        type: 'init',
      },
      { id: 1, taskIds: ['mJwzfBnyx', 'Kk9w2ZuTF', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeColumns).toHaveBeenNthCalledWith(2, [
      {
        id: 0,
        taskIds: ['Yg4R_bjc4', 'Kk9w2ZuTF', 'Yg4R_bjc4', 'jsYX72krD', 'yoWGZqX6k'],
        title: '已规划的任务',
        type: 'init',
      },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).toHaveBeenNthCalledWith(1, [
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 1, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
    expect(changeTodoList).toHaveBeenNthCalledWith(2, [
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
  });

  it('测试异常, 不同列, target done', async () => {
    const { result } = await renderHook(() =>
      useDropEnd(
        columns,
        changeColumns,
        errorFunc,
        items,
        changeTodoList,
        errorFunc,
        errorFunc,
        messageError,
        consoleError
      )
    );

    const arg1 = {
      ...args,
      destination: {
        droppableId: 'done',
        index: 1,
      },
    };

    await act(() => result.current(arg1 as DropResult));

    expect(messageError).toBeCalled();
    expect(consoleError).toBeCalled();
    expect(changeColumns).toHaveBeenNthCalledWith(1, [
      {
        id: 0,
        taskIds: ['Yg4R_bjc4', 'Yg4R_bjc4', 'jsYX72krD', 'yoWGZqX6k'],
        title: '已规划的任务',
        type: 'init',
      },
      { id: 1, taskIds: ['mJwzfBnyx', 'Kk9w2ZuTF', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Kk9w2ZuTF', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeColumns).toHaveBeenNthCalledWith(2, [
      {
        id: 0,
        taskIds: ['Yg4R_bjc4', 'Kk9w2ZuTF', 'Yg4R_bjc4', 'jsYX72krD', 'yoWGZqX6k'],
        title: '已规划的任务',
        type: 'init',
      },
      { id: 1, taskIds: ['mJwzfBnyx', 'Kk9w2ZuTF', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).toHaveBeenNthCalledWith(1, [
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 2, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
    expect(changeTodoList).toHaveBeenNthCalledWith(2, [
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
  });
});
