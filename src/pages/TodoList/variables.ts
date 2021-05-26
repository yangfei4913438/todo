export enum todoLevel {
  init,
  start,
  end,
}

export type todoItem = {
  id: string;
  title: string;
  level: todoLevel;
};

export const ItemType = {
  item: 'TODO_ITEM',
};
