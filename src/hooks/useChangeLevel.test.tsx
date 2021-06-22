import { renderHook, act } from '@testing-library/react-hooks';
import useChangeLevel from './useChangeLevel';
import jsonData from '../mock/data.json';
import { todoLevel, todoLevelType } from '../pages/TodoList/variables';
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
let item = items.find(o => o.level === todoLevel.init) as ITodoItem;
let columns = data.columns;
let column = columns.find(o => o.type === todoLevelType.init) as IColumn;

const init = async () => {
  const { result } = await renderHook(() =>
    useChangeLevel(columns, changeColumns, items, changeTodoList, messageError, consoleError)
  );
  return result;
};

beforeEach(() => {
  // 每次重置被修改的数据，因为这些不是mock数据，不会被重置
  data = cloneDeep(jsonData);
  items = data.list;
  item = items.find(o => o.level === todoLevel.init) as ITodoItem;
  columns = data.columns;
  column = columns.find(o => o.type === todoLevelType.init) as IColumn;

  jest.restoreAllMocks();
});

describe('测试 useChangeLevel 自定义 Hook', () => {
  it('正常处理: type init', async () => {
    const result = await init();

    await act(() => result.current(column, item, 0));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['Kk9w2ZuTF', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).toBeCalledWith([
      { id: 'r2sxR9jKg', level: 2, time: 1622942487518, title: '买一辆车' },
      { id: 'Yg4R_bjc4', level: 2, time: 1622942492375, title: '买一套房' },
      { id: 'mJwzfBnyx', level: 1, time: 1622942498319, title: '娶个老婆' },
      { id: 'jsYX72krD', level: 0, time: 1622942592814, title: '生个孩子' },
      { id: 'qamhI4FeH', level: 1, time: 1622942510906, title: '事业有成' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
  });

  it('正常处理: type progress', async () => {
    const result = await init();

    await act(() => result.current(column, item, 1));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['Kk9w2ZuTF', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['jsYX72krD', 'mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).toBeCalledWith([
      { id: 'r2sxR9jKg', level: 2, time: 1622942487518, title: '买一辆车' },
      { id: 'Yg4R_bjc4', level: 2, time: 1622942492375, title: '买一套房' },
      { id: 'mJwzfBnyx', level: 1, time: 1622942498319, title: '娶个老婆' },
      { id: 'jsYX72krD', level: 1, time: 1622942592814, title: '生个孩子' },
      { id: 'qamhI4FeH', level: 1, time: 1622942510906, title: '事业有成' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
  });

  it('正常处理: type done', async () => {
    const result = await init();

    await act(() => result.current(column, item, 2));

    expect(changeColumns).toBeCalledWith([
      { id: 0, taskIds: ['Kk9w2ZuTF', 'yoWGZqX6k'], title: '已规划的任务', type: 'init' },
      { id: 1, taskIds: ['mJwzfBnyx', 'qamhI4FeH'], title: '执行中的任务', type: 'progress' },
      { id: 2, taskIds: ['jsYX72krD', 'r2sxR9jKg', 'Yg4R_bjc4'], title: '已完成的任务', type: 'done' },
    ]);
    expect(changeTodoList).toBeCalledWith([
      { id: 'r2sxR9jKg', level: 2, time: 1622942487518, title: '买一辆车' },
      { id: 'Yg4R_bjc4', level: 2, time: 1622942492375, title: '买一套房' },
      { id: 'mJwzfBnyx', level: 1, time: 1622942498319, title: '娶个老婆' },
      { id: 'jsYX72krD', level: 2, time: 1622942592814, title: '生个孩子' },
      { id: 'qamhI4FeH', level: 1, time: 1622942510906, title: '事业有成' },
      { id: 'Kk9w2ZuTF', level: 0, time: 1622942517578, title: '功成名就' },
      { id: 'yoWGZqX6k', level: 0, time: 1624034429002, title: '人生巅峰' },
    ]);
  });

  it('异常处理', async () => {
    const { result } = await renderHook(() =>
      useChangeLevel(columns, errorFunc, items, errorFunc, messageError, consoleError)
    );

    // 在异常处理中，不要加入异常方法，否则这里会直接报错（真的有异常，在这里处理异常就可以了。）
    await act(() => result.current(column, item, 0));

    // 报错调用断言
    expect(consoleError).toBeCalled();
    expect(messageError).toBeCalled();
  });
});
