import React, { KeyboardEvent, useCallback } from 'react';
import './index.scss';

interface HeaderProps {
  value: string;
  changeInputValue: (value: string) => void;
  addItem: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ value, addItem, changeInputValue }) => {
  // 回车添加任务
  const handleInputKeyUp = useCallback(
    (e: KeyboardEvent) => {
      // 13表示回车键
      if (e.keyCode === 13 && value) {
        console.log('input:', value);
        // 调用回调
        addItem(value);
        // 重置为空
        changeInputValue('');
      }
    },
    [value, addItem, changeInputValue]
  );

  return (
    <div className={'header'}>
      <div className={'header_content'}>
        TodoList
        <input
          className={'header_input'}
          value={value}
          placeholder={'请输入Todo'}
          onChange={e => changeInputValue(e.target.value)}
          onKeyUp={handleInputKeyUp}
        />
      </div>
    </div>
  );
};

export default Header;
