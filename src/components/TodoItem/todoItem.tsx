import React from 'react';
import './todoItem.scss';
import { Dropdown, Menu } from 'antd';
import { todoLevel } from '../../pages/TodoList/variables';
import { ConnectDragSource } from 'react-dnd';

import useItemType from '../../hooks/useItemType';
import useItemIconClick from '../../hooks/useItemIconClick';
import useItemIconRender from '../../hooks/useItemIconRender';

export interface TodoItemProps {
  type: string;
  item: ITodoItem;
  changeLevel?: (item: ITodoItem, level: number) => void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

const TodoItem: React.FC<TodoItemProps> = ({ type, item, changeLevel, isDragging, connectDragSource }) => {
  // 自定义的 class hook
  const classes = useItemType(type);
  // 定义以点击响应 hook
  const handleClick = useItemIconClick(type, item, changeLevel);
  // 自定义 渲染ICON hook
  const renderIcon = useItemIconRender();

  return connectDragSource(
    <div className={classes} key={item.id} style={{ display: isDragging ? 'none' : 'flex' }}>
      <div className={'todo_item_level'}>
        <Dropdown
          disabled={type !== 'active'}
          overlay={
            <Menu>
              {[todoLevel.init, todoLevel.start, todoLevel.end].map(row => {
                return (
                  <Menu.Item key={row} onClick={() => handleClick(row)}>
                    {renderIcon(row, true)}
                  </Menu.Item>
                );
              })}
            </Menu>
          }
        >
          <div>{renderIcon(item.level)}</div>
        </Dropdown>
      </div>
      <div className={'todo_item_title'}>{item.title}</div>
    </div>
  );
};

export default TodoItem;
