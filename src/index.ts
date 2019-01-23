/// <reference path="./types/css-module.d.ts" />

import 'static/scss/app.scss';

import 'es6-promise/auto';
import dva from 'dva';
import createLoading from 'dva-loading';
import browserHistory from 'history/createBrowserHistory';
import appModel from 'models/app';
import router from './router/';

// 移除前后空格
Object.defineProperty(String.prototype, 'trim', {
  writable: false,
  value () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
  }
});

const app = dva({
  ...createLoading({
    effects: true
  }),
  history: browserHistory(),
  onError (error: any) {
    console.log(error);
  }
});

app.model(appModel);
app.router(router);
app.start('#root');
