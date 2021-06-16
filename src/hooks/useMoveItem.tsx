import { useCallback } from 'react';
import { todoLevel } from '../pages/TodoList/variables';

const useMoveItem = (items: ITodoItem[], changeLevel: (item: ITodoItem, level: number) => any) => {
  return useCallback(
    async (item: ITodoItem, targetType: string) => {
      // 默认是完成状态
      let level = todoLevel.end;
      // 相同的移动
      if (targetType === 'inActive') {
        const inActives = items.filter(o => o.level === todoLevel.end);
        const ids = inActives.map(o => o.id);
        if (ids.includes(item.id)) return;
      } else {
        const list = items.filter(o => o.level !== todoLevel.end);
        const ids = list.map(o => o.id);
        if (ids.includes(item.id)) return;
        // 正常的标记为初始
        level = todoLevel.init;
      }
      // 修改 todo 状态
      await changeLevel(item, level);
    },
    [items, changeLevel]
  );
};

export default useMoveItem;
