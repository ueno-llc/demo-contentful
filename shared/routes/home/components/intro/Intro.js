import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './Intro.scss';

export default class Intro extends Component {

  static propTypes = {
    heading: PropTypes.string,
    subheading: PropTypes.string,
    copy: PropTypes.string,
  };

  render() {
    const { heading, subheading, copy } = this.props;

    return (
      <div className={s.intro}>
        <div className={s.intro__container}>
          <h2 className={s.intro__heading}>{heading}</h2>
          <h2 className={s.intro__heading}>{subheading}</h2>

          <div className={s.intro__content}>
            {copy}
          </div>
        </div>
      </div>
    );
  }
}
