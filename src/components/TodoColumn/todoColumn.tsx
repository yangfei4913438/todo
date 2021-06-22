import React from 'react';
import classNames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import './todoColumn.scss';

import TodoItem from '../TodoItem/todoItem';
import { todoLevelType } from '../../pages/TodoList/variables';

export interface TodoItemsProps {
  column: IColumn;
  list: ITodoItem[];
  changeLevel: (column: IColumn, item: ITodoItem, level: number) => void;
}

const TodoColumn: React.FC<TodoItemsProps> = ({ column, list, changeLevel }) => {
  return (
    <div className={'todo_list_column'}>
      <div className={'todo_list_title'}>
        <div className={'todo_list_title_text'}>{column.title}</div>
        <div
          className={classNames('todo_list_title_icon', {
            todo_list_title_icon_init: column.type === todoLevelType.init,
            todo_list_title_icon_progress: column.type === todoLevelType.progress,
            todo_list_title_icon_done: column.type === todoLevelType.done,
          })}
        >
          {list.length}
        </div>
      </div>
      <Droppable
        droppableId={column.type} // 这里的ID，一般写列的类型，用于区分不同的列
        type={'todo'} // 只有类型相同的列表元素，才可以互相拖动, 如果不写就表示不限制
      >
        {/*
            - provided: 提供内部标签所需的props
              1、innerRef: 获取ref
              2、droppableProps: 提供能够放置的props，在function的根结点展开即可{...provided.droppableProps}
              3、placeholder: 占位符，放置在function组件根节点内部的最下面
            - snapshot
              1、isDraggingOver 是否在拖动状态
          */}
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classNames('todo_list_content', {
              todo_list_content_hover: snapshot.isDraggingOver,
            })}
          >
            {list.map((row, index) => (
              <TodoItem index={index} item={row} column={column} changeLevel={changeLevel} key={row.id} />
            ))}
            {/* 函数式组件的最下面需要增加这个占位的 */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TodoColumn;
