![main test](https://github.com/yangfei4913438/todo/actions/workflows/test.yml/badge.svg)
![main deploy](https://github.com/yangfei4913438/todo/actions/workflows/deploy.yml/badge.svg)

## 项目说明

> 使用了 react hooks 来进行开发的 todoList 项目，支持拖拽。
>
> 如果你在学习react，这是一个不容错过的示例项目。

## GitHub Actions

CI, CD 使用 GitHub Actions, 目前应该是最佳选择了吧。。。

## immutable.js 说明

一、安装方法

```shell
# 安装库
yarn add immutable redux-immutable
# 安装类型定义文件
yarn add @types/redux-immutable -D
```

二、在reducer中更新数据

- 单个数据更新 state.set()
  ```typescript
  state.set('inputValue', action.value);
  ```
  - inputValue 是要被更新的key;

  - action.value 就是正常的redux 传递的值，无需处理成 immutable 类型数据。


- 多个数据更新 state.merge()

  ```typescript
  state.merge({
    items: action.value.items,
    columns: action.value.columns,
  });
  ```

取数据，直接看代码即可，非常简单。

## 单元测试说明

### 1、安装 enzyme

```shell
# 17没有官方包，暂时是社区提供的包 @wojtekmaj/enzyme-adapter-react-17
yarn add enzyme @wojtekmaj/enzyme-adapter-react-17  @types/enzyme jest-enzyme -D

# jest 默认就有，不用安装

# 安装 redux 相关的 mock
yarn add redux-mock-store @types/redux-mock-store -D
```

### 2、配置

```shell
# 增加下面的代码到 src/setupTests.ts 文件
import 'jest-enzyme';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
```

### 3、自定义配置

CRA 的默认配置文件位置: `react-scripts/scripts/utils/createJestConfig`

添加自己的jest配置，如果不解开CRA，那么就只能写在 package.json 中。

一般来说，都是添加排除目录或者测试目录的。

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/http/**/*",
      "!src/mock/**/*",
      "!src/store/**/*",
      "!src/**/store/**/index.{js,ts}",
      "!src/index.tsx",
      "!src/App.tsx"
    ]
  }
}
```

> 注意: 如果要包含或排除某个文件夹下的所有文件，那么必须在路径后面跟上 `**/*`, 直接加个目录是不生效的。
