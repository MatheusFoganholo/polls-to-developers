import React, { useContext } from 'react';
import FormContext from '@/presentation/contexts/form/form-context';
import Styles from './input-styles.scss';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext);
  const error = state[`${props.name}Error`];

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false;
  };

  const getStatus = (): string => {
    return '🔴';
  };

  const getTitle = (): string => {
    return error;
  };

  const handleChange = ({
    target: { name, value }
  }: React.FocusEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [name]: value
    });
  };

  return (
    <div className={Styles.inputWrapper}>
      <input
        {...props}
        readOnly
        onFocus={enableInput}
        onChange={handleChange}
        data-testid={`${props.name}-input`}
      />
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
