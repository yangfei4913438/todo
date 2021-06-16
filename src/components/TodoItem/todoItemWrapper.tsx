import { DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from 'react-dnd';
import { ItemType } from '../../pages/TodoList/variables';
import TodoItem, { TodoItemProps } from './todoItem';

// 拖拽参数
const sourceSpec: DragSourceSpec<TodoItemProps, ITodoItem, ITodoItem> = {
  beginDrag: (props: TodoItemProps) => {
    // 拖拽的时候，携带的内容，就是外部传入的数据
    return props.item;
  },
};

// 拖拽时的回调
const sourceCollect = (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

// 导出拖拽组件
export default DragSource(ItemType.item, sourceSpec, sourceCollect)(TodoItem);
