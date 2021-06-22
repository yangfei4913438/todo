import { useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { AxiosPromise } from 'axios';
import { cloneDeep } from 'lodash';
import { todoLevel, todoLevelType } from '../pages/TodoList/variables';

const useDropEnd = (
  columns: IColumn[],
  changeColumns: (value: IColumn[]) => IReducer,
  patchTodoColumn: (columnId: number, taskIds: string[]) => AxiosPromise,
  items: ITodoItem[],
  changeTodoList: (value: ITodoItem[]) => IReducer,
  patchTodoItem: (id: string, key: string, value: any) => AxiosPromise,
  initTodoList: () => void,
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

      // 备份, 用于失败的时候还原
      const lastColumns = cloneDeep(columns);
      const lastItems = cloneDeep(items);
      // 是否执行出错了
      let isError = false;

      // 更新列
      try {
        // 同一个列的处理
        if (targetType === sourceType) {
          let obj: IColumn = columns[sourceIndex];
          const newColumns = columns.map(column => {
            if (column.type === sourceType) {
              // 删除
              const [removed] = column.taskIds.splice(sourceIndex, 1);
              // 添加
              column.taskIds.splice(targetIndex, 0, removed);
              // 赋值给变量
              obj = column;
            }
            return column;
          });
          // 改变redux
          changeColumns(newColumns);
          // 更新数据
          await patchTodoColumn(obj.id, obj.taskIds);
        } else {
          // 获取到ID
          let sourceColumnId: number = NaN;
          let targetColumnId: number = NaN;
          let targetColumnLevel: number = todoLevel.init;
          // 生成新的目标ID
          let sourceColumnIds: string[] = [];
          let targetColumnIds: string[] = [];
          // 获取每个列的新ID数组
          const arr = columns.map(column => {
            switch (column.type) {
              case sourceType:
                sourceColumnId = column.id;
                // 过滤掉转移走的
                sourceColumnIds = column.taskIds.filter(id => id !== draggableId);
                return {
                  ...column,
                  taskIds: sourceColumnIds,
                };
              case targetType:
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
                targetColumnId = column.id;
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
          const newItems = items.map(item => {
            if (item.id === draggableId) {
              return {
                ...item,
                level: targetColumnLevel,
              };
            }
            return item;
          });
          changeTodoList(newItems);
          // source 列，更新的 promise 对象
          const sourceColumnUpdate = patchTodoColumn(sourceColumnId, sourceColumnIds);
          // target 列，更新的 promise 对象
          const targetColumnUpdate = patchTodoColumn(targetColumnId, targetColumnIds);
          // 修改拖拽对象的状态
          const changeSourceLevel = patchTodoItem(draggableId, 'level', targetColumnLevel);
          // 并行发起请求
          // 注：最好的情况是后端有一个接口，可以同时处理这三个请求。这种情况，可能会出现，部分成功，部分失败，这就很尴尬了。
          await Promise.all([sourceColumnUpdate, targetColumnUpdate, changeSourceLevel]);
        }
      } catch (err) {
        consoleError('放置todo失败:', err);
        messageError('放置todo失败，上一步操作撤销', 5);
        // 还原旧数据
        changeColumns(lastColumns);
        changeTodoList(lastItems);
        // 标记为执行出错
        isError = true;
      }
      // 重新获取数组, 这里重新获取数组，失败也无所谓，重点是上面的操作不能失败
      !isError && initTodoList();
    },
    [
      columns,
      changeColumns,
      patchTodoColumn,
      items,
      changeTodoList,
      patchTodoItem,
      initTodoList,
      consoleError,
      messageError,
    ]
  );
};

export default useDropEnd;
