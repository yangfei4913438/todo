import React, { useCallback, useState } from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { actions } from './store';
import shortid from 'shortid';
import { sortArrayByKey } from '../../utils/dataHelper';

import Header from '../../components/Header';
import List from '../../components/List';

import { todoItem, todoLevel } from './variables';

// 映射state
const mapState = (state: { todo: any }) => {
  // 使用这种方法，为了方便有需要全局state的操作
  const { todo } = state;
  return {
    value: todo.inputValue,
  };
};
// 映射action
const mapDispatch = (dispatch: (arg: { type: string; value: string }) => void) => ({
  // 修改输入框内容
  handleInputChange(value: string) {
    dispatch(actions.changeInputValue(value));
  },
});
/**
 * 封装一下连接方法
 * 注意：这里的 connect 不能被封装成函数返回值，否则运行报错！
 * */
const connStore = connect(mapState, mapDispatch);

const TodoList: React.FC<MapStateToProps<any, any> & MapDispatchToProps<any, any>> = ({ handleInputChange, value }) => {
  const [actives, setActives] = useState<todoItem[]>([]);
  const [inActives, setInActives] = useState<todoItem[]>([]);

  const addItem = useCallback(
    (val: string) => {
      const item: todoItem = {
        id: shortid.generate(),
        title: val,
        level: todoLevel.init,
      };
      setActives([...actives, item]);
    },
    [actives, setActives]
  );

  const moveItem = useCallback(
    (item: todoItem, targetType: string) => {
      if (targetType === 'inActive') {
        const ids = inActives.map(o => o.id);
        if (ids.includes(item.id)) return;
        // 更新可用数组
        setActives(actives.filter(row => row.id !== item.id));
        // 更新不可用数组
        setInActives([...inActives, { ...item, level: todoLevel.end }]);
      } else {
        const ids = actives.map(o => o.id);
        if (ids.includes(item.id)) return;
        // 更新不可用数组
        setInActives(inActives.filter(row => row.id !== item.id));
        // 更新可用数组
        setActives([...actives, { ...item, level: todoLevel.init }]);
      }
    },
    [inActives, actives, setActives, setInActives]
  );

  const changeLevel = useCallback(
    (item: todoItem, level: todoLevel) => {
      if (level === todoLevel.end) {
        // 更新可用数组
        setActives(actives.filter(row => row.id !== item.id));
        // 更新不可用数组
        setInActives([...inActives, { ...item, level }]);
      } else {
        // 更新level
        const arr = actives.map(row => {
          if (row.id === item.id) {
            return {
              ...row,
              level,
            };
          }
          return row;
        });
        // 更新可用数组
        setActives(sortArrayByKey(arr, 'level', 'desc'));
      }
    },
    [actives, setActives, inActives, setInActives]
  );

  return (
    <div>
      <Header value={value} handleInputChange={handleInputChange} addItem={addItem} />
      <List actives={actives} inActives={inActives} changeLevel={changeLevel} moveItem={moveItem} />
    </div>
  );
};

export default connStore(TodoList);
