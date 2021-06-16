import { renderHook } from '@testing-library/react-hooks';
import useTodoListInit from './useTodoListInit';
import jsonData from '../mock/data.json';

describe('测试 Todolist 初始化 hook', () => {
  const items: ITodoItem[] = [];
  const initTodoList = jest.fn();

  it('测试初始没有值的情况', () => {
    renderHook(() => useTodoListInit(items, initTodoList));
    expect(initTodoList).toBeCalled();
  });

  it('测试有值的情况', () => {
    renderHook(() => useTodoListInit(jsonData.list, initTodoList));
    expect(initTodoList).not.toBeCalled();
  });
});
