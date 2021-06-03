import React, { useCallback } from 'react';
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
  const { changeTodoList }: IActions = actions;

  const addItem = useCallback(
    (val: string): void => {
      const item: ITodoItem = {
        id: shortid.generate(),
        title: val,
        level: todoLevel.init,
        time: new Date().getTime(),
      };
      changeTodoList([...items, item]);
    },
    [items, changeTodoList]
  );

  const sortArray = useCallback((arr: ITodoItem[]): ITodoItem[] => {
    // 先根据 等级进行排序，然后再按创建时间进行排序
    return arr.sort((a: ITodoItem, b: ITodoItem) => {
      if (a.level === b.level) {
        // 大的在后面
        return a.time > b.time ? 1 : a.time < b.time ? -1 : 0;
      } else {
        // 大的在前面
        return a.level > b.level ? -1 : 1;
      }
    });
  }, []);

  // 拖拽会触发
  const moveItem = useCallback(
    (item: ITodoItem, targetType: string): void => {
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
      // 更新数组
      const arr: ITodoItem[] = items.map(row => {
        if (row.id === item.id) {
          return {
            ...row,
            level,
          };
        }
        return row;
      });
      // 更新不可用数组
      changeTodoList(sortArray(arr));
    },
    [items, changeTodoList, sortArray]
  );

  // 修改todo状态会触发
  const changeLevel = useCallback(
    (item: ITodoItem, level: todoLevel): void => {
      // 更新数组
      const arr: ITodoItem[] = items.map(row => {
        if (row.id === item.id) {
          return {
            ...row,
            level,
          };
        }
        return row;
      });
      // 更新不可用数组
      changeTodoList(sortArray(arr));
    },
    [items, changeTodoList, sortArray]
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
