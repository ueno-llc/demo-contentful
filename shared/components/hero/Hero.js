import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './Hero.scss';

export default class Hero extends Component {

  static propTypes = {
    children: PropTypes.node,
    background: PropTypes.string,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  loadingContent() {
    return (
      <div>
        <h1>Loading Loading</h1>
        <h1>Loading Loadin</h1>
        <h2>Loading Lo</h2>
        <p>Loading Loading Loading Loading Loading Loading</p>
        <p>Loading Loading Loading Loading Loading Loading</p>
        <p>Loading Loading Loading Loading Loading Loading</p>
        <p>Loading Loading Loading</p>
      </div>
    );
  }

  render() {
    const { children, color, background, isLoading } = this.props;

    return (
      <div className={s(s.hero, { isLoading, white: color === 'white' })} style={{ backgroundColor: background }}>
        <div className={s.hero__container}>
          <div className={s.hero__row}>
            <div className={s.hero__col}>
              {isLoading ? this.loadingContent() : children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
