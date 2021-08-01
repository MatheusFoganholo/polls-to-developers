import React from 'react';
import { Spinner } from '@/presentation/components/spinner/spinner';
import Styles from './form-status-styles.scss';

export const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorWrapper}>
      <Spinner className={Styles.spinner} />
      <span className={Styles.error}>Erro</span>
    </div>
  );
};
