import { renderHook, act } from '@testing-library/react-hooks';
import { DropResult } from 'react-beautiful-dnd';
import useDropEnd from './useDropEnd';
import jsonData from '../mock/data.json';
import { todoLevelType } from '../pages/TodoList/variables';
import { cloneDeep } from 'lodash';

const changeColumns = jest.fn();
const changeTodoList = jest.fn();
const messageError = jest.fn();
const consoleError = jest.fn();
const errorFunc = (item?: any) => {
  throw new Error('出错了!');
};

// 初始化数据
let data = cloneDeep(jsonData);
let items = data.list;
let columns = data.columns;

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

beforeEach(() => {
  data = cloneDeep(jsonData);
  items = data.list;
  columns = data.columns;
  jest.restoreAllMocks();
});

const init = async () => {
  const { result } = await renderHook(() =>
    useDropEnd(columns, changeColumns, items, changeTodoList, messageError, consoleError)
  );
  return result;
};

const initError = async () => {
  const { result } = await renderHook(() =>
    useDropEnd(columns, errorFunc, items, errorFunc, messageError, consoleError)
  );
  return result;
};

describe('测试拖拽响应Hook', () => {
  it('测试目标对象没有值', async () => {
    const result = await init();

    const arg1 = {
      ...args,
      destination: undefined,
    };

    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).not.toBeCalled();
    expect(changeTodoList).not.toBeCalled();
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
    expect(changeTodoList).not.toBeCalled();
    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试同一个列', async () => {
    const result = await init();

    const arg1 = {
      ...args,
      destination: {
        droppableId: todoLevelType.init,
        index: 0,
      },
      source: {
        droppableId: todoLevelType.init,
        index: 2,
      },
    };

    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['yoWGZqX6k', 'jsYX72krD', 'Kk9w2ZuTF'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);

    expect(changeTodoList).not.toBeCalled();
    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试不同列: init', async () => {
    const result = await init();
    const arg1 = {
      destination: {
        droppableId: todoLevelType.init,
        index: 0,
      },
      source: {
        droppableId: todoLevelType.progress,
        index: 1,
      },
      draggableId: columns.find(column => column.type === todoLevelType.progress)!.taskIds[1],
    };
    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['qamhI4FeH', 'jsYX72krD', 'Kk9w2ZuTF', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);

    expect(changeTodoList).toBeCalledWith([
      { id: 'r2sxR9jKg', level: 2, time: 1622942487518, title: '买一辆车' },
      { id: 'Yg4R_bjc4', level: 2, time: 1622942492375, title: '买一套房' },
      { id: 'mJwzfBnyx', level: 1, time: 1622942498319, title: '娶个老婆' },
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'qamhI4FeH', level: 0, time: 1622942510906, title: '事业有成' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试不是同一个列: progress', async () => {
    const result = await init();

    const arg1 = {
      ...args,
      destination: {
        droppableId: todoLevelType.progress,
        index: 1,
      },
    };

    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'Kk9w2ZuTF', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);

    expect(changeTodoList).toBeCalledWith([
      { id: 'r2sxR9jKg', level: 2, time: 1622942487518, title: '买一辆车' },
      { id: 'Yg4R_bjc4', level: 2, time: 1622942492375, title: '买一套房' },
      { id: 'mJwzfBnyx', level: 1, time: 1622942498319, title: '娶个老婆' },
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'qamhI4FeH', level: 1, time: 1622942510906, title: '事业有成' },
      { id: 'Kk9w2ZuTF', level: 1, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试不是同一个列: done', async () => {
    const result = await init();

    const arg1 = {
      ...args,
      destination: {
        droppableId: 'done',
        index: 2,
      },
    };

    await act(() => result.current(arg1 as DropResult));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4', 'Kk9w2ZuTF'], title: '已完成的任务', type: 'done' },
    ]);

    expect(changeTodoList).toBeCalledWith([
      { id: 'r2sxR9jKg', level: 2, time: 1622942487518, title: '买一辆车' },
      { id: 'Yg4R_bjc4', level: 2, time: 1622942492375, title: '买一套房' },
      { id: 'mJwzfBnyx', level: 1, time: 1622942498319, title: '娶个老婆' },
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'qamhI4FeH', level: 1, time: 1622942510906, title: '事业有成' },
      { id: 'Kk9w2ZuTF', level: 2, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试异常, 相同列', async () => {
    const result = await init();

    await act(() => result.current(args as DropResult));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['Kk9w2ZuTF', 'jsYX72krD', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).not.toBeCalled();

    expect(messageError).not.toBeCalled();
    expect(consoleError).not.toBeCalled();
  });

  it('测试异常, 不同列', async () => {
    const result = await initError();

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
  });

  it('测试异常, 不同列, target progress', async () => {
    const result = await initError();

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
  });

  it('测试异常, 不同列, target done', async () => {
    const result = await initError();

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
  });
});
