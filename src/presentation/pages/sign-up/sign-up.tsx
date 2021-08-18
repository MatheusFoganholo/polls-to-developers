import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AddAccount, SaveAccessToken } from '@/domain/usecases';
import Context from '@/presentation/contexts/form/form-context';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton
} from '@/presentation/components';
import { Validation } from '@/presentation/protocols/validation';
import Styles from './sign-up-styles.scss';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
  saveAccessToken: SaveAccessToken;
};

export const SignUp: React.FC<Props> = ({
  validation,
  addAccount,
  saveAccessToken
}: Props) => {
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    nameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    passwordConfirmation: '',
    passwordConfirmationError: '',
    requestError: ''
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      if (state.isLoading || state.isFormInvalid) return;

      setState({ ...state, isLoading: true });
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      });

      await saveAccessToken.save(account.accessToken);
      history.replace('/');
    } catch (error) {
      setState({ ...state, isLoading: false, requestError: error.message });
    }
  };

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state;
    const formData = { name, email, password, passwordConfirmation };
    const nameError = validation.validate('name', formData);
    const emailError = validation.validate('email', formData);
    const passwordError = validation.validate('password', formData);
    const passwordConfirmationError = validation.validate(
      'passwordConfirmation',
      formData
    );

    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid:
        !!nameError ||
        !!emailError ||
        !!passwordError ||
        !!passwordConfirmationError
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  return (
    <div className={Styles.signUp}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
          onSubmit={handleSubmit}
          data-testid="form"
        >
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
          <SubmitButton text="Create" />
          <span className={Styles.link}>
            <Link to="/login" replace data-testid="login-link">
              Back to Login
            </Link>
          </span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};
