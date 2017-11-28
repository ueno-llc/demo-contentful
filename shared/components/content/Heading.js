import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/loading';

import s from './Heading.scss';

export class Heading extends Component {

  static propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
  }

  get loading() {
    return <Loading component="heading" />;
  }

  render() {
    const { children, isLoading } = this.props;

    return (
      <div className={s.heading}>
        <div className={s.heading__container}>
          <div className={s.heading__row}>
            <div className={s.heading__col}>
              {isLoading ? this.loading : <h1>{children}</h1>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Heading;
