import React, { useCallback, useMemo } from 'react';
import './index.scss';
import classNames from 'classnames';
import { Dropdown, Menu } from 'antd';
import { CheckCircleTwoTone, CloudTwoTone, SyncOutlined } from '@ant-design/icons';
import { ItemType, todoLevel } from '../../pages/TodoList/variables';

import { ConnectDragSource, DragSourceMonitor } from 'react-dnd';
import { DragSource, DragSourceConnector } from 'react-dnd';

interface TodoItemProps {
  type: string;
  item: todoItem;
  changeLevel?: (item: todoItem, level: number) => void;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

const TodoItem: React.FC<TodoItemProps> = ({ type, item, changeLevel = () => {}, isDragging, connectDragSource }) => {
  const classes = useMemo(
    () =>
      classNames('todo_item', {
        todo_item_active: type === 'active',
        todo_item_in_active: type === 'inActive',
      }),
    [type]
  );

  const handleClick = useCallback(
    (level: number) => {
      if (type === 'active') {
        changeLevel(item, level);
      }
    },
    [type, item, changeLevel]
  );

  const renderIcon = useCallback((level: number, needFont: boolean = false) => {
    let Icon = <CloudTwoTone />;
    let font = '初始化';
    switch (level) {
      case todoLevel.init:
        Icon = <CloudTwoTone />;
        font = '初始化';
        break;
      case todoLevel.start:
        Icon = <SyncOutlined spin />;
        font = '进行中';
        break;
      case todoLevel.end:
        Icon = <CheckCircleTwoTone />;
        font = '已完成';
        break;
    }
    if (needFont) {
      return (
        <div>
          {Icon} {font}
        </div>
      );
    }
    return Icon;
  }, []);

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

export default DragSource(
  ItemType.item,
  {
    beginDrag: (props: TodoItemProps) => {
      // 拖拽的时候，携带的内容，就是外部传入的数据
      return props.item;
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(TodoItem);
