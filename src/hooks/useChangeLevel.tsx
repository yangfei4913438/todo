import { useCallback } from 'react';

const useChangeLevel = (
  columns: IColumn[],
  changeColumns: (val: IColumn[]) => IReducer,
  items: ITodoItem[],
  changeTodoList: (val: ITodoItem[]) => IReducer,
  messageError: (content: any, duration?: any, onClose?: any) => void,
  consoleError: (...data: any[]) => void
) => {
  return useCallback(
    async (column: IColumn, item: ITodoItem, level: number) => {
      try {
        // 当前设计：todo对象的 level 就是 column 的 id, 这样可以优化很多逻辑
        let targetColumnId: number = level;

        // 生成新的目标ID
        let sourceColumnIds: string[] = column.taskIds.filter(id => id !== item.id);
        let targetColumnIds: string[] = [];
        // 获取每个列的新ID数组
        const arr = columns.map(row => {
          switch (row.id) {
            // 当前列 和 目标列，肯定不是同一个列
            case column.id:
              return {
                ...row,
                taskIds: sourceColumnIds,
              };
            case targetColumnId:
              row.taskIds.unshift(item.id);
              // 处理后的元素
              targetColumnIds = row.taskIds;
              return {
                ...row,
                taskIds: targetColumnIds,
              };
            default:
              // 其他直接返回即可
              return row;
          }
        });
        // 更新redux
        changeColumns(arr);
        // 更新todo对象数组
        const newItems = items.map(row => {
          if (row.id === item.id) {
            return {
              ...row,
              level,
            };
          }
          return row;
        });
        // 更新todo到redux中，让页面看起来更顺滑
        changeTodoList(newItems);
      } catch (err) {
        consoleError('更新todo属性失败:', err);
        messageError('更新todo属性失败, 上一步操作撤销');
      }
    },
    [columns, changeColumns, items, changeTodoList, messageError, consoleError]
  );
};

export default useChangeLevel;
