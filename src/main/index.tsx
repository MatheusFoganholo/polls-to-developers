import React from 'react';
import ReactDOM from 'react-dom';
import { makeLogin } from './factories/pages/login/login-factory';
import { Router } from '@/presentation/components';
import '@/presentation/styles/global.scss';

ReactDOM.render(
  <Router makeLogin={makeLogin} />,
  document.getElementById('main')
);
