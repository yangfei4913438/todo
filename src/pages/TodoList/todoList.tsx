import React, { useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import shortid from 'shortid';
import { message } from 'antd';
import todo from '../../http/todo';

import Header from '../../components/Header/header';
import List from '../../components/List/list';

import useTodoListInit from '../../hooks/useTodoListInit';
import useDropEnd from '../../hooks/useDropEnd';
import useChangeLevel from '../../hooks/useChangeLevel';
import useHandleInputKeyUp from '../../hooks/useHandleInputKeyUp';

interface IProps {
  actions: IActions;
  value: string;
  items: ITodoItem[];
  columns: IColumn[];
}

const TodoList: React.FC<IProps> = ({ actions, value, items, columns }) => {
  const { initTodoList, changeInputValue, changeColumns, changeTodoList }: IActions = actions;

  // 初始化数据
  useTodoListInit(items, initTodoList);

  // 修改 todo 状态会触发
  const changeLevel = useChangeLevel(
    columns,
    changeColumns,
    todo.patchTodoColumn,
    items,
    changeTodoList,
    todo.patchTodoItem,
    initTodoList,
    message.error,
    console.error
  );

  // 拖拽放置会触发
  const onDragEnd = useDropEnd(
    columns,
    changeColumns,
    todo.patchTodoColumn,
    items,
    changeTodoList,
    todo.patchTodoItem,
    initTodoList,
    message.error,
    console.error
  );

  // 回车添加数据
  const handleInputKeyUp = useHandleInputKeyUp(
    shortid.generate(),
    new Date().getTime(),
    value,
    columns,
    todo.postTodoItem,
    todo.patchTodoColumn,
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
    () => <List items={items} columns={columns} changeLevel={changeLevel} />,
    [items, columns, changeLevel]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {headerCache}
      {listCache}
    </DragDropContext>
  );
};

export default TodoList;
