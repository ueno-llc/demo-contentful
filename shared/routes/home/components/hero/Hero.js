import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Hero.scss';

export default class Hero extends PureComponent {

  static propTypes = {
    heroTitle: PropTypes.string,
    heroDescription: PropTypes.string,
    heroColor: PropTypes.string,
  }

  render() {
    const { heroTitle, heroDescription, heroColor } = this.props;

    return (
      <div className={s.hero} style={{ backgroundColor: heroColor }}>
        <div className={s(s.hero__container, s.hero__top)}>
          <div className={s.hero__row}>
            <div className={s.hero__content}>
              <h1 className={s.hero__title}>{heroTitle}</h1>
              <p className={s.hero__text}>{heroDescription}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
