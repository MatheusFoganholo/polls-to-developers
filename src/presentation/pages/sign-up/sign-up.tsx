import React, { useState } from 'react';
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
  const [state, setState] = useState({
    isLoading: false,
    nameError: 'Required field.',
    emailError: 'Required field.',
    passwordError: 'Required field.',
    passwordConfirmationError: 'Required field.',
    requestError: ''
  });

  return (
    <div className={Styles.signUp}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
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
            name="passwordConfirmation"
            placeholder="Confirm your password"
          />
          <button type="submit" data-testid="submit-button" disabled>
            Create
          </button>
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
