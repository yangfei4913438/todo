import { useCallback } from 'react';
import { AxiosPromise } from 'axios';

const useChangeLevel = (
  initTodoList: () => void,
  patchTodoItem: (id: string, key: string, value: any) => AxiosPromise,
  messageError: (content: any, duration?: any, onClose?: any) => void,
  consoleError: (...data: any[]) => void
) => {
  return useCallback(
    async (item: ITodoItem, level: number) => {
      try {
        // 更新数组元素
        await patchTodoItem(item.id, 'level', level);
        // 重新获取数组
        await initTodoList();
      } catch (err) {
        consoleError('更新todo属性失败:', err);
        messageError('更新todo属性失败');
      }
    },
    [initTodoList, patchTodoItem, messageError, consoleError]
  );
};

export default useChangeLevel;
