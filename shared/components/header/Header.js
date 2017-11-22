import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import UenoLogoSvg from 'assets/images/ueno-logo.svg';

import Button from '../button';

import s from './Header.scss';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <header className={s.header}>
        <div className={s.header__container}>
          <div className={s.header__content}>
            <Link to="/" className={s.header__logo}>
              <UenoLogoSvg className={s.header__logoSvg} />
            </Link>

            <div className={s.header__row}>
              <div className={s.header__navigation}>
                {children}
              </div>

              <div className={s.header__cta}>
                <Button to="/contact-us" stroke>Contact</Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
