import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { CheckCircleOutlined, CloudOutlined, SyncOutlined } from '@ant-design/icons';
import useItemIconRender from './useItemIconRender';
import { todoLevel } from '../pages/TodoList/variables';

let Icon = <CloudOutlined />;
let font = '初始化';

const renderIcon = (level: number, needFont: boolean) => {
  switch (level) {
    case todoLevel.init:
      Icon = <CloudOutlined />;
      font = '初始化';
      break;
    case todoLevel.progress:
      Icon = <SyncOutlined spin />;
      font = '进行中';
      break;
    case todoLevel.done:
      Icon = <CheckCircleOutlined />;
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
      // 有返回值的处理方法
      const data = res.current(level, needFont);
      expect(data).toEqual(renderIcon(level, needFont));
    });
  };

  execTest(result, 0, true);
  execTest(result, 0, false);
});
