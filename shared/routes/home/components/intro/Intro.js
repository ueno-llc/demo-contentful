import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/loading';

import s from './Intro.scss';

export default class Intro extends Component {

  static propTypes = {
    heading: PropTypes.string,
    subheading: PropTypes.string,
    copy: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  get loading() {
    return [
      <Loading key="user" width="40%" component="heading" />,
      <Loading key="subheading" width="30%" component="heading" />,
      <Loading key="copy" />,
    ];
  }

  render() {
    const { heading, subheading, copy, isLoading } = this.props;

    const block = [
      <h2 key="heading" className={s.intro__heading}>{heading}</h2>,
      <h2 key="subheading" className={s.intro__heading}>{subheading}</h2>,
      <div key="copy" className={s.intro__content}>{copy}</div>,
    ];

    return (
      <div className={s.intro}>
        <div className={s.intro__container}>
          {isLoading ? this.loading : block}
        </div>
      </div>
    );
  }
}
