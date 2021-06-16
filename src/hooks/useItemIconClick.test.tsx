import { renderHook, act } from '@testing-library/react-hooks';

import useItemIconClick from './useItemIconClick';

const item = {
  id: 'jsYX72krD',
  title: '生个孩子',
  level: 0,
  time: 1622942592814,
};
const changeLevel = jest.fn();

describe('测试 useItemIconClick 自定义Hook', () => {
  it('未完成类型操作', () => {
    const { result } = renderHook(() => useItemIconClick('active', item, changeLevel));

    act(() => result.current(0));

    expect(changeLevel).toBeCalledWith(item, 0);
  });

  it('已完成类型操作', () => {
    const { result } = renderHook(() => useItemIconClick('inActive', item, changeLevel));

    act(() => result.current(0));

    expect(changeLevel).not.toBeCalled();
  });
});
