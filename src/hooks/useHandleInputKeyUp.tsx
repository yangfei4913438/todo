import { KeyboardEvent, useCallback } from 'react';
import { todoLevel, todoLevelType } from '../pages/TodoList/variables';

const useHandleInputKeyUp = (
  newId: string,
  newTime: number,
  value: string,
  columns: IColumn[],
  items: ITodoItem[],
  changeInputValue: (value: string) => IReducer,
  changeColumns: (value: IColumn[]) => IReducer,
  changeTodoList: (value: ITodoItem[]) => IReducer,
  messageError: (content: any, duration?: any, onClose?: any) => void,
  consoleError: (...data: any[]) => void
) => {
  return useCallback(
    async (e: KeyboardEvent) => {
      // 13表示回车键
      if (e.keyCode === 13 && value) {
        try {
          // 重置为空
          changeInputValue('');
          // 新增 todo 对象
          changeTodoList([...items, { id: newId, title: value, level: todoLevel.init, time: newTime }]);
          // 修改 计划列 中的ID数组
          const newColumns: IColumn[] = columns.map(column => {
            if (column.type === todoLevelType.init) {
              // 插入新的数据
              column.taskIds.unshift(newId);
              return {
                ...column,
                taskIds: column.taskIds,
              };
            }
            return column;
          });
          // 保存到 redux
          changeColumns(newColumns);
        } catch (err) {
          consoleError('新增todo失败:', err);
          messageError('新增todo失败');
        }
      }
    },
    [newId, newTime, value, columns, items, changeInputValue, changeColumns, changeTodoList, messageError, consoleError]
  );
};

export default useHandleInputKeyUp;
