import React, { useContext } from 'react';
import FormContext from '@/presentation/contexts/form/form-context';
import Styles from './input-styles.scss';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(FormContext);
  const error = errorState[props.name];

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false;
  };

  const getStatus = (): string => {
    return '🔴';
  };

  const getTitle = (): string => {
    return error;
  };

  return (
    <div className={Styles.inputWrapper}>
      <input {...props} readOnly onFocus={enableInput} />
      <span
        title={getTitle()}
        className={Styles.status}
        data-testid={`${props.name}-status`}
      >
        {getStatus()}
      </span>
    </div>
  );
};
