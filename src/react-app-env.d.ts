/// <reference types="react-scripts" />

// todolist 应用的类型定义
declare interface todoItem {
  id: string;
  title: string;
  level: number;
  time: number;
}

declare interface IState {
  inputValue: string;
  items: todoItem[];
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
  changeTodoList: (value: todoItem[]) => IReducer;
}
