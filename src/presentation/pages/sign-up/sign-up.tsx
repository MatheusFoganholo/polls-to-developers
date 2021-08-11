import React from 'react';
import { Link } from 'react-router-dom';
import Context from '@/presentation/contexts/form/form-context';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from '@/presentation/components';
import Styles from './sign-up-styles.scss';

export const SignUp: React.FC = () => {
  return (
    <div className={Styles.signUp}>
      <LoginHeader />
      <Context.Provider value={{ state: {} }}>
        <form className={Styles.form}>
          <h2>Create your account</h2>
          <Input type="text" name="name" placeholder="Type your name" />
          <Input type="email" name="email" placeholder="Type your e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Type your password"
          />
          <Input
            type="password"
            name="password-confirmation"
            placeholder="Confirm your password"
          />
          <button type="submit">Create</button>
          <span className={Styles.link}>
            <Link to="/login">Back to Login</Link>
          </span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};
