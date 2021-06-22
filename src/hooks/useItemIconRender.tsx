import React, { useCallback } from 'react';
import { CheckCircleOutlined, CloudOutlined, SyncOutlined } from '@ant-design/icons';
import { todoLevel } from '../pages/TodoList/variables';

const useItemIconRender = () => {
  return useCallback((level: number, needFont: boolean = false) => {
    let Icon = <CloudOutlined />;
    let font = '初始化';
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
  }, []);
};

export default useItemIconRender;
