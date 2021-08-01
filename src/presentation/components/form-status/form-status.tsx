import React, { useContext } from 'react';
import FormContext from '@/presentation/contexts/form/form-context';
import { Spinner } from '@/presentation/components';
import Styles from './form-status-styles.scss';

export const FormStatus: React.FC = () => {
  const {
    state: { isLoading },
    errorState: { request }
  } = useContext(FormContext);

  return (
    <div className={Styles.errorWrapper} data-testid="error-wrapper">
      {isLoading && <Spinner className={Styles.spinner} />}
      {request && <span className={Styles.error}>{request}</span>}
    </div>
  );
};
