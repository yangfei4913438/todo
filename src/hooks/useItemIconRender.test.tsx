import { renderHook, act } from '@testing-library/react-hooks';
import { CheckCircleTwoTone, CloudTwoTone, SyncOutlined } from '@ant-design/icons';
import useItemIconRender from './useItemIconRender';
import { todoLevel } from '../pages/TodoList/variables';
import React from 'react';

let Icon = <CloudTwoTone />;
let font = '初始化';

const renderIcon = (level: number, needFont: boolean) => {
  switch (level) {
    case todoLevel.init:
      Icon = <CloudTwoTone />;
      font = '初始化';
      break;
    case todoLevel.start:
      Icon = <SyncOutlined spin />;
      font = '进行中';
      break;
    case todoLevel.end:
      Icon = <CheckCircleTwoTone />;
      font = '已完成';
      break;
  }
  if (needFont) {
    return (
      <div>
        {Icon} {font}
      </div>
    );
  }
  return Icon;
};

it('测试 useItemIconRender 自定义Hook', () => {
  // 传入的数组是未完成的
  const { result } = renderHook(() => useItemIconRender());

  const execTest = (res: typeof result, level: number, needFont: boolean) => {
    act(() => {
      const data = res.current(level, needFont);
      expect(data).toEqual(renderIcon(level, needFont));
    });
  };

  execTest(result, 0, true);
  execTest(result, 0, false);
});
