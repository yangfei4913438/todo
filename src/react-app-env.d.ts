/// <reference types="react-scripts" />

// todolist 应用的类型定义
declare interface IState {
  inputValue: string;
}

// 全局 store 的类型定义
declare interface IStore {
  todo: IState;
}
