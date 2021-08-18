import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Context from '@/presentation/contexts/form/form-context';
import { Authentication, SaveAccessToken } from '@/domain/usecases';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton
} from '@/presentation/components';
import { Validation } from '@/presentation/protocols/validation';
import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
  authentication: Authentication;
  saveAccessToken: SaveAccessToken;
};

export const Login: React.FC<Props> = ({
  validation,
  authentication,
  saveAccessToken
}: Props) => {
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
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
    try {
      if (state.isLoading || state.isFormInvalid) return;

      setState({ ...state, isLoading: true });

      const account = await authentication.auth({
        email: state.email,
        password: state.password
      });

      await saveAccessToken.save(account.accessToken);
      history.replace('/');
    } catch (error) {
      setState({ ...state, isLoading: false, requestError: error.message });
    }
  };

  useEffect(() => {
    const { email, password } = state;
    const formData = { email, password };

    const emailError = validation.validate('email', formData);
    const passwordError = validation.validate('password', formData);

    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError
    });
  }, [state.email, state.password]);

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
          onSubmit={handleSubmit}
          data-testid="form"
        >
          <h2>Access your account</h2>
          <Input type="email" name="email" placeholder="Type your e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Type your password"
          />
          <SubmitButton text="Login" />
          <span className={Styles.link}>
            Don't have an account? Click{' '}
            <Link to="/sign-up" data-testid="sign-up-link">
              here
            </Link>{' '}
            to register.
          </span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};
