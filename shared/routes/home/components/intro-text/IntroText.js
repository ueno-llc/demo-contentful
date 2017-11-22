import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './IntroText.scss';

export default class IntroText extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <div className={s.introText}>
        {children}
      </div>
    );
  }
}
