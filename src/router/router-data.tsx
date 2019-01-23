/**
 * @author []
 * @email []
 * @create date 2018-04-11 01:08:18
 * @modify date 2018-04-11 01:08:18
 * @desc [路由 - 路由文件名必须和namespace保持一致, 且不能重名, 如果不一致则无法检测到当前model是否被加载过]
*/

export default {
  // 首页
  '/': {
    meta: {
      title: '首页'
    },
    models: [],
    component: () => import('views/index/')
  }
};
