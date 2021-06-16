import React from 'react';
import TodoItem from '../TodoItem/todoItemWrapper';
import classNames from 'classnames';

import { ConnectDropTarget } from 'react-dnd';

export interface TodoItemsProps {
  type: string;
  list: ITodoItem[];
  changeLevel: (item: ITodoItem, level: number) => void;
  moveItem: (item: ITodoItem, targetType: string) => void;
  connectDropTarget: ConnectDropTarget;
  canDrop: boolean;
  isOver: boolean;
}

const TodoItems: React.FC<TodoItemsProps> = ({ type, list, changeLevel, connectDropTarget }) => {
  return connectDropTarget(
    <div
      className={classNames({
        todo_list_active: type === 'active',
        todo_list_in_active: type === 'inActive',
      })}
    >
      <div className={'todo_list_title'}>
        <div className={'todo_list_title_text'}>{type === 'active' ? '进行中' : '已完成'}</div>
        <div
          className={classNames({
            todo_list_title_icon_start: type === 'active',
            todo_list_title_icon_end: type === 'inActive',
          })}
        >
          {list.length}
        </div>
      </div>
      <div className={'todo_list_content'}>
        {list.map(row => (
          <TodoItem type={type} item={row} changeLevel={changeLevel} key={row.id} />
        ))}
      </div>
    </div>
  );
};

export default TodoItems;
