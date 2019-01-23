/**
 * @author []
 * @email []
 * @create date 2018-05-28 10:11:24
 * @modify date 2018-05-28 10:11:24
 * @desc [ajax请求]
*/

import axios from 'axios';
import stringify from 'qs/lib/stringify';
import config from 'config/';

interface Ioptions {
  // 请求方法
  method?: string;
  // post请求参数
  data?: any;
  // get请求参数
  params?: any;
  // 是否序列化参数
  isStringify?: boolean;
  // headers
  headers?: object;
}

// 默认配置
const defaultConfig = {
  method: 'get',
  isStringify: true,
  params: {}
};

export default async (url: string, options?: Ioptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 深拷贝
    const optionsStr: string = JSON.stringify(options || {});
    options = JSON.parse(optionsStr);

    // 自动添加域名
    if (url.indexOf('http') !== 0) {
      url = config.apiPath + url;
    }

    // 合并
    options = Object.assign({ url }, defaultConfig, options);

    // post请求使用stringify序列化参数
    if (options.method === 'post' && options.isStringify && options.data) {
      options.data = stringify(options.data);
    }

    axios(options)
      .then((res: any) => {
        res = res.data;
        // 判断后台的状态
        if (String(res.code).indexOf('18') === 0) {
          resolve(res);
          return;
        }
        reject(res);
      })
      .catch((error) => {
        const res = error.response ? error.response.data || {} : {};
        const message: string = res.message || '请求失败';
        reject(message);
      });
  });
};
