import { useCallback } from 'react';

// 点击icon上dropdown组件的点击事件抽象
const useItemIconClick = (type: string, item: ITodoItem, changeLevel?: (item: ITodoItem, level: number) => void) => {
  return useCallback(
    (level: number) => {
      if (type === 'active') {
        changeLevel?.(item, level);
      }
    },
    [type, item, changeLevel]
  );
};

export default useItemIconClick;
