import React from 'react';
import TodoColumn from '../TodoColumn/todoColumn';
import './list.scss';

interface ListProps {
  items: ITodoItem[];
  columns: IColumn[];
  changeLevel: (column: IColumn, item: ITodoItem, level: number) => void;
}

const List: React.FC<ListProps> = ({ items, columns, changeLevel }) => {
  return (
    <div className={'todo_list'}>
      {columns.map((column, idx) => {
        const list: ITodoItem[] = column.taskIds.map(id => {
          return items.find(i => i.id === id) as ITodoItem;
        });
        return <TodoColumn column={column} list={list} changeLevel={changeLevel} key={idx} />;
      })}
    </div>
  );
};

export default List;
