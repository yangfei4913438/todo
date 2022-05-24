import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// loading组件, 其他组件没有加载好的时候显示
import Loading from './pages/Loading/loading';
// 首页组件, 懒加载（使用懒加载，loading动画才会生效，避免首页白屏的尴尬）
const TodoList = lazy(() => import('./pages/TodoList/todoList'));
// 其他组件，懒加载
const NotFound = lazy(() => import('./pages/NotFound/notFound'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={'/'} exact component={TodoList} />
          <Route path={'*'} component={NotFound} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
