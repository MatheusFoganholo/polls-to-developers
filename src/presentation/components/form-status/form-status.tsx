import React, { useContext } from 'react';
import FormContext from '@/presentation/contexts/form/form-context';
import { Spinner } from '@/presentation/components';
import Styles from './form-status-styles.scss';

export const FormStatus: React.FC = () => {
  const {
    state: { isLoading, requestError }
  } = useContext(FormContext);

  return (
    <div className={Styles.errorWrapper} data-testid="error-wrapper">
      {isLoading && <Spinner className={Styles.spinner} />}
      {requestError && (
        <span className={Styles.error} data-testid="request-error">
          {requestError}
        </span>
      )}
    </div>
  );
};
