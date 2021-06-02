export enum todoLevel {
  init,
  start,
  end,
}

export type todoItem = {
  id: string;
  title: string;
  level: todoLevel;
  time: number;
};

export const ItemType = {
  item: 'TODO_ITEM',
};
