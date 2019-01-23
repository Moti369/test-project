/**
 * @create date 2018-03-16 10:50:17
 * @modify date 2018-03-16 10:50:17
 * @desc [公用方法]
*/

// 系统平台
interface Ioutput {
  ios: boolean;
  android: boolean;
}

/**
 * @name 对比路由关系
 * @param path1 路由地址1
 * @param path2 路由地址2
 */
function getRelation (path1: string, path2: string): number {
  // 分割成数组
  const list1 = path1.split('/');
  const list2 = path2.split('/');
  if (list2.every((path, index) => path === list1[index])) {
    return 1;
  } else if (list1.every((path, index) => path === list2[index])) {
    return 2;
  }
  return 3;
}

/**
 * @name redux中推迟执行
 * @param time 推迟时间
 */
export function timeDelay (time = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// 获取url参数
export function getParams (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}

/**
 * @name 获取二级路由
 * @param path 上级路由地址
 * @param routerData 路由数据
 */
export function getRoutes (path, routerData): any {
  let routes = Object.keys(routerData)
    .filter(item => item.indexOf(path) === 0 && item !== path)
    .map(item => item.replace(path, ''));

  // 路由列表
  let routeList = [];
  if (routes.length) {
    routeList.push(routes[0]);
    for (let index = 1; index < routes.length; index++) {
      const path = routes[index];
      const isAdd = routeList.every(item => getRelation(item, path) === 3);
      routeList = routeList.filter((item) => getRelation(item, path) !== 1);
      if (isAdd) {
        routeList.push(path);
      }
    }
  }

  // 生成路由数组
  return routeList.map((item) => {
    // 是否严格匹配
    const exact = !routes.some((route) => route !== item && getRelation(route, item) === 1);
    const routePath = `${path}${item}`;

    return {
      exact,
      key: routePath,
      path: routePath,
      component: routerData[routePath].component
    };
  });
}

// 系统平台判断
export const systemPlatform: Ioutput = (() => {
  const output: Ioutput = {
    ios: null,
    android: null
  };
  if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    output.ios = true;
  } else if (navigator.userAgent.match(/android/i)) {
    output.android = true;
  }
  return output;
})();

/**
 *
 * @param fun 回掉函数
 * @param waitTime 节流时间
 */
export function debounce (fun, waitTime = 500) {
  let timeout = null;

  return function (value) {
    const self = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fun.apply(self, Array.prototype.slice.call(arguments));
    }, waitTime);
  };
}
