import React, { useEffect, useState } from 'react';
import Context from '@/presentation/contexts/form/form-context';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from '@/presentation/components';
import { Validation } from '@/presentation/protocols/validation';
import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
};

export const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    requestError: ''
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password)
    });
  }, [state.email, state.password]);

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Access your account</h2>
          <Input type="email" name="email" placeholder="Type your e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Type your password"
          />
          <button
            type="submit"
            data-testid="submit-button"
            disabled={!!state.emailError || !!state.passwordError}
          >
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
