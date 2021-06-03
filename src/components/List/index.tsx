import React from 'react';
import TodoItems from '../TodoItems';
import './index.scss';

interface ListProps {
  actives: ITodoItem[];
  inActives: ITodoItem[];
  changeLevel: (item: ITodoItem, level: number) => void;
  moveItem: (item: ITodoItem, targetType: string) => void;
}

const List: React.FC<ListProps> = ({ actives, inActives, changeLevel, moveItem }) => {
  return (
    <div className={'todo_list'}>
      <TodoItems type={'active'} list={actives} changeLevel={changeLevel} moveItem={moveItem} />
      <TodoItems type={'inActive'} list={inActives} changeLevel={changeLevel} moveItem={moveItem} />
    </div>
  );
};

export default List;
