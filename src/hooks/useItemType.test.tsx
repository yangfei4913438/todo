import { renderHook } from '@testing-library/react-hooks';
import useItemType from './useItemType';

describe('测试 useItemType 自定义 HOOK', () => {
  it('active 类型', () => {
    // 传入的数组是未完成的
    const { result } = renderHook(() => useItemType('active'));

    expect(result.current).toBe('todo_item todo_item_active');
  });

  it('inActive 类型', () => {
    // 传入的数组是未完成的
    const { result } = renderHook(() => useItemType('inActive'));

    expect(result.current).toBe('todo_item todo_item_in_active');
  });
});
