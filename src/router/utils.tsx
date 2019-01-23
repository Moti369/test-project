
import * as React from 'react';
import dynamic from 'dva/dynamic';
import routerData from './router-data';

let routerDataCache = null;

// 获取url上的参数
function getUrlQuery (url: string) {
  url = url.split('?')[1];
  if (url) {
    const queryList: Array<string> = url.split('&');
    const query = {};
    queryList.forEach((item) => {
      const data = item.split('=');
      query[data[0]] = data[1];
    });
    return query;
  }
  return {};
}

// 判断model是否被已经加载过
function modelIsExistence (app, model): boolean {
  // 截取名称
  const name: string = model.substring(model.lastIndexOf('/') + 1, model.length);

  return !app._models.some(item => {
    return item.namespace === name;
  });
}

// 异步加载和models处理
function asyncRouter (app) {
  return ({ meta = {}, models = [], component, }) => {
    const options: any = {
      app,
      models: () => models.filter(model => modelIsExistence(app, model)).map(model => import(`../models/${model}`)),
      component: () => {
        if (!routerDataCache) {
          routerDataCache = getRouterData(app);
        }

        return component().then((value) => {
          const Component = value.default || value;
          return (props) => {
            const query = getUrlQuery(props.location.search);
            props.match.query = query;
            return <Component {...props} meta={meta} routerData={routerDataCache} />;
          };
        });
      }
    };
    return dynamic(options);
  };
}

// 获取路由数据
export function getRouterData (app) {
  const routers = {};
  const asyncHandleRouter = asyncRouter(app);
  Object.keys(routerData).forEach((key) => {
    const item = routerData[key];
    routers[key] = {
      component: asyncHandleRouter(item)
    };
  });
  return routers;
}
