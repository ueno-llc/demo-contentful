import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/loading';

import s from './Intro.scss';

export default class Intro extends Component {

  static propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
  }

  get loading() {
    return <Loading height="4.5em" />;
  }

  render() {
    const { children, isLoading } = this.props;

    return (
      <div className={s.intro}>
        <div className={s.intro__container}>
          <div className={s.intro__row}>
            <div className={s.intro__col}>
              {isLoading ? this.loading : <h4 className={s.intro__title}>{children}</h4>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
