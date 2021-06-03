import React from 'react';
import TodoItems from '../TodoItems';
import './index.scss';

interface ListProps {
  actives: todoItem[];
  inActives: todoItem[];
  changeLevel: (item: todoItem, level: number) => void;
  moveItem: (item: todoItem, targetType: string) => void;
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
