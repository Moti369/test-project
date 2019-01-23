import * as React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { getRoutes } from 'utils/';
import { getRouterData } from './utils';

export default function ({ history, app }) {
  const routerData = getRouterData(app);

  const routers = getRoutes('/', routerData).map((item) => {
    return (
      <Route
        key={item.key}
        exact={item.exact}
        path={item.path}
        component={item.component}
      />
    );
  });

  return (
    <Router history={history}>
      <Switch>
        <Route
          key='/'
          exact={true}
          path='/'
          component={routerData['/'].component}
        />
          {routers}
      </Switch>
    </Router>
  );
}
