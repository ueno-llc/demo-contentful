import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import s from './Cover.scss';

export default class Cover extends Component {

  static propTypes = {
    children: PropTypes.object,
  }

  render() {
    const { children } = this.props;

    return (
      <div className={s.cover}>
        <div className={s.cover__container}>
          <img
            className={s.cover__img}
            src={get(children, 'file.url')}
            alt=""
          />
        </div>
      </div>
    );
  }
}
