import { useMemo } from 'react';
import classNames from 'classnames';

// 根据用户传入的类型来生成需要的类
const useItemType = (type: string) => {
  return useMemo(
    () =>
      classNames('todo_item', {
        todo_item_active: type === 'active',
        todo_item_in_active: type === 'inActive',
      }),
    [type]
  );
};

export default useItemType;
