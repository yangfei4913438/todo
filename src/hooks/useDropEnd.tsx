import { useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { todoLevel, todoLevelType } from '../pages/TodoList/variables';

const useDropEnd = (
  columns: IColumn[],
  changeColumns: (val: IColumn[]) => IReducer,
  items: ITodoItem[],
  changeTodoList: (val: ITodoItem[]) => IReducer,
  messageError: (content: any, duration?: any, onClose?: any) => void,
  consoleError: (...data: any[]) => void
) => {
  return useCallback(
    async ({ destination, source, draggableId }: DropResult) => {
      // 没有目标不处理
      if (!destination) {
        return;
      }

      // 拖拽对象的类型
      const sourceType = source.droppableId;
      // 拖拽对象的索引
      const sourceIndex = source.index;

      // 放置对象的类型
      const targetType = destination.droppableId;
      // 放置对象的索引
      const targetIndex = destination.index;

      // 相同的拖拽id(类型)，索引也是一致的情况下，就是没有改动
      if (targetType === sourceType && targetIndex === sourceIndex) {
        return;
      }

      // 更新列
      try {
        // 同一个列的处理
        if (targetType === sourceType) {
          const newColumns = columns.map(column => {
            if (column.type === sourceType) {
              // 删除
              const [removed] = column.taskIds.splice(sourceIndex, 1);
              // 添加
              column.taskIds.splice(targetIndex, 0, removed);
            }
            return column;
          });
          // 改变redux
          changeColumns(newColumns);
        } else {
          // 生成新的目标ID
          let sourceColumnIds: string[] = [];
          let targetColumnIds: string[] = [];
          // 获取每个列的新ID数组
          const arr = columns.map(column => {
            switch (column.type) {
              case sourceType:
                // 过滤掉转移走的
                sourceColumnIds = column.taskIds.filter(id => id !== draggableId);
                return {
                  ...column,
                  taskIds: sourceColumnIds,
                };
              case targetType:
                // 如果不是同一个类型，那么直接插入即可
                column.taskIds.splice(targetIndex, 0, draggableId);
                // 处理后的元素
                targetColumnIds = column.taskIds;
                return {
                  ...column,
                  taskIds: targetColumnIds,
                };
              default:
                return column;
            }
          });
          // 跟新redux
          changeColumns(arr);

          // 获取到ID
          let targetColumnLevel: number = todoLevel.init;
          switch (targetType) {
            case todoLevelType.init:
              targetColumnLevel = todoLevel.init;
              break;
            case todoLevelType.progress:
              targetColumnLevel = todoLevel.progress;
              break;
            case todoLevelType.done:
              targetColumnLevel = todoLevel.done;
              break;
          }
          const newItems = items.map(item => {
            if (item.id === draggableId) {
              return {
                ...item,
                level: targetColumnLevel,
              };
            }
            return item;
          });
          // 更新到redux
          changeTodoList(newItems);
        }
      } catch (err) {
        consoleError('放置todo失败:', err);
        messageError('放置todo失败，上一步操作撤销', 5);
      }
    },
    [columns, changeColumns, items, changeTodoList, consoleError, messageError]
  );
};

export default useDropEnd;
