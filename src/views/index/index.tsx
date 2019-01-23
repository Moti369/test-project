const style = require('./index.scss');

import { Iprops, Istate } from './type';
import * as React from 'react';

class View extends React.Component<Iprops, Istate> {
  state = {};

  render () {
    return (
      <div className={style.box}>
        <h2>hello world</h2>
        <h1>这是一个web 前端的基础项目</h1>
      </div>
    );
  }
}

export default View;
