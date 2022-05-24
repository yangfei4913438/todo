// todolist 应用的类型定义
interface ITodoItem {
  id: string;
  title: string;
  level: number;
  time: number;
}

interface IColumn {
  id: number;
  type: string;
  title: string;
  taskIds: string[];
}

interface TodoStore {
  inputValue: string;
  items: ITodoItem[];
  columns: IColumn[];
}

// 返回对象
interface IReducer {
  type: string;
  value: any;
}

// 所有的keyPath
interface GlobalKeypath {
  // 全局配置
  todo: TodoStore;
}
