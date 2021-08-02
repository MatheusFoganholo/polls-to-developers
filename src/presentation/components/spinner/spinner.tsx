import React from 'react';
import Styles from './spinner-styles.scss';

type Props = React.HTMLAttributes<HTMLElement>;

export const Spinner: React.FC<Props> = (props: Props) => {
  return (
    <div
      {...props}
      className={[Styles.spinner, props.className].join(' ')}
      data-testid="spinner"
    >
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
