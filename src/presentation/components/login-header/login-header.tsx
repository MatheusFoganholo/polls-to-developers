import React, { memo } from 'react';
import { Logo } from '@/presentation/components';
import Styles from './login-header-styles.scss';

const LoginHeader: React.FC = () => {
  return (
    <div>
      <header className={Styles.header}>
        <Logo />
        <h1>4Dev - Polls To Developers</h1>
      </header>
    </div>
  );
};

export default memo(LoginHeader);
