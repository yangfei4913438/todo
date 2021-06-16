import { useEffect } from 'react';

const useTodoListInit = (items: ITodoItem[], initTodoList: () => void) => {
  useEffect(() => {
    // 如果当前不存在，就去加载远程的
    if (!items?.length) {
      initTodoList();
    } else {
      // console.log('拿到items:', items);
    }
  }, [items, initTodoList]);
};

export default useTodoListInit;
