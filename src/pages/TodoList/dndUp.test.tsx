import React from 'react';
import { render, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  mockGetComputedSpacing,
  mockDndElSpacing,
  makeDnd,
  DND_DRAGGABLE_DATA_ATTR,
  DND_DIRECTION_UP,
} from 'react-beautiful-dnd-test-utils';

import TodoList from './todoList';
import { todoLevelType } from './variables';
import store from '../../store';

const createTestTextOrderByTestIdHelper = (getAllByTestId: any) => {
  return (testId: string, expectedTexts: string[]) => {
    const texts = getAllByTestId(testId).map((x: HTMLElement) => x.textContent);
    expect(texts).toEqual(expectedTexts);
  };
};

const renderApp = () => {
  const rtlUtils = render(
    <Provider store={store}>
      <TodoList />
    </Provider>
  );

  mockDndElSpacing(rtlUtils);

  const makeGetDragEl = (text: string) => () => rtlUtils.getByText(text).closest(DND_DRAGGABLE_DATA_ATTR);

  return { makeGetDragEl, ...rtlUtils };
};

describe('测试DND', () => {
  beforeEach(() => {
    mockGetComputedSpacing();
  });

  it('测试往上移动1个', async () => {
    const { getByText, getByTestId, makeGetDragEl } = renderApp();

    await makeDnd({
      getByText: getByText,
      getDragEl: makeGetDragEl('功成名就'),
      direction: DND_DIRECTION_UP,
      positions: 1,
    });

    const { getAllByTestId: getAllByTestIdWithinColumn } = within(getByTestId(todoLevelType.init));

    const testTextOrderByTestId = createTestTextOrderByTestIdHelper(getAllByTestIdWithinColumn);
    testTextOrderByTestId('task-content', ['功成名就', '生个孩子', '人生巅峰']);
  });
});
