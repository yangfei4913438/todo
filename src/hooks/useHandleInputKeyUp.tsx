import { KeyboardEvent, useCallback } from 'react';
import shortid from 'shortid';
import { todoLevel } from '../pages/TodoList/variables';
import { AxiosPromise } from 'axios';

const useHandleInputKeyUp = (
  value: string,
  postTodoItem: (item: ITodoItem) => AxiosPromise,
  changeInputValue: (value: string) => IReducer,
  initTodoList: () => void,
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
          await postTodoItem({
            id: shortid.generate(),
            title: value,
            level: todoLevel.init,
            time: new Date().getTime(),
          });
          // 重新获取 todo 数组
          await initTodoList();
        } catch (err) {
          consoleError('新增todo失败:', err);
          messageError('新增todo失败');
        }
      }
    },
    [value, postTodoItem, changeInputValue, initTodoList, messageError, consoleError]
  );
};

export default useHandleInputKeyUp;
