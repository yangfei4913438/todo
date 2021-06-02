import React, { useCallback, useState } from 'react';
import shortid from 'shortid';

import Header from '../../components/Header';
import List from '../../components/List';

import { todoItem, todoLevel } from './variables';

// redux
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { actions } from './store';

// 映射state
const mapState = ({ todo }: IStore) => {
  return {
    value: todo.inputValue,
  };
};
// 映射action
const mapDispatch = (dispatch: Dispatch) => ({
  // 如果有多个actions, 可以先合并到一起
  actions: bindActionCreators(actions, dispatch),
});
/**
 * 封装一下连接方法
 * 注意：这里的 connect 不能被封装成函数返回值，否则运行报错！
 * */
const connStore = connect(mapState, mapDispatch);
// 推断出redux传入参数类型
type propsFromRedux = ConnectedProps<typeof connStore>;

const TodoList: React.FC<propsFromRedux> = ({ actions, value }) => {
  const [actives, setActives] = useState<todoItem[]>([]);
  const [inActives, setInActives] = useState<todoItem[]>([]);

  const addItem = useCallback(
    (val: string) => {
      const item: todoItem = {
        id: shortid.generate(),
        title: val,
        level: todoLevel.init,
        time: new Date().getTime(),
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
        const arr = actives
          .map(row => {
            if (row.id === item.id) {
              return {
                ...row,
                level,
              };
            }
            return row;
          })
          // 先根据 等级进行排序，然后再按创建时间进行排序
          .sort((a: todoItem, b: todoItem) => {
            if (a.level === b.level) {
              // 大的在后面
              return a.time > b.time ? 1 : a.time < b.time ? -1 : 0;
            } else {
              // 大的在前面
              return a.level > b.level ? -1 : 1;
            }
          });
        // 更新可用数组
        setActives(arr);
      }
    },
    [actives, setActives, inActives, setInActives]
  );

  return (
    <div>
      <Header value={value} changeInputValue={actions.changeInputValue} addItem={addItem} />
      <List actives={actives} inActives={inActives} changeLevel={changeLevel} moveItem={moveItem} />
    </div>
  );
};

export default connStore(TodoList);
