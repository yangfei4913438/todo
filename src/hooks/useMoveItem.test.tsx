import { renderHook, act } from '@testing-library/react-hooks';
import useMoveItem from './useMoveItem';

import jsonData from '../mock/data.json';

const items: ITodoItem[] = jsonData.list.filter(o => o.level !== 2);
const items2: ITodoItem[] = jsonData.list.filter(o => o.level === 2);
const changeLevel = jest.fn();

const item = {
  id: 'jsYX72krD',
  title: '生个孩子',
  level: 0,
  time: 1622942592814,
};
const item2 = {
  id: 'r2sxR9jKg',
  title: '买一辆车',
  level: 2,
  time: 1622942487518,
};
const targetTypeActive = 'active';
const targetTypeInActive = 'inActive';

describe('测试 useMoveItem 自定义Hook', () => {
  it('测试未完成的todo: 当前列表是未完成', async () => {
    // 传入的数组是未完成的
    const { result } = await renderHook(() => useMoveItem(items, changeLevel));

    // 移动的对象是未完成的，目标是未完成的
    await act(() => result.current(item, targetTypeActive));
    // 所以断言，方法没有被调用
    expect(changeLevel).not.toBeCalled();

    jest.resetAllMocks();

    // 移动的对象是未完成的，目标是已完成的
    await act(() => result.current(item, targetTypeInActive));
    // 所以断言，方法被调用了
    expect(changeLevel).toBeCalledWith(item, 2);

    jest.resetAllMocks();

    // 移动的对象是已完成的，目标是未完成的
    await act(() => result.current(item2, targetTypeActive));
    // 所以断言，方法被调用了
    expect(changeLevel).toBeCalledWith(item2, 0);

    jest.resetAllMocks();

    // 移动的对象是已完成的，目标是已完成的
    await act(() => result.current(item2, targetTypeInActive));
    // 所以断言，方法被调用了
    expect(changeLevel).toBeCalledWith(item2, 2);
  });

  it('测试未完成的todo: 当前列表是已完成', async () => {
    // 传入的数组是已完成的
    const { result } = await renderHook(() => useMoveItem(items2, changeLevel));

    // 移动的对象是未完成的，目标是未完成的
    await act(() => result.current(item, targetTypeActive));
    // 所以断言，方法被调用了
    expect(changeLevel).toBeCalledWith(item, 0);

    jest.resetAllMocks();

    // 移动的对象是未完成的，目标是已完成的
    await act(() => result.current(item, targetTypeInActive));
    // 所以断言，方法没有被调用
    expect(changeLevel).toBeCalledWith(item, 2);

    jest.resetAllMocks();

    // 移动的对象是已完成的，目标是未完成的
    await act(() => result.current(item2, targetTypeActive));
    // 所以断言，方法被调用了
    expect(changeLevel).toBeCalledWith(item2, 0);

    jest.resetAllMocks();

    // 移动的对象是已完成的，目标是已完成的
    await act(() => result.current(item2, targetTypeInActive));
    // 所以断言，方法没有被调用
    expect(changeLevel).not.toBeCalled();
  });
});
