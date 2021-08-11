import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddAccount } from '@/domain/usecases';
import Context from '@/presentation/contexts/form/form-context';
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from '@/presentation/components';
import { Validation } from '@/presentation/protocols/validation';
import Styles from './sign-up-styles.scss';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
};

export const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
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
    if (state.isLoading) return;

    setState({ ...state, isLoading: true });
    await addAccount.add({
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation
    });
  };

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
      passwordConfirmationError: validation.validate(
        'passwordConfirmation',
        state.passwordConfirmation
      )
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
          <button
            type="submit"
            data-testid="submit-button"
            disabled={
              !!state.nameError ||
              !!state.emailError ||
              !!state.passwordError ||
              !!state.passwordConfirmationError
            }
          >
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
