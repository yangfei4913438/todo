import { renderHook, act } from '@testing-library/react-hooks';
import { AxiosPromise } from 'axios';
import useChangeLevel from './useChangeLevel';
import jsonData from '../mock/data.json';

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

const items = jsonData.list;
const item = items[0];
const column = {
  id: 0,
  type: 'init',
  title: '已规划的任务',
  taskIds: ['jsYX72krD', 'Kk9w2ZuTF', 'yoWGZqX6k'],
};
const columns = jsonData.columns;

describe('测试 useChangeLevel 自定义 Hook', () => {
  it('正常处理', async () => {
    const { result } = await renderHook(() =>
      useChangeLevel(
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

    await act(() => result.current(column, item, 0));

    // 当前设计：todo对象的 level 就是 column 的 id, 这样可以优化很多逻辑
    let targetColumnId: number = 0;

    // 生成新的目标ID
    let sourceColumnIds: string[] = column.taskIds.filter(id => id !== item.id);
    let targetColumnIds: string[] = [];
    // 获取每个列的新ID数组
    const arr = columns.map(row => {
      switch (row.id) {
        // 当前列 和 目标列，肯定不是同一个列
        case column.id:
          return {
            ...row,
            taskIds: sourceColumnIds,
          };
        case targetColumnId:
          row.taskIds.unshift(item.id);
          // 处理后的元素
          targetColumnIds = row.taskIds;
          return {
            ...row,
            taskIds: targetColumnIds,
          };
        default:
          // 其他直接返回即可
          return row;
      }
    });
    // 更新todo对象数组
    const newItems = items.map(row => {
      if (row.id === item.id) {
        return {
          ...row,
          level: 0,
        };
      }
      return row;
    });
    expect(changeColumns).toBeCalledWith(arr);
    // 更新todo到redux中，让页面看起来更顺滑
    expect(changeTodoList).toBeCalledWith(newItems);
    expect(patchTodoColumn).toHaveBeenNthCalledWith(1, column.id, sourceColumnIds);
    expect(patchTodoColumn).toHaveBeenNthCalledWith(2, targetColumnId, targetColumnIds);
    expect(patchTodoItem).toBeCalledWith(item.id, 'level', 0);
    expect(initTodoList).toBeCalled();
  });

  it('异常处理1', async () => {
    const { result } = await renderHook(() =>
      useChangeLevel(
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

    // 在异常处理中，不要加入异常方法，否则这里会直接报错（真的有异常，在这里处理异常就可以了。）
    await act(() => result.current(column, item, 0));

    // 报错调用断言
    expect(consoleError).toBeCalled();
    expect(messageError).toBeCalled();

    // 下面两个函数，赋值的时候调用了，出错回滚的时候，也调用了一次，一共两次。
    // 这里就不写具体的调用传参了，没有意义。
    expect(changeColumns).toBeCalledTimes(2);
    expect(changeTodoList).toBeCalledTimes(2);
  });

  it('异常处理1', async () => {
    const { result } = await renderHook(() =>
      useChangeLevel(
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

    // 在异常处理中，不要加入异常方法，否则这里会直接报错（真的有异常，在这里处理异常就可以了。）
    await act(() => result.current(column, item, 1));

    // 报错调用断言
    expect(consoleError).toBeCalled();
    expect(messageError).toBeCalled();

    // 下面两个函数，赋值的时候调用了，出错回滚的时候，也调用了一次，一共两次。
    // 这里就不写具体的调用传参了，没有意义。
    expect(changeColumns).toBeCalledTimes(2);
    expect(changeTodoList).toBeCalledTimes(2);
  });
});
