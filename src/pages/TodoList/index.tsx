import React, { useCallback } from 'react';
import shortid from 'shortid';

import Header from '../../components/Header';
import List from '../../components/List';

import { todoLevel } from './variables';

// redux
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions } from './store';

// 映射state
const mapState = ({ todo }: IStore) => {
  return {
    value: todo.inputValue,
    items: todo.items,
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

const TodoList: React.FC<propsFromRedux> = ({ actions, value, items = [] }) => {
  const { changeTodoList } = actions;

  const addItem = useCallback(
    (val: string) => {
      const item: todoItem = {
        id: shortid.generate(),
        title: val,
        level: todoLevel.init,
        time: new Date().getTime(),
      };
      changeTodoList([...items, item]);
    },
    [items, changeTodoList]
  );

  const sortArray = useCallback((arr: todoItem[]) => {
    // 先根据 等级进行排序，然后再按创建时间进行排序
    return arr.sort((a: todoItem, b: todoItem) => {
      if (a.level === b.level) {
        // 大的在后面
        return a.time > b.time ? 1 : a.time < b.time ? -1 : 0;
      } else {
        // 大的在前面
        return a.level > b.level ? -1 : 1;
      }
    });
  }, []);

  // 拖拽会触发
  const moveItem = useCallback(
    (item: todoItem, targetType: string) => {
      // 默认是完成状态
      let level = todoLevel.end;
      // 相同的移动
      if (targetType === 'inActive') {
        const inActives = items.filter(o => o.level === todoLevel.end);
        const ids = inActives.map(o => o.id);
        if (ids.includes(item.id)) return;
      } else {
        const list = items.filter(o => o.level !== todoLevel.end);
        const ids = list.map(o => o.id);
        if (ids.includes(item.id)) return;
        // 正常的标记为初始
        level = todoLevel.init;
      }
      // 更新数组
      const arr: todoItem[] = items.map(row => {
        if (row.id === item.id) {
          return {
            ...row,
            level,
          };
        }
        return row;
      });
      // 更新不可用数组
      changeTodoList(sortArray(arr));
    },
    [items, changeTodoList, sortArray]
  );

  // 修改todo状态会触发
  const changeLevel = useCallback(
    (item: todoItem, level: todoLevel) => {
      // 更新数组
      const arr: todoItem[] = items.map(row => {
        if (row.id === item.id) {
          return {
            ...row,
            level,
          };
        }
        return row;
      });
      // 更新不可用数组
      changeTodoList(sortArray(arr));
    },
    [items, changeTodoList, sortArray]
  );

  return (
    <div>
      <Header value={value} changeInputValue={actions.changeInputValue} addItem={addItem} />
      <List
        actives={items.filter(o => o.level !== todoLevel.end)}
        inActives={items.filter(o => o.level === todoLevel.end)}
        changeLevel={changeLevel}
        moveItem={moveItem}
      />
    </div>
  );
};

export default connStore(TodoList);
