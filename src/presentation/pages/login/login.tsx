import React from 'react';
import Header from '@/presentation/components/login-header/login-header';
import Footer from '@/presentation/components/footer/footer';
import { FormStatus } from '@/presentation/components/form-status/form-status';
import { Input } from '@/presentation/components/input/input';
import Styles from './login-styles.scss';

export const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <Header />
      <form className={Styles.form}>
        <h2>Access your account</h2>
        <Input type="email" name="email" placeholder="Type your e-mail" />
        <Input
          type="password"
          name="password"
          placeholder="Type your password"
        />
        <button type="submit">Login</button>
        <span className={Styles.link}>
          Don't have an account? Click <a href="#">here</a> to register.
        </span>
        <FormStatus />
      </form>
      <Footer />
    </div>
  );
};
