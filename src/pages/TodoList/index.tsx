import React, { useCallback, useEffect } from 'react';
import shortid from 'shortid';

import Header from '../../components/Header';
import List from '../../components/List';

import { todoLevel } from './variables';

interface IProps {
  actions: IActions;
  value: string;
  items: ITodoItem[];
}

const TodoList: React.FC<IProps> = ({ actions, value, items = [] }) => {
  const { initTodoList, postItem, patchItem }: IActions = actions;

  useEffect(() => {
    // 如果当前不存在，就去加载远程的
    if (!items?.length) {
      initTodoList();
    }
  }, [items, initTodoList]);

  // 新增一个todo
  const addItem = useCallback(
    async (val: string) => {
      // 新增对象
      await postItem({
        id: shortid.generate(),
        title: val,
        level: todoLevel.init,
        time: new Date().getTime(),
      });
      // 重新获取数组
      await initTodoList();
    },
    [postItem, initTodoList]
  );

  // 拖拽会触发
  const moveItem = useCallback(
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
      // 更新数组元素
      await patchItem(item.id, 'level', level);
      // 重新获取数组
      await initTodoList();
    },
    [items, patchItem, initTodoList]
  );

  // 修改todo状态会触发
  const changeLevel = useCallback(
    async (item: ITodoItem, level: todoLevel) => {
      // 更新数组元素
      await patchItem(item.id, 'level', level);
      // 重新获取数组
      await initTodoList();
    },
    [patchItem, initTodoList]
  );

  return (
    <div>
      <Header value={value} changeInputValue={actions.changeInputValue} addItem={addItem} />
      <List
        actives={items.filter(o => o.level !== todoLevel.end)}
        inActives={items.filter(o => o.level === todoLevel.end)}
        changeLevel={changeLevel}
        moveItem={moveItem}
      />
    </div>
  );
};

export default TodoList;
