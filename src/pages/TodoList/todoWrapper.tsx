// redux
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Record } from 'immutable';
import { actions } from './store';

// 被包裹的组件
import TodoList from './index';

// 映射state
const mapState = (state: Record<IStore>) => {
  return {
    // 取值的时候，需要加上 keyPath
    value: state.getIn(['todo', 'inputValue']),
    items: state.getIn(['todo', 'items']),
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

// 导出封装后的组件
export default connStore(TodoList);
