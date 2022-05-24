import React from 'react';
import './todoItem.scss';
import classnames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { Dropdown, Menu } from 'antd';
import { todoLevel } from '../../pages/TodoList/variables';

import useItemIconRender from '../../hooks/useItemIconRender';

export interface TodoItemProps {
  column: IColumn;
  item: ITodoItem;
  index: number;
  changeLevel: (column: IColumn, item: ITodoItem, level: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ column, item, index, changeLevel }) => {
  // 自定义 渲染ICON hook
  const renderIcon = useItemIconRender();

  return (
    <Draggable
      index={index}
      draggableId={item.id}
      // isDragDisabled={item.level === 2}
    >
      {(provided, snapshot) => (
        <div
          // 提供拖拽的数据
          {...provided.draggableProps}
          // 绑在需要拖拽的地方
          {...provided.dragHandleProps}
          // 暴露DOM给上级对象
          ref={provided.innerRef}
          className={classnames('todo_item', {
            todo_item_dragging: snapshot.isDragging,
          })}
        >
          <div
            className={classnames('todo_item_level', {
              todo_item_level_init: item.level === todoLevel.init,
              todo_item_level_progress: item.level === todoLevel.progress,
              todo_item_level_done: item.level === todoLevel.done,
            })}
          >
            <Dropdown
              overlay={
                <Menu
                  items={[todoLevel.init, todoLevel.progress, todoLevel.done]
                    .filter(o => o !== item.level)
                    .map(row => {
                      return {
                        label: <div onClick={() => changeLevel(column, item, row)}>{renderIcon(row, true)}</div>,
                        key: row,
                      };
                    })}
                />
              }
            >
              <div>{renderIcon(item.level)}</div>
            </Dropdown>
          </div>
          <div className={'todo_item_title'} data-testid="task-content">
            {item.title}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TodoItem;
