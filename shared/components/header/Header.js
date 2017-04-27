import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import s from './Header.scss';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <header className={s.header}>
        <div className={s.header__container}>
          <div className={s.header__content}>
            <Link to="/" className={s.header__logo}>
               Lorem Ipsum
            </Link>

            <div className={s.header__navigation}>
              {this.props.children}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
