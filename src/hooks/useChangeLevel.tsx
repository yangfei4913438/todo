import { useCallback } from 'react';
import { AxiosPromise } from 'axios';
import { cloneDeep } from 'lodash';

const useChangeLevel = (
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
    async (column: IColumn, item: ITodoItem, level: number) => {
      // 备份, 用于失败的时候还原
      const lastColumns = cloneDeep(columns);
      const lastItems = cloneDeep(items);
      // 是否执行出错了
      let isError = false;

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
        // source 列，更新的 promise 对象
        const sourceColumnUpdate = patchTodoColumn(column.id, sourceColumnIds);
        // target 列，更新的 promise 对象
        const targetColumnUpdate = patchTodoColumn(targetColumnId, targetColumnIds);
        // 修改拖拽对象的状态
        const changeSourceLevel = patchTodoItem(item.id, 'level', level);
        // 并行发起请求
        // 注：最好的情况是后端有一个接口，可以同时处理这三个请求。这种情况，可能会出现，部分成功，部分失败，这就很尴尬了。
        await Promise.all([sourceColumnUpdate, targetColumnUpdate, changeSourceLevel]);
      } catch (err) {
        consoleError('更新todo属性失败:', err);
        messageError('更新todo属性失败, 上一步操作撤销');
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
      initTodoList,
      patchTodoItem,
      messageError,
      consoleError,
    ]
  );
};

export default useChangeLevel;
