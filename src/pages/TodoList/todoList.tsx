import React, { useMemo } from 'react';
import { message } from 'antd';
import todo from '../../http/todo';

import Header from '../../components/Header/header';
import List from '../../components/List/list';

import useTodoListInit from '../../hooks/useTodoListInit';
import useMoveItem from '../../hooks/useMoveItem';
import useChangeLevel from '../../hooks/useChangeLevel';
import useHandleInputKeyUp from '../../hooks/useHandleInputKeyUp';

import { todoLevel } from './variables';

interface IProps {
  actions: IActions;
  value: string;
  items: ITodoItem[];
}

const TodoList: React.FC<IProps> = ({ actions, value, items }) => {
  const { initTodoList, changeInputValue }: IActions = actions;

  // 初始化数据
  useTodoListInit(items, initTodoList);

  // 修改 todo 状态会触发
  const changeLevel = useChangeLevel(initTodoList, todo.patchTodoItem, message.error, console.error);

  // 拖拽会触发
  const moveItem = useMoveItem(items, changeLevel);

  // 回车添加数据
  const handleInputKeyUp = useHandleInputKeyUp(
    value,
    todo.postTodoItem,
    changeInputValue,
    initTodoList,
    message.error,
    console.error
  );

  // 缓存 Header 组件
  const headerCache = useMemo(
    () => <Header value={value} changeInputValue={changeInputValue} handleInputKeyUp={handleInputKeyUp} />,
    [value, changeInputValue, handleInputKeyUp]
  );

  // 缓存 List 组件
  const listCache = useMemo(
    () => (
      <List
        actives={items.filter(o => o.level !== todoLevel.end)}
        inActives={items.filter(o => o.level === todoLevel.end)}
        changeLevel={changeLevel}
        moveItem={moveItem}
      />
    ),
    [items, changeLevel, moveItem]
  );

  return (
    <div>
      {headerCache}
      {listCache}
    </div>
  );
};

export default TodoList;
