## react 项目架构基础文档
### 目录结构
```
├── src
│  ├── base-components // 组建目录 - 与业务逻辑无关, 可直接在其他项目使用的组建
│  ├── components // 公用组建目录
│  ├── high-order-components // 公用高阶组件
│  ├── config // 项目配置文件目录
│  │  └── index.ts // 配置文件 - 用于存放接口等公用配置
│  ├── models // dva models文件目录
│  │  ├── app.ts // 全局 model - 用于存放app中一些全局的状态和数据
│  │  └── public // 公用model
│  ├── router // 路由配置目录
│  │  ├── index.tsx // 路由入口
│  │  ├── router-data.tsx // 项目路由管理文件
│  │  └── utils.tsx // 路由工具
│  ├── services // dva services文件目录
│  │  └── public // 公用service
│  ├── static // 静态资源目录 - 用于存放图片，字体等资源
│  │  ├── images
│  │  └── scss
│  │  └── font-icon
│  ├── types // typescript公用类型声明文件
│  │  └── css-module.d.ts // import css声明
│  ├── utils // 工具函数目录
│  │  ├── ajax.ts // ajax请求库
│  │  └── index.ts // 公用方法
│  └── views // 路由试图目录
│      ├── index
          └── index.tsx // react代码
          └── index.scss // 样式
          └── type.ts // props state类型声明文件
│  ├── index.ejs // 项目html入口
│  ├── index.ts // js入口
├── package.json
├── tsconfig.json
├── tslint.json
├── webpack.config.js
```

### 技术架构
- react
- dva
- react-router
- roadhog
- typescript
- sass


### 说明:
- 代码风格应严格遵循```eslint```和```tslint```配置的规则，无特殊情况，不得随意禁用规则

- css样式中公用的颜色, 间距, 宽度等需要写如```static/sass/var.scss```中进行变量声明

- sass中如何使用webpack中配置的短路径
    - 在引入sass文件中使用```~名称```可以调用到webpack中的```alias```
    - 案例: 
        ```sass
        @import '~static/scss/var.css';
        ```
- css module中如何定义全局变量 - 只需要使用```:global```进行包裹
    - 案例:
    ```sass
    :global {
        .title {
            font-size: 22px;
        }
    }
    ```

- base-component, component, models, services, views等文件目录下需再次进行分类

- base-components中不得存放与业务相关的组建, 组建尽可能的遵循单一职责原则，后续可以将base-components下的组建封装成npm包

- router-data.js 配置（路由的架构方案参考了ant pro）: 
    - 在使用子路由的时候配置文件中上级路由必须要在下级路由的上面, 例如:
    ```
    export default {
      '/user': {
        meta: {
          title: '用户管理'
        },
        component: () => import('views/user/')
      },
      '/user/list': {
        meta: {
          title: '用户列表'
        },
        component: () => import('views/user/list')
      },
      '/user/detail': {
        meta: {
          title: '用户详情'
        },
        component: () => import('views/user/detail')
      }
    };
    ```
    上述配置中 ```/user/detail```和```/user/list```是```/user```的子路由, 所以配置文件中```/user```必须在其子路由的顶层

    - meta
        - type: any
        - 属性会自动注入当前页面组建的```props```中, 例如我们访问了/user/list页面, 在list页面中可以使用```this.props.meta```访问到meta属性
    - models:
        - type: array<string>
        - model路基 - 所有model都存放于```src/models/```下, 在配置的时候不需要编写```src/models```
        - model的namespace需和文件名一致, 并且是唯一的
        - 案例: 
        ```
        '/user': {
            meta: {
              title: '用户管理'
            },
            models: ['user'] // 相当于src/models/user.ts
            component: () => import('views/user/')
        }
        ```
    - component
        - type: function
        - 为达到页面按需加载，component属性需要为一个函数, 并且返回一个import的组建

- 如何使用二级路由
    - 在```src/router/router-data.js```中进行配置
    - 在需要展示路由的地方调用```getRoutes``` - getRoutes放在存在于```utils/index.ts```中
    - 案例（路由配置案例使用上面user代码）:
        ```javascript
        import { Iprops, Istate } from './type';
        import * as React from 'react';
        import { Route } from 'dva/router';
        // 引入工具函数
        import { getRoutes } from 'utils/';
        
        export default class extends React.Component<Iprops, Istate> {
          render () {
            const { match, routerData } = this.props;
        
            return (
              <div>
                <h1>用户管理 - 上级路由</h1>
                <div className="sub-router-box">
                    {
                        // 获取当前路由下的自路由
                        getRoutes(match.path, routerData).map((item) => {
                          return <Route
                            key={item.key}
                            exact={item.exact}
                            path={item.path}
                            component={item.component}
                          />
                        })
                    }
                </div>
              </div>
            );
          }
        }
        ```
- 类型声明:
    - ```src/types```下用于存放公用```type```声明
    - ```typescript```中```interface```的名称首字母应该大写并且以```I```开通
    - 每一个组建或者view都应对```props```和```state```进行类型声明, 写在同目录下的```type.ts```中, 并且将注视写上
        - 例如:
            ```ts
            export interface Iprops {
                // 轮播图
                banner: Array<string>;
            }
            
            export interface Istate {
                // 获取banner列表
                getBanner: () => Promise<any>;
            }
            ```

- model和service
    - ```view```, ```model```, ```service```中对应的文件名应该保持一致, 正常情况下每一个```view```应该有对应的```model```和```service```
    - 如果有公用的```model```或者```service```应该单独分离出来, 存放在```public```中
- 移动端布局适配
    - 页面使用vw适配, 宽度为750px, 在写布局时只需要根据ui的宽度进行编写
    - 例如某个按钮ui设计为750px, css中width也只需要750px
