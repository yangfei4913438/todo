import { KeyboardEvent, useCallback } from 'react';
import { todoLevel, todoLevelType } from '../pages/TodoList/variables';
import { AxiosPromise } from 'axios';

const useHandleInputKeyUp = (
  newId: string,
  newTime: number,
  value: string,
  columns: IColumn[],
  postTodoItem: (item: ITodoItem) => AxiosPromise,
  patchTodoColumn: (columnId: number, taskIds: string[]) => AxiosPromise,
  changeInputValue: (value: string) => IReducer,
  initTodoList: () => void,
  messageError: (content: any, duration?: any, onClose?: any) => void,
  consoleError: (...data: any[]) => void
) => {
  return useCallback(
    async (e: KeyboardEvent) => {
      // 13表示回车键
      if (e.keyCode === 13 && value) {
        // 是否执行出错了
        let isError = false;
        try {
          // 重置为空
          changeInputValue('');
          // 新增 todo 对象
          await postTodoItem({
            id: newId,
            title: value,
            level: todoLevel.init,
            time: newTime,
          });
          // 在初始列表添加一个新的对象
          const targetColumn: IColumn = columns.find(o => o.type === todoLevelType.init) as IColumn;
          // 获取计划列中的ID数组
          const ids = Array.from(targetColumn.taskIds);
          // 在数组头部插入新的ID
          ids.unshift(newId);
          // 修改 计划列 中的ID数组
          await patchTodoColumn(targetColumn.id, ids);
        } catch (err) {
          consoleError('新增todo失败:', err);
          messageError('新增todo失败');
          // 标记为执行出错
          isError = true;
        }
        // 重新获取数组, 这里重新获取数组，失败也无所谓，重点是上面的操作不能失败
        !isError && initTodoList();
      }
    },
    [
      newId,
      newTime,
      value,
      columns,
      postTodoItem,
      patchTodoColumn,
      changeInputValue,
      initTodoList,
      messageError,
      consoleError,
    ]
  );
};

export default useHandleInputKeyUp;
