import React, { useCallback } from 'react';
import { CheckCircleTwoTone, CloudTwoTone, SyncOutlined } from '@ant-design/icons';
import { todoLevel } from '../pages/TodoList/variables';

const useItemIconRender = () => {
  return useCallback((level: number, needFont: boolean = false) => {
    let Icon = <CloudTwoTone />;
    let font = '初始化';
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
  }, []);
};

export default useItemIconRender;
