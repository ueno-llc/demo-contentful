import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Group.scss';

export default class Group extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className={s.group}>
        {children}
      </div>
    );
  }
}
