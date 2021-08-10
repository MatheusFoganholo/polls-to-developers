import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

type Props = {
  makeLogin: React.FC;
};

export const Router: React.FC<Props> = ({ makeLogin }: Props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={makeLogin} exact />
      </Switch>
    </BrowserRouter>
  );
};
