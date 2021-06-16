import { DropTarget, DropTargetMonitor, DropTargetConnector, DropTargetSpec } from 'react-dnd';
import { ItemType } from '../../pages/TodoList/variables';
import TodoItems, { TodoItemsProps } from './todoItems';

// 拖拽参数
const targetSpec: DropTargetSpec<TodoItemsProps> = {
  drop: (props: TodoItemsProps, monitor: DropTargetMonitor) => {
    if (monitor.didDrop()) {
      return;
    }
    // 这里的props指当前的
    props.moveItem(monitor.getItem(), props.type);
  },
};

// 拖拽时的回调
const targetCollect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

// 导出拖拽目标
export default DropTarget(ItemType.item, targetSpec, targetCollect)(TodoItems);
