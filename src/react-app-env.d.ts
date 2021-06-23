/// <reference types="react-scripts" />
declare module 'react-beautiful-dnd-test-utils' {
  export const mockGetComputedSpacing: () => void;
  export const mockDndElSpacing: (rtlUtils: any) => void;
  export const makeDnd: (args: any) => Promise;
  export const DND_DRAGGABLE_DATA_ATTR: string;
  export const DND_DIRECTION_DOWN: string;
  export const DND_DIRECTION_UP: string;
  export const DND_DIRECTION_RIGHT: string;
  export const DND_DIRECTION_LEFT: string;
}

// todolist 应用的类型定义
declare interface ITodoItem {
  id: string;
  title: string;
  level: number;
  time: number;
}

declare interface IColumn {
  id: number;
  type: string;
  title: string;
  taskIds: string[];
}

declare interface IState {
  inputValue: string;
  items: ITodoItem[];
  columns: IColumn[];
}

// 全局 store 的类型定义
declare interface IStore {
  todo: IState;
}

// 返回对象
declare interface IReducer {
  type: string;
  value: any;
}

// actions 定义
declare interface IActions {
  changeInputValue: (value: string) => IReducer;
  changeTodoList: (value: ITodoItem[]) => IReducer;
  changeColumns: (value: IColumn[]) => IReducer;
  initTodoList: () => void;
}
