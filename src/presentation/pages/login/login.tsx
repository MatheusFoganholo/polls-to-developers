import React, { useState } from 'react';
import Context from '@/presentation/contexts/form/form-context';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from '@/presentation/components';
import Styles from './login-styles.scss';

type StateProps = {
  isLoading: boolean;
  errorMessage: string;
};

export const Login: React.FC = () => {
  const [state] = useState<StateProps>({
    isLoading: false,
    errorMessage: ''
  });

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={state}>
        <form className={Styles.form}>
          <h2>Access your account</h2>
          <Input type="email" name="email" placeholder="Type your e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Type your password"
          />
          <button type="submit" data-testid="submit-button" disabled>
            Login
          </button>
          <span className={Styles.link}>
            Don't have an account? Click <a href="#">here</a> to register.
          </span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};
