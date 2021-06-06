/// <reference types="react-scripts" />

// todolist 应用的类型定义
declare interface ITodoItem {
  id: string;
  title: string;
  level: number;
  time: number;
}

declare interface IState {
  inputValue: string;
  items: ITodoItem[];
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
  initTodoList: () => void;
  postItem: (item: ITodoItem) => void;
  patchItem: (id: string, key: string, value: any) => void;
}
