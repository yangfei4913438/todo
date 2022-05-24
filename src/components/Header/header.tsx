import React, { KeyboardEvent } from 'react';
import './header.scss';

interface HeaderProps {
  value: string;
  changeInputValue: (val: string) => IReducer;
  handleInputKeyUp: (e: KeyboardEvent) => void;
}

const Header: React.FC<HeaderProps> = ({ value, changeInputValue, handleInputKeyUp }) => {
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
