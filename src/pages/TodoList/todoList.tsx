import React, { useMemo, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import shortid from 'shortid';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Record } from 'immutable';
import { actions } from './store';

import Header from '../../components/Header/header';
import List from '../../components/List/list';

import useTodoListInit from '../../hooks/useTodoListInit';
import useDropEnd from '../../hooks/useDropEnd';
import useChangeLevel from '../../hooks/useChangeLevel';
import useHandleInputKeyUp from '../../hooks/useHandleInputKeyUp';

const TodoList: React.FC = () => {
  const dispatch = useDispatch();

  const data = useSelector<Record<GlobalKeypath>, TodoStore>(state => state.get('todo'));
  const { inputValue: value, items, columns } = data;

  const initTodoList = () => dispatch(actions.initTodoList());
  const changeInputValue = useCallback((val: string) => dispatch(actions.changeInputValue(val)), [dispatch]);
  const changeColumns = (val: IColumn[]) => dispatch(actions.changeColumns(val));
  const changeTodoList = (val: ITodoItem[]) => dispatch(actions.changeTodoList(val));

  // 初始化数据
  useTodoListInit(items, initTodoList);

  // 修改 todo 状态会触发
  const changeLevel = useChangeLevel(columns, changeColumns, items, changeTodoList, message.error, console.error);

  // 拖拽放置会触发
  const onDragEnd = useDropEnd(columns, changeColumns, items, changeTodoList, message.error, console.error);

  // 回车添加数据
  const handleInputKeyUp = useHandleInputKeyUp(
    shortid.generate(),
    new Date().getTime(),
    value,
    columns,
    items,
    changeInputValue,
    changeColumns,
    changeTodoList,
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
