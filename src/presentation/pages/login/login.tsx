import React from 'react';
import { Logo } from '@/presentation/components/logo/logo';
import { Spinner } from '@/presentation/components/spinner/spinner';
import Styles from './login-styles.scss';

export const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <Logo />
        <h1>4Dev - Polls To Developers</h1>
      </header>
      <form className={Styles.form}>
        <h2>Access your account</h2>
        <div className={Styles.inputWrapper}>
          <input type="email" name="email" placeholder="Type your e-mail" />
          <span className={Styles.status}>🔴</span>
        </div>
        <div className={Styles.inputWrapper}>
          <input
            type="password"
            name="password"
            placeholder="Type your password"
          />
          <span className={Styles.status}>🔴</span>
        </div>
        <button type="submit">Login</button>
        <span className={Styles.link}>
          Don't have an account? Click <a href="#">here</a> to register.
        </span>
        <div className={Styles.errorWrapper}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Erro</span>
        </div>
      </form>
      <footer className={Styles.footer} />
    </div>
  );
};
