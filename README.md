## 项目说明

> 使用了 react hooks 来进行开发的 todoList 项目，支持拖拽。
>
> 数据交互使用 json-server 来模拟，代码逻辑更接近正常项目。

## immutable.js 说明

1、安装方法

```shell
# 安装库
yarn add immutable redux-immutable
# 安装类型定义文件
yarn add @types/redux-immutable -D
```

2、使用方法

- 使用 fromJS 初始化你的基础数据，数据类型为 Record<IState>
- reducer 中设置值的时候，直接 state.set('inputValue', action.value); 即可实现数据更新。
  inputValue 是要被更新的key,
  action.value 就是正常的redux 传递的值，无需处理成 immutable 类型数据。
- 取数据的时候，因为我是通过合并 reducer 的方式导出的，所以取值，需要通过 state.getIn(['todo', 'inputValue']) 来获取值。
  取出来的值，就是普通的js类型，无需转换。
  todo 表示当前的 reducer path,
  inputValue 表示 todo 这个 reducer 中 state 的 key

具体用法见代码，很简单的。
