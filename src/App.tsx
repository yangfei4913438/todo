import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// 首页组件
import TodoList from './pages/TodoList';
// 其他组件，懒加载
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Switch>
          <Route path={'/'} exact component={TodoList} />
          <Route path={'*'} component={NotFound} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
