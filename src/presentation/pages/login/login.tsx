import React, { useEffect, useState } from 'react';
import Context from '@/presentation/contexts/form/form-context';
import { Authentication } from '@/domain/usecases';
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
  authentication: Authentication;
};

export const Login: React.FC<Props> = ({
  validation,
  authentication
}: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    requestError: ''
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setState({ ...state, isLoading: true });
    await authentication.auth({ email: state.email, password: state.password });
  };

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
        <form className={Styles.form} onSubmit={handleSubmit}>
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
